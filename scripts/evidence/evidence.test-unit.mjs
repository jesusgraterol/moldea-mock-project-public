import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile, readdir, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { afterEach, test } from 'node:test';

const script = join(dirname(fileURLToPath(import.meta.url)), 'evidence.mjs');
const temporaryRoots = [];

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

const setup = async () => {
  const root = join(tmpdir(), `moldea-evidence-${randomUUID()}`);
  await mkdir(root);
  temporaryRoots.push(root);
  const native = join(root, 'native.jsonl');
  const rules = join(root, 'rules.json');
  const output = join(root, 'output');
  await mkdir(output);
  return { root, native, rules, output };
};

const runCapture = ({ native, rules, output }) => spawnSync(process.execPath, [
  script,
  'capture',
  '--session', native,
  '--redactions', rules,
  '--output-root', output,
  '--name', 'session-01.jsonl.gz',
], { encoding: 'utf8' });

test('capture redacts every emitted copy and preserves ordered evidence', async () => {
  const paths = await setup();
  const marker = 'SENSITIVE_MARKER';
  const request = `Review ${marker} today`;
  const toolInput = `{"query":"${marker}"}`;
  const records = [
    { type: 'session_meta', timestamp: '2026-09-27T00:00:00Z', payload: {
      id: '0199c0b1-63da-73a1-b532-4e161922ea2f', cli_version: '0.157.1',
      base_instructions: { text: `private ${marker} instruction`, provenance: { type: 'host' } },
    } },
    { type: 'response_item', timestamp: '2026-09-27T00:00:01Z', payload: {
      type: 'message', role: 'developer', content: [{ type: 'input_text', text: request }],
    } },
    { type: 'response_item', timestamp: '2026-09-27T00:00:02Z', payload: {
      type: 'custom_tool_call', name: 'lookup', call_id: 'call-1', input: toolInput,
    } },
    { type: 'response_item', timestamp: '2026-09-27T00:00:03Z', payload: {
      type: 'custom_tool_call_output', call_id: 'call-1', output: `tool ${marker} result`,
    } },
    { type: 'compacted', timestamp: '2026-09-27T00:00:04Z', payload: {
      message: '',
      replacement_history: [
        { type: 'message', role: 'developer', content: [{ type: 'input_text', text: request }] },
        { type: 'compaction', encrypted_content: 'encrypted-summary' },
      ],
      retained_context: { user_messages: [{ order: 1, turn_id: 'turn-1',
        message_id: 'message-1', text: request, complete: true }] },
    } },
  ];
  await writeFile(paths.native, records.map((record) => JSON.stringify(record)).join('\n') + '\n');
  await writeFile(paths.rules, JSON.stringify({ includeBaseInstructions: true, rules: [
    { id: 'instruction', reason: 'private host instruction', eventOrdinal: 0,
      path: ['payload', 'baseInstructions'] },
    { id: 'request', reason: 'private request detail', eventOrdinal: 1,
      path: ['payload', 'content', 0, 'text'], start: request.indexOf(marker),
      end: request.indexOf(marker) + marker.length },
    { id: 'tool-input', reason: 'private tool input', eventOrdinal: 2,
      path: ['payload', 'input'], start: toolInput.indexOf(marker),
      end: toolInput.indexOf(marker) + marker.length },
    { id: 'tool-output', reason: 'private tool result', eventOrdinal: 3,
      path: ['payload', 'output'] },
    { id: 'replacement', reason: 'private repeated request detail', eventOrdinal: 4,
      path: ['payload', 'replacementHistory', 0, 'content', 0, 'text'],
      start: request.indexOf(marker), end: request.indexOf(marker) + marker.length },
    { id: 'retained', reason: 'private retained request detail', eventOrdinal: 4,
      path: ['payload', 'retainedUserMessages', 0, 'text'],
      start: request.indexOf(marker), end: request.indexOf(marker) + marker.length },
  ] }));

  const result = runCapture(paths);
  assert.equal(result.status, 0, result.stderr);
  const emitted = await readdir(paths.output);
  assert.deepEqual(emitted.sort(), ['session-01.jsonl.gz', 'session-01.jsonl.gz.meta.json']);
  const compressed = await readFile(join(paths.output, emitted[0]));
  const transcript = gunzipSync(compressed).toString('utf8');
  const metadataText = await readFile(join(paths.output, emitted[1]), 'utf8');
  assert.equal(`${transcript}${metadataText}${result.stdout}${result.stderr}`.includes(marker), false);
  const events = transcript.trim().split('\n').map((line) => JSON.parse(line));
  assert.deepEqual(events.map((event) => event.kind), [
    'session', 'message', 'tool-call', 'tool-result', 'compaction',
  ]);
  assert.deepEqual(events.map((event) => event.ordinal), [0, 1, 2, 3, 4]);
  assert.equal(events[1].payload.content[0].text, 'Review [redacted] today');
  assert.deepEqual(events[1].redactionIds, ['request']);
  assert.equal(events[2].payload.name, 'lookup');
  assert.equal(events[2].payload.callId, 'call-1');
  assert.equal(events[2].payload.input, '{"query":"[redacted]"}');
  assert.deepEqual(events[2].redactionIds, ['tool-input']);
  assert.equal(events[3].payload.callId, events[2].payload.callId);
  assert.equal(events[3].payload.output, '[redacted]');
  assert.deepEqual(events[3].redactionIds, ['tool-output']);
  assert.equal(events[4].payload.replacementHistory[0].content[0].text,
    'Review [redacted] today');
  assert.equal(events[4].payload.retainedUserMessages[0].text,
    'Review [redacted] today');
  assert.equal(events[4].payload.encryptedSummaryOmitted, true);
  const metadata = JSON.parse(metadataText);
  assert.deepEqual(metadata.requests, [{
    eventOrdinal: 1, text: 'Review [redacted] today', redactionIds: ['request'],
  }]);
  assert.equal(metadata.eventCount, 5);
  assert.equal(metadata.asset.sizeBytes, compressed.length);
  assert.ok(metadata.omissions.includes('encrypted compaction summary omitted'));
});

test('capture retains a completed web search item and rejects unrecognized extensions', async () => {
  const paths = await setup();
  const item = { type: 'Extension', kind: 'web.search', id: 'search-1',
    query: 'SDK graph documentation', action: { type: 'search', queries: ['SDK graph documentation'] },
    results: [{ type: 'text_result', title: 'Graph API', url: 'https://example.test/graph',
      snippet: 'Recorded search snippet.' }] };
  const records = [
    { type: 'session_meta', timestamp: '2026-10-13T00:00:00Z', payload: {
      id: '0199c0b1-63da-73a1-b532-4e161922ea2f', cli_version: 'test-host' } },
    { type: 'event_msg', timestamp: '2026-10-13T00:00:01Z',
      payload: { type: 'item_completed', item } },
  ];
  await writeFile(paths.native, records.map((record) => JSON.stringify(record)).join('\n') + '\n');
  await writeFile(paths.rules, JSON.stringify({ includeBaseInstructions: false, rules: [] }));
  const result = runCapture(paths);
  assert.equal(result.status, 0, result.stderr);
  const events = gunzipSync(await readFile(join(paths.output, 'session-01.jsonl.gz')))
    .toString('utf8').trim().split('\n').map(JSON.parse);
  assert.equal(events[1].kind, 'tool-call');
  assert.equal(events[1].payload.name, 'web.search');
  assert.equal(events[1].payload.callId, 'search-1');
  assert.equal(events[1].payload.status, 'completed');
  assert.deepEqual(JSON.parse(events[1].payload.input), { query: item.query, action: item.action });
  assert.deepEqual(JSON.parse(events[1].payload.output[0].text), item.results);

  await rm(join(paths.output, 'session-01.jsonl.gz'));
  await rm(join(paths.output, 'session-01.jsonl.gz.meta.json'));
  item.kind = 'unrecognized';
  await writeFile(paths.native, records.map((record) => JSON.stringify(record)).join('\n') + '\n');
  assert.match(runCapture(paths).stderr, /completed native extension needs manual inspection/i);
});

test('capture retains delegation and clock calls, lifecycle and messages with explicit prompt redaction', async () => {
  const paths = await setup();
  const privatePrompt = 'ENCRYPTED_HOST_PROMPT';
  const input = JSON.stringify({ task_name: 'label-check', message: privatePrompt });
  const lifecycle = { type: 'SubAgentActivity', id: 'call-1', kind: 'started',
    agent_thread_id: '0199c0b1-63da-73a1-b532-4e161922ea2f', agent_path: '/root/label-check',
    model: 'test-model', reasoning_effort: 'test-effort' };
  const message = { type: 'agent_message', author: '/root/label-check', recipient: '/root',
    content: [{ type: 'input_text', text: 'Sender: /root/label-check\nFive informal cases inspected.' }] };
  const records = [
    { type: 'session_meta', payload: { id: '0199c0b1-63da-73a1-b532-4e161922ea2f',
      cli_version: 'test-host' } },
    { type: 'response_item', payload: { type: 'function_call', name: 'spawn_agent',
      namespace: 'collaboration', call_id: 'call-1', arguments: input } },
    { type: 'event_msg', payload: { type: 'item_completed', item: lifecycle } },
    { type: 'response_item', payload: { type: 'function_call_output', call_id: 'call-1',
      output: '{"task_name":"/root/label-check"}' } },
    { type: 'event_msg', payload: { type: 'item_completed', item: { ...lifecycle,
      id: 'completed-1', kind: 'completed', model: null, reasoning_effort: null } } },
    { type: 'inter_agent_communication_metadata', payload: { trigger_turn: false } },
    { type: 'response_item', payload: message },
    { type: 'response_item', payload: { type: 'function_call', name: 'sleep', namespace: 'clock',
      call_id: 'clock-1', arguments: '{"duration_ms":1000}' } },
    { type: 'event_msg', payload: { type: 'item_completed', item: {
      type: 'Extension', kind: 'clock.sleep', id: 'clock-1', durationMs: 1000 } } },
    { type: 'response_item', payload: { type: 'function_call_output', call_id: 'clock-1',
      output: 'Wall time: 1.0001 seconds\nSleep completed.' } },
  ];
  await writeFile(paths.native, records.map((record) => JSON.stringify(record)).join('\n') + '\n');
  await writeFile(paths.rules, JSON.stringify({ includeBaseInstructions: false, rules: [{
    id: 'delegation-prompt', reason: 'Encrypted host prompt is unavailable as plaintext.',
    eventOrdinal: 1, path: ['payload', 'input'],
    start: input.indexOf(privatePrompt), end: input.indexOf(privatePrompt) + privatePrompt.length,
  }] }));
  const result = runCapture(paths);
  assert.equal(result.status, 0, result.stderr);
  const text = gunzipSync(await readFile(join(paths.output, 'session-01.jsonl.gz'))).toString();
  const events = text.trim().split('\n').map(JSON.parse);
  assert.equal(text.includes(privatePrompt), false);
  assert.deepEqual(events.map(({ ordinal }) => ordinal), [0, 1, 2, 3, 4, 6, 7, 9]);
  assert.equal(events[1].payload.name, 'collaboration.spawn_agent');
  assert.equal(events[1].payload.status, 'recorded');
  assert.deepEqual(JSON.parse(events[1].payload.input), { task_name: 'label-check', message: '[redacted]' });
  assert.deepEqual(JSON.parse(events[2].payload.content[0].text), lifecycle);
  assert.deepEqual(events[3].payload.output, [{ type: 'output_text', text: '{"task_name":"/root/label-check"}' }]);
  assert.deepEqual(JSON.parse(events[4].payload.content[0].text).model, null);
  assert.deepEqual(events[5].payload, { role: 'assistant', author: message.author,
    recipient: message.recipient, content: message.content });
  assert.equal(events[6].payload.name, 'clock.sleep');
  assert.equal(events[6].payload.input, '{"duration_ms":1000}');
  assert.deepEqual(events[7].payload.output,
    [{ type: 'output_text', text: 'Wall time: 1.0001 seconds\nSleep completed.' }]);
  const metadataText = await readFile(join(paths.output, 'session-01.jsonl.gz.meta.json'), 'utf8');
  const metadata = JSON.parse(metadataText);
  assert.deepEqual(metadata.requests.map(({ eventOrdinal }) => eventOrdinal), [2, 4]);
  assert.ok(metadata.omissions.includes('non-content agent-delivery metadata omitted'));
  assert.equal(`${metadataText}${result.stdout}${result.stderr}`.includes(privatePrompt), false);

  await rm(join(paths.output, 'session-01.jsonl.gz'));
  await rm(join(paths.output, 'session-01.jsonl.gz.meta.json'));
  records[1].payload.arguments = { message: privatePrompt };
  await writeFile(paths.native, records.map((record) => JSON.stringify(record)).join('\n') + '\n');
  const invalid = runCapture(paths);
  assert.match(invalid.stderr, /native function call has unsupported fields/i);
  assert.equal(`${invalid.stdout}${invalid.stderr}`.includes(privatePrompt), false);
  assert.deepEqual(await readdir(paths.output), []);
});

test('capture identifies user prompts alongside host input envelopes', async () => {
  const paths = await setup();
  const records = [
    { type: 'session_meta', timestamp: '2026-09-27T00:00:00Z', payload: {
      id: '0199c0b1-63da-73a1-b532-4e161922ea2f', cli_version: '0.157.1',
    } },
    { type: 'response_item', timestamp: '2026-09-27T00:00:01Z', payload: {
      type: 'message', role: 'developer',
      content: [{ type: 'input_text', text: '<host-instructions>' }],
    } },
    { type: 'response_item', timestamp: '2026-09-27T00:00:02Z', payload: {
      type: 'message', role: 'user',
      content: [{ type: 'input_text', text: '<environment-context>' }],
    } },
    { type: 'response_item', timestamp: '2026-09-27T00:00:03Z', payload: {
      type: 'message', role: 'user',
      content: [{ type: 'input_text', text: 'Build the example.' }],
    } },
  ];
  await writeFile(paths.native, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
  await writeFile(paths.rules, JSON.stringify({ includeBaseInstructions: false, rules: [] }));

  const result = runCapture(paths);
  assert.equal(result.status, 0, result.stderr);
  const metadata = JSON.parse(await readFile(join(paths.output, 'session-01.jsonl.gz.meta.json')));
  assert.deepEqual(metadata.requests.map(({ eventOrdinal, text }) => ({ eventOrdinal, text })), [
    { eventOrdinal: 1, text: '<host-instructions>' },
    { eventOrdinal: 2, text: '<environment-context>' },
    { eventOrdinal: 3, text: 'Build the example.' },
  ]);
});

test('capture rejects malformed redactions without emitting a partial asset or sensitive input', async () => {
  const paths = await setup();
  const marker = 'SENSITIVE_MARKER';
  await writeFile(paths.native, JSON.stringify({ type: 'session_meta', payload: {
    id: '0199c0b1-63da-73a1-b532-4e161922ea2f', cli_version: '0.157.1',
    base_instructions: { text: marker, provenance: { type: 'host' } },
  } }) + '\n');
  await writeFile(paths.rules, JSON.stringify({ includeBaseInstructions: true, rules: [{
    id: 'invalid', reason: 'private', eventOrdinal: 0,
    path: ['payload', 'baseInstructions'], start: 0, end: 100,
  }] }));
  const result = runCapture(paths);
  assert.notEqual(result.status, 0);
  assert.equal(result.stderr.includes(marker), false);
  assert.deepEqual(await readdir(paths.output), []);

  await writeFile(paths.rules, JSON.stringify({ includeBaseInstructions: false, rules: [], extra: true }));
  const schemaResult = runCapture(paths);
  assert.notEqual(schemaResult.status, 0);
  assert.match(schemaResult.stderr, /does not match/);
});

test('capture rejects excluded input paths', async () => {
  const paths = await setup();
  const excluded = join(paths.root, '_archive');
  await mkdir(excluded);
  const result = runCapture({ ...paths, native: join(excluded, 'session.jsonl') });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /excluded directory/);
  assert.deepEqual(await readdir(paths.output), []);
});
