import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { draftAccessionNote } from './assistant.ts';
import { AccessionNoteSchema } from './schemas.ts';

test('existing prototype uses real client with controlled transport and returns a curator-review draft', async () => {
  let outgoing: Record<string, unknown> | undefined;
  const expected = { accessionId: 'BC-102', draftNote: 'Carved oak tray. Maker and date are not recorded. Cedar Study Group donation,2015.', missingFields: ['maker', 'date'], approvalAuthority: 'curator', humanApprovalRequired: true };
  const client = new OpenAI({ apiKey: 'fixture-only', maxRetries: 0, fetch: async (url, init) => {
    assert.equal(String(url), 'https://api.openai.com/v1/responses');
    outgoing = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({ id: 'resp_fixture', object: 'response', created_at: 0, model: 'fixture-model', status: 'completed', output: [{ type: 'message', id: 'msg_fixture', status: 'completed', role: 'assistant', content: [{ type: 'output_text', text: JSON.stringify(expected), annotations: [] }] }] }), { status: 200, headers: { 'content-type': 'application/json' } });
  } });
  const result = await draftAccessionNote('BC-102', { client, model: 'fixture-model' });
  assert.deepEqual(result, expected);
  const canonicalInstructions = await readFile(new URL('../moldea/agents/accession-note/instruction.md', import.meta.url), 'utf8');
  assert.equal(outgoing?.instructions, canonicalInstructions.trim());
  assert.match(String(outgoing?.instructions), /curator approves accession readiness/);
  assert.match(String(outgoing?.instructions), /never approve/);
  assert.equal(JSON.parse(String(outgoing?.input)).id, 'BC-102');
  assert.equal(outgoing?.store, false);
  assert.deepEqual((outgoing?.text as { format: unknown }).format, zodTextFormat(AccessionNoteSchema, 'accession_note'));
  assert.equal((outgoing?.text as { format: { strict: boolean } }).format.strict, true);
});
