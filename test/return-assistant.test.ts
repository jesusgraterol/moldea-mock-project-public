import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test, type TestContext } from 'node:test';
import { NoObjectGeneratedError, ToolLoopAgent, zodSchema } from 'ai';
import { MockLanguageModelV4 } from 'ai/test';
import {
  StaffRecommendationSchema,
  type GroundedFacts,
  type ReturnRequest,
  type StaffRecommendation,
} from '../src/contracts.ts';
import { createReturnAgent, draftReturnRecommendation } from '../src/return-assistant.ts';

type ModelReply = Awaited<ReturnType<MockLanguageModelV4['doGenerate']>>;

function reply(content: ModelReply['content'], finishReason: 'stop' | 'tool-calls'): ModelReply {
  return {
    content,
    finishReason: { unified: finishReason, raw: undefined },
    usage: {
      inputTokens: { total: 10, noCache: 10, cacheRead: undefined, cacheWrite: undefined },
      outputTokens: { total: 20, text: 20, reasoning: undefined },
    },
    warnings: [],
  };
}

function mockModel(orderId: string, finalText: string) {
  return new MockLanguageModelV4({
    doGenerate: [
      reply([{
        type: 'tool-call', toolCallId: 'lookup-1', toolName: 'lookup_order',
        input: JSON.stringify({ orderId }),
      }], 'tool-calls'),
      reply([{ type: 'text', text: finalText }], 'stop'),
    ],
  });
}

function knownRecommendation(
  requestedAt: string,
  elapsedMs: number,
  status: 'within_window' | 'outside_window',
): StaffRecommendation {
  return {
    requestedOrderId: 'CR-101',
    supportingOrder: { id: 'CR-101', reference: 'CINDER-101' },
    lookupStatus: 'found',
    assessment: {
      status, reason: 'assessed', deliveredAt: '2026-10-01T12:00:00.000Z',
      requestedAt, elapsedMs, windowMs: 1_814_400_000,
    },
    missingFacts: [],
    recommendation: status === 'within_window' ? 'recommend_within_window' : 'recommend_outside_window',
    rationale: `The supplied timestamps are ${elapsedMs} milliseconds apart. Staff must review.`,
    staffApproval: { required: true, status: 'pending' },
    authority: 'recommendation_only',
  };
}

function unknownRecommendation(
  orderId: string,
  lookupStatus: StaffRecommendation['lookupStatus'],
  reason: StaffRecommendation['assessment']['reason'],
): StaffRecommendation {
  return {
    requestedOrderId: orderId,
    supportingOrder: lookupStatus === 'found' ? { id: orderId, reference: orderId.replace('CR-', 'CINDER-') } : null,
    lookupStatus,
    assessment: {
      status: 'unknown', reason, deliveredAt: null,
      requestedAt: '2026-10-15T12:00:00.000Z', elapsedMs: null, windowMs: 1_814_400_000,
    },
    missingFacts: lookupStatus === 'found' ? ['delivery_timestamp'] : ['order_record', 'delivery_timestamp'],
    recommendation: 'needs_more_information',
    rationale: 'The evidence is incomplete. Staff must obtain the missing facts and review.',
    staffApproval: { required: true, status: 'pending' },
    authority: 'recommendation_only',
  };
}

function factsOf({ rationale: _rationale, ...facts }: StaffRecommendation): GroundedFacts {
  return facts;
}

function toolOutput(model: MockLanguageModelV4) {
  const secondCall = model.doGenerateCalls[1];
  assert.ok(secondCall, 'the real SDK must make the continuation call');
  const message = secondCall.prompt.find((entry) => entry.role === 'tool');
  assert.ok(message && message.role === 'tool');
  const result = message.content[0];
  assert.ok(result && result.type === 'tool-result');
  assert.equal(result.toolName, 'lookup_order');
  assert.equal(result.toolCallId, 'lookup-1');
  return result.output;
}

async function assertConnection(model: MockLanguageModelV4, expected: StaffRecommendation) {
  assert.equal(model.doGenerateCalls.length, 2);
  const first = model.doGenerateCalls[0];
  const second = model.doGenerateCalls[1];
  assert.ok(first && second);
  const canonical = await readFile(
    resolve(import.meta.dirname, '../moldea/agents/returns-assistant/instruction.md'), 'utf8',
  );
  for (const call of [first, second]) {
    assert.deepEqual(call.prompt[0], { role: 'system', content: canonical });
    assert.deepEqual(call.responseFormat, {
      type: 'json', name: 'staff_return_recommendation',
      schema: await zodSchema(StaffRecommendationSchema).jsonSchema,
    });
  }
  assert.deepEqual(first.tools?.map((entry) => entry.name), ['lookup_order']);
  assert.deepEqual(first.toolChoice, { type: 'tool', toolName: 'lookup_order' });
  assert.equal(second.tools?.length ?? 0, 0);
  assert.deepEqual(toolOutput(model), { type: 'json', value: factsOf(expected) });
}

async function fixture(t: TestContext, contents: string): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'cinder-returns-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const file = join(directory, 'orders.json');
  await writeFile(file, contents);
  return file;
}

const boundary = knownRecommendation('2026-10-22T12:00:00.000Z', 1_814_400_000, 'within_window');

for (const [name, expected] of [
  ['sample request within the window', knownRecommendation('2026-10-15T12:00:00.000Z', 1_209_600_000, 'within_window')],
  ['exactly 21 elapsed days is included', boundary],
  ['one millisecond beyond 21 days is excluded', knownRecommendation('2026-10-22T12:00:00.001Z', 1_814_400_001, 'outside_window')],
  ['known order with missing delivery stays unknown', unknownRecommendation('CR-102', 'found', 'missing_delivery')],
  ['unknown identifier does not become a supporting order', unknownRecommendation('CR-999', 'not_found', 'order_not_found')],
] as const) {
  test(name, async () => {
    const request: ReturnRequest = { orderId: expected.requestedOrderId, requestedAt: expected.assessment.requestedAt };
    const model = mockModel(request.orderId, JSON.stringify(expected));
    const recordsBefore = await readFile(resolve(import.meta.dirname, '../data/orders.json'), 'utf8');
    assert.deepEqual(await draftReturnRecommendation(request, { model }), expected);
    await assertConnection(model, expected);
    assert.equal(await readFile(resolve(import.meta.dirname, '../data/orders.json'), 'utf8'), recordsBefore);
  });
}

test('factory returns a real ToolLoopAgent and its actual two-step result is parsed', async () => {
  const model = mockModel('CR-101', JSON.stringify(boundary));
  const request = { orderId: 'CR-101', requestedAt: boundary.assessment.requestedAt };
  const agent = await createReturnAgent(request, { model });
  assert.ok(agent instanceof ToolLoopAgent);
  assert.deepEqual(Object.keys(agent.tools), ['lookup_order']);
  const result = await agent.generate({ prompt: JSON.stringify(request) });
  assert.equal(result.steps.length, 2);
  assert.equal(result.steps[0]?.toolResults.length, 1);
  assert.deepEqual(result.steps[0]?.toolResults[0]?.output, factsOf(boundary));
  assert.deepEqual(result.output, boundary);
  await assert.rejects(agent.generate({ prompt: JSON.stringify(request) }), /new return agent/);
});

test('a real filesystem read failure stays unavailable, not not_found or eligible', async (t) => {
  const existingFile = await fixture(t, '[]');
  const expected = unknownRecommendation('CR-101', 'unavailable', 'lookup_failed');
  const model = mockModel('CR-101', JSON.stringify(expected));
  const result = await draftReturnRecommendation(
    { orderId: 'CR-101', requestedAt: expected.assessment.requestedAt },
    { model, ordersFile: `${existingFile}.missing` },
  );
  assert.deepEqual(result, expected);
  await assertConnection(model, expected);
});

for (const [name, contents] of [
  ['malformed JSON', '{'],
  ['invalid order records', '[{"id":"CR-101"}]'],
  ['ambiguous duplicate identifiers', JSON.stringify([
    { id: 'CR-101', reference: 'CINDER-101', item: 'Lamp', deliveredAt: null },
    { id: 'CR-101', reference: 'CINDER-OTHER', item: 'Tray', deliveredAt: null },
  ])],
] as const) {
  test(`${name} cannot establish eligibility`, async (t) => {
    const ordersFile = await fixture(t, contents);
    const expected = unknownRecommendation('CR-101', 'unavailable', 'lookup_failed');
    const model = mockModel('CR-101', JSON.stringify(expected));
    assert.deepEqual(await draftReturnRecommendation(
      { orderId: 'CR-101', requestedAt: expected.assessment.requestedAt }, { model, ordersFile },
    ), expected);
    await assertConnection(model, expected);
  });
}

for (const [name, delivery, reason] of [
  ['absent delivery field', {}, 'missing_delivery'],
  ['invalid delivery timestamp', { deliveredAt: 'not-a-date' }, 'invalid_delivery'],
  ['sub-millisecond delivery', { deliveredAt: '2026-10-01T12:00:00.0001Z' }, 'invalid_delivery'],
] as const) {
  test(name, async (t) => {
    const ordersFile = await fixture(t, JSON.stringify([
      { id: 'CR-101', reference: 'CINDER-101', item: 'Lamp', ...delivery },
    ]));
    const expected = unknownRecommendation('CR-101', 'found', reason);
    const model = mockModel('CR-101', JSON.stringify(expected));
    assert.deepEqual(await draftReturnRecommendation(
      { orderId: 'CR-101', requestedAt: expected.assessment.requestedAt }, { model, ordersFile },
    ), expected);
    await assertConnection(model, expected);
  });
}

test('request before delivery is inconsistent, not eligible', async () => {
  const expected: StaffRecommendation = {
    ...knownRecommendation('2026-10-01T11:59:59.999Z', -1, 'within_window'),
    recommendation: 'needs_more_information',
  };
  expected.assessment.status = 'unknown';
  expected.assessment.reason = 'request_before_delivery';
  const model = mockModel('CR-101', JSON.stringify(expected));
  assert.deepEqual(await draftReturnRecommendation(
    { orderId: 'CR-101', requestedAt: expected.assessment.requestedAt }, { model },
  ), expected);
  await assertConnection(model, expected);
});

for (const input of [
  { orderId: 'CR-101' },
  { orderId: 'CR-101', requestedAt: '2026-02-30T12:00:00.000Z' },
  { orderId: 'CR-101', requestedAt: '2026-10-22T12:00:00+01:00' },
  { orderId: 'CR-101', requestedAt: '2026-10-22T12:00:00.0001Z' },
]) {
  test(`invalid request fails before model invocation: ${JSON.stringify(input)}`, async () => {
    const model = new MockLanguageModelV4();
    await assert.rejects(draftReturnRecommendation(input, { model }), TypeError);
    assert.equal(model.doGenerateCalls.length, 0);
  });
}

for (const [name, output] of [
  ['invalid JSON', '{'],
  ['missing required fields', '{}'],
  ['invented supporting reference', JSON.stringify({ ...boundary, supportingOrder: { id: 'CR-101', reference: 'FAKE' } })],
  ['swapped requested order', JSON.stringify({ ...boundary, requestedOrderId: 'CR-103' })],
  ['invented elapsed time', JSON.stringify({ ...boundary, assessment: { ...boundary.assessment, elapsedMs: 0 } })],
  ['contradictory recommendation', JSON.stringify({ ...boundary, recommendation: 'recommend_outside_window' })],
  ['invented missing facts', JSON.stringify({ ...boundary, missingFacts: ['delivery_timestamp'] })],
  ['staff approval bypass', JSON.stringify({ ...boundary, staffApproval: { required: false, status: 'approved' } })],
  ['operational action field', JSON.stringify({ ...boundary, refundIssued: true })],
] as const) {
  test(`actual Output.object parsing rejects ${name}`, async () => {
    const model = mockModel('CR-101', output);
    await assert.rejects(draftReturnRecommendation(
      { orderId: 'CR-101', requestedAt: boundary.assessment.requestedAt }, { model },
    ), (error: unknown) => NoObjectGeneratedError.isInstance(error));
    assert.equal(model.doGenerateCalls.length, 2);
    assert.deepEqual(toolOutput(model), { type: 'json', value: factsOf(boundary) });
  });
}

test('missing delivery facts cannot be erased by a plausible model answer', async () => {
  const expected = unknownRecommendation('CR-102', 'found', 'missing_delivery');
  const model = mockModel('CR-102', JSON.stringify({ ...expected, missingFacts: [] }));
  await assert.rejects(draftReturnRecommendation(
    { orderId: 'CR-102', requestedAt: expected.assessment.requestedAt }, { model },
  ), (error: unknown) => NoObjectGeneratedError.isInstance(error));
  assert.deepEqual(toolOutput(model), { type: 'json', value: factsOf(expected) });
});

test('a model cannot skip the lookup and supply fabricated evidence', async () => {
  const model = new MockLanguageModelV4({
    doGenerate: reply([{ type: 'text', text: JSON.stringify(boundary) }], 'stop'),
  });
  await assert.rejects(draftReturnRecommendation(
    { orderId: 'CR-101', requestedAt: boundary.assessment.requestedAt }, { model },
  ), (error: unknown) => error instanceof Error && error.name === 'AI_ToolChoiceViolationError');
  assert.equal(model.doGenerateCalls.length, 1);
});

test('a model cannot look up a different order to ground the requested order', async () => {
  const model = mockModel('CR-103', JSON.stringify(boundary));
  await assert.rejects(draftReturnRecommendation(
    { orderId: 'CR-101', requestedAt: boundary.assessment.requestedAt }, { model },
  ), (error: unknown) => NoObjectGeneratedError.isInstance(error));
  const output = toolOutput(model);
  assert.notEqual(output.type, 'json');
});

test('external model errors propagate without retries or a manufactured decision', async () => {
  const failure = new Error('Model unavailable');
  const model = new MockLanguageModelV4({ doGenerate: async () => { throw failure; } });
  await assert.rejects(draftReturnRecommendation(
    { orderId: 'CR-101', requestedAt: boundary.assessment.requestedAt }, { model },
  ), (error: unknown) => error === failure);
  assert.equal(model.doGenerateCalls.length, 1);
});
