import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { draftAccessionNote } from './assistant.ts';
import { AccessionNoteSchema } from './schemas.ts';

const fixtureNote = { accessionId: 'BC-102', draftNote: 'Carved oak tray. Maker and date are not recorded. Cedar Study Group donation,2015.', missingFields: ['maker', 'date'], approvalAuthority: 'curator', humanApprovalRequired: true };

function createControlledClient(outputText: string | null, status: 'completed' | 'incomplete' = 'completed') {
  const requests: Record<string, unknown>[] = [];
  const client = new OpenAI({ apiKey: 'fixture-only', maxRetries: 0, fetch: async (url, init) => {
    assert.equal(String(url), 'https://api.openai.com/v1/responses');
    requests.push(JSON.parse(String(init?.body)));
    return new Response(JSON.stringify({ id: 'resp_fixture', object: 'response', created_at: 0, model: 'fixture-model', status, output: outputText === null ? [] : [{ type: 'message', id: 'msg_fixture', status: 'completed', role: 'assistant', content: [{ type: 'output_text', text: outputText, annotations: [] }] }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  } });
  return { client, requests };
}

test('real client sends canonical instructions and schema and returns a read-only curator-review draft', async () => {
  const dataUrl = new URL('../data/accessions.json', import.meta.url);
  const recordsBefore = await readFile(dataUrl, 'utf8');
  const { client, requests } = createControlledClient(JSON.stringify(fixtureNote));
  const result = await draftAccessionNote('BC-102', { client, model: 'fixture-model' });
  assert.deepEqual(result, fixtureNote);
  assert.equal(requests.length, 1);
  const outgoing = requests[0];
  const canonicalInstructions = await readFile(new URL('../moldea/agents/accession-note/instruction.md', import.meta.url), 'utf8');
  assert.equal(outgoing?.instructions, canonicalInstructions.trim());
  assert.match(String(outgoing?.instructions), /curator approves accession readiness/);
  assert.match(String(outgoing?.instructions), /never approve/);
  assert.equal(outgoing?.model, 'fixture-model');
  assert.deepEqual(JSON.parse(String(outgoing?.input)), { id: 'BC-102', description: 'Carved oak tray', maker: null, date: null, provenance: 'Cedar Study Group donation,2015' });
  assert.equal(outgoing?.store, false);
  assert.deepEqual((outgoing?.text as { format: unknown }).format, zodTextFormat(AccessionNoteSchema, 'accession_note'));
  assert.equal((outgoing?.text as { format: { strict: boolean } }).format.strict, true);
  assert.equal(await readFile(dataUrl, 'utf8'), recordsBefore);
});

for (const { name, accessionId, modelFields, expectedFields } of [
  { name: 'all gaps omitted', accessionId: 'BC-102', modelFields: [], expectedFields: ['maker', 'date'] },
  { name: 'one gap omitted', accessionId: 'BC-102', modelFields: ['maker'], expectedFields: ['maker', 'date'] },
  { name: 'known provenance reported missing', accessionId: 'BC-102', modelFields: ['provenance'], expectedFields: ['maker', 'date'] },
  { name: 'duplicates and reversed order', accessionId: 'BC-102', modelFields: ['date', 'maker', 'maker', 'date'], expectedFields: ['maker', 'date'] },
  { name: 'invented gaps in a complete record', accessionId: 'BC-101', modelFields: ['maker', 'date', 'provenance'], expectedFields: [] },
  { name: 'known date duplicated while maker and provenance omitted', accessionId: 'BC-103', modelFields: ['date', 'date'], expectedFields: ['maker', 'provenance'] },
]) {
  test(`derives missingFields from source nulls: ${name}`, async () => {
    const modelNote = { ...fixtureNote, accessionId, draftNote: 'Fictional accession draft for curator review.', missingFields: modelFields };
    const { client, requests } = createControlledClient(JSON.stringify(modelNote));
    const result = await draftAccessionNote(accessionId, { client, model: 'fixture-model' });
    assert.deepEqual(result, { ...modelNote, missingFields: expectedFields });
    assert.equal(requests.length, 1);
    assert.equal(JSON.parse(String(requests[0]?.input)).id, accessionId);
  });
}

test('rejects a draft for a different accession instead of relabeling it', async () => {
  const { client, requests } = createControlledClient(JSON.stringify({ ...fixtureNote, accessionId: 'BC-103' }));
  await assert.rejects(draftAccessionNote('BC-102', { client, model: 'fixture-model' }), /Accession note identifier does not match the requested accession/);
  assert.equal(requests.length, 1);
});

test('rejects malformed note JSON', async () => {
  const { client, requests } = createControlledClient('{');
  await assert.rejects(draftAccessionNote('BC-102', { client, model: 'fixture-model' }), SyntaxError);
  assert.equal(requests.length, 1);
});

for (const { name, changes } of [
  { name: 'missing missingFields', changes: { missingFields: undefined } },
  { name: 'non-array missingFields', changes: { missingFields: 'maker' } },
  { name: 'unsupported missing-field name', changes: { missingFields: ['material'] } },
  { name: 'empty draftNote', changes: { draftNote: '' } },
  { name: 'empty accessionId', changes: { accessionId: '' } },
  { name: 'non-curator approval authority', changes: { approvalAuthority: 'assistant' } },
  { name: 'human approval disabled', changes: { humanApprovalRequired: false } },
  { name: 'missing human approval flag', changes: { humanApprovalRequired: undefined } },
  { name: 'unexpected approval property', changes: { approved: true } },
]) {
  test(`rejects malformed structured notes before normalization: ${name}`, async () => {
    const { client, requests } = createControlledClient(JSON.stringify({ ...fixtureNote, ...changes }));
    await assert.rejects(draftAccessionNote('BC-102', { client, model: 'fixture-model' }), { name: 'ZodError' });
    assert.equal(requests.length, 1);
  });
}

for (const { name, outputText, status } of [
  { name: 'incomplete response with otherwise valid note', outputText: JSON.stringify(fixtureNote), status: 'incomplete' },
  { name: 'completed response without text output', outputText: null, status: 'completed' },
  { name: 'completed response with empty text', outputText: '', status: 'completed' },
] as const) {
  test(`rejects ${name}`, async () => {
    const { client, requests } = createControlledClient(outputText, status);
    await assert.rejects(draftAccessionNote('BC-102', { client, model: 'fixture-model' }), /No completed structured accession note/);
    assert.equal(requests.length, 1);
  });
}

test('rejects unknown identifiers before calling the model', async () => {
  const { client, requests } = createControlledClient(JSON.stringify(fixtureNote));
  await assert.rejects(draftAccessionNote('BC-999', { client, model: 'fixture-model' }), /Unknown accession identifier/);
  assert.equal(requests.length, 0);
});

test('rejects empty identifiers before calling the model', async () => {
  const { client, requests } = createControlledClient(JSON.stringify(fixtureNote));
  await assert.rejects(draftAccessionNote('', { client, model: 'fixture-model' }), { name: 'ZodError' });
  assert.equal(requests.length, 0);
});
