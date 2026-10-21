import assert from 'node:assert/strict';
import { mockModel, type MockModelRequest } from 'eve/evals';
import { z } from 'zod';
import canonicalInstruction from '../moldea/agents/quarry-handover/instruction.md?raw';
import procedureSource from '../agent/skills/handover.md?raw';
import { LookupInputSchema, LookupResultSchema, type LookupResult } from '../src/contracts.ts';

const FixtureRequestSchema = LookupInputSchema.extend({ mode: z.enum(['handover', 'lookup']) });
const procedureBody = procedureSource.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();

/** Assertions run on the actual prompt at Eve's documented external-model seam. */
function inspectBoundary(request: MockModelRequest): void {
  assert.ok(request.messages.some((message) =>
    message.role === 'system' && message.text.includes(canonicalInstruction.trim())),
  'The complete canonical instruction must reach the model as system text.');
  assert.deepEqual(request.tools.map((tool) => tool.name).sort(), ['eve__skill', 'lookup_records'],
    'Only the lookup and procedure loader may be model-visible.');
  const schema = request.tools.find((tool) => tool.name === 'lookup_records')?.inputSchema;
  assert.ok(schema && typeof schema === 'object' && 'properties' in schema);
  assert.ok('recordIds' in (schema.properties as object));
  assert.ok('referenceAt' in (schema.properties as object));
}

function draft(result: LookupResult): string {
  const lines = (values: string[]) => values.length ? values.map((value) => `- ${value}`).join('\n') : '- None recorded.';
  const describe = (record: LookupResult['records'][number]) =>
    `[${record.id}] ${record.scope}: ${record.observation} (status: ${record.status}; reportedAt: ${record.reportedAt ?? 'unknown'})`;
  return [
    '# Draft handover — supervisor decisions only',
    `Reference timestamp: ${result.referenceAt ?? 'unknown'}`,
    '## Observations',
    lines(result.records.map(describe)),
    '## Unresolved reports',
    lines(result.records.filter((record) => record.status === 'unresolved').map(describe)),
    '## Missing facts',
    lines([
      ...result.missingRecordIds.map((id) => `[${id}] Record not found; facts unknown.`),
      ...result.records.filter((record) => record.timeIssue !== null)
        .map((record) => `[${record.id}] ${record.timeIssue}; elapsed age unknown; supervisor-review eligibility ${record.supervisorReview === null ? 'unknown' : 'not applicable to resolved report'}.`),
    ]),
    '## Conflicting reports',
    lines(result.potentialConflicts.map((group) => `${group.scope}: ${group.claims.map((claim) => `[${claim.recordId}] ${claim.observation}`).join(' / ')} Supervisor must reconcile; neither claim is selected as authoritative.`)),
    '## Supervisor review',
    lines(result.records.filter((record) => record.supervisorReview === true)
      .map((record) => `[${record.id}] Unresolved for ${record.elapsedMs! / 3_600_000} elapsed hours; requires supervisor review.`)),
    'Draft only. No records changed, notifications sent, staff assigned, or incidents closed.',
  ].join('\n\n');
}

export const fixtureModel = mockModel({
  modelId: 'quarry-handover-fixture',
  provider: 'local-fixture',
  respond(request) {
    inspectBoundary(request);
    let input: unknown;
    try { input = JSON.parse(request.lastUserMessage ?? 'null'); }
    catch {
      assert.equal(request.toolResults.length, 0, 'Unrelated and operational requests must not use tools.');
      return /^hello\b/i.test(request.lastUserMessage ?? '')
        ? 'Hello. I can draft a fictional shift handover when you supply record IDs and a reference timestamp.'
        : 'Draft only. A supervisor must decide; I cannot close incidents, assign staff or execute operational actions.';
    }
    const parsed = FixtureRequestSchema.safeParse(input);
    if (!parsed.success) return 'Supply record IDs and a zoned reference timestamp, or null when the timestamp is unknown.';
    const { mode, ...selection } = parsed.data;
    const lookupInput = { ...selection, referenceAt: selection.referenceAt ?? null };
    const loaded = request.toolResults.find((result) => result.name === 'eve__skill');
    if (mode === 'handover') {
      if (!loaded) {
        assert.ok(!request.messages.some((message) => message.text.includes(procedureBody)),
          'The full procedure must not be eagerly injected.');
        return { toolCalls: [{ name: 'eve__skill', input: { name: 'handover' } }] };
      }
      assert.equal(loaded.isError, false);
      assert.ok(request.messages.some((message) => message.role === 'tool' && message.text.includes(procedureBody)),
        'The actual selected procedure text must reach the model through its tool result.');
    } else {
      assert.equal(loaded, undefined, 'A simple lookup must not load the handover procedure.');
    }
    const lookup = request.toolResults.find((result) => result.name === 'lookup_records');
    if (!lookup) return { toolCalls: [{ name: 'lookup_records', input: lookupInput }] };
    assert.equal(lookup.isError, false, 'The real lookup must succeed.');
    const output = LookupResultSchema.safeParse(lookup.output);
    assert.ok(output.success, 'The real lookup result must reach the model intact.');
    assert.equal(output.data.referenceAt, lookupInput.referenceAt);
    assert.deepEqual(new Set([...output.data.records.map((record) => record.id), ...output.data.missingRecordIds]),
      new Set(lookupInput.recordIds), 'The lookup must account for the selected IDs.');
    return mode === 'handover' ? draft(output.data) : JSON.stringify(output.data);
  },
});
