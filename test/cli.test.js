import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const cliPath = path.join(repositoryRoot, 'src', 'cli.js');
const kinds = ['rooms', 'bookings', 'requests'];
const fixtureInputs = Object.fromEntries(await Promise.all(kinds.map(async (kind) => [
  kind, JSON.parse(await readFile(path.join(repositoryRoot, 'data', `${kind}.json`), 'utf8')),
])));

function run(args, { cwd = repositoryRoot, nodeArgs = [] } = {}) {
  const result = spawnSync(process.execPath, [...nodeArgs, cliPath, ...args], {
    cwd, encoding: 'utf8', timeout: 5000, maxBuffer: 1_048_576,
  });
  assert.ifError(result.error);
  return result;
}

async function temporaryInputs(t, inputs = fixtureInputs) {
  const directory = await mkdtemp(path.join(tmpdir(), 'cobalt-rooms-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const files = {};
  for (const kind of kinds) {
    files[kind] = path.join(directory, `${kind} with spaces.json`);
    await writeFile(files[kind], `${JSON.stringify(inputs[kind])}\n`);
  }
  return { directory, files, args: kinds.flatMap((kind) => [`--${kind}`, files[kind]]) };
}

test('supplied examples produce the expected options, rejections and approval reminder', () => {
  const result = run(kinds.flatMap((kind) => [`--${kind}`, path.join('data', `${kind}.json`)]));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /Coordinators must approve every booking; no reservations are created/);
  assert.match(result.stdout, /Each request is evaluated independently/);
  const requestA = result.stdout.split('Request request-a:')[1].split('Request request-b:')[0];
  const requestB = result.stdout.split('Request request-b:')[1].split('Request request-c:')[0];
  const requestC = result.stdout.split('Request request-c:')[1];
  assert.match(requestA, /Suitable rooms: Cedar Studio \(cedar\), Orchid Hall \(orchid\)/);
  assert.match(requestA, /Indigo Room.*insufficient capacity: 6 seats, 10 required; missing equipment: projector/);
  assert.match(requestB, /Suitable rooms: Orchid Hall \(orchid\)/);
  assert.match(requestB, /missing equipment: microphone/);
  assert.match(requestC, /Suitable rooms: none/);
  assert.match(requestC, /overlaps booking booking-cedar-am/);
  assert.match(requestC, /missing equipment: whiteboard/);
});

test('reports short turnaround in either direction, including the actual gap and booking', async (t) => {
  const inputs = structuredClone(fixtureInputs);
  inputs.requests = [
    { ...inputs.requests[0], id: 'after', start: '2026-11-02T10:14:59Z' },
    { ...inputs.requests[0], id: 'before', start: '2026-11-02T08:00:00Z', end: '2026-11-02T08:45:01Z' },
  ];
  const { args } = await temporaryInputs(t, inputs);
  const result = run(args);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.match(/only 899s turnaround with booking booking-cedar-am; at least 15 minutes required/g)?.length, 2);
});

test('runs from another working directory with space-containing relative input paths', async (t) => {
  const { directory, files } = await temporaryInputs(t);
  const args = kinds.flatMap((kind) => [`--${kind}`, path.basename(files[kind])]);
  const result = run(args, { cwd: directory });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Suitable rooms: Cedar Studio \(cedar\), Orchid Hall \(orchid\)/);
});

test('planner runs without filesystem write permission and leaves every input byte unchanged', async (t) => {
  const { directory, files, args } = await temporaryInputs(t);
  const before = await Promise.all(kinds.map((kind) => readFile(files[kind])));
  const entries = await readdir(directory);
  const result = run(args, { cwd: directory, nodeArgs: ['--permission', '--allow-fs-read=*'] });
  assert.equal(result.status, 0, result.stderr);
  const after = await Promise.all(kinds.map((kind) => readFile(files[kind])));
  assert.deepEqual(after, before);
  assert.deepEqual(await readdir(directory), entries);
});

test('overlapping requests remain independent in the CLI', async (t) => {
  const inputs = structuredClone(fixtureInputs);
  inputs.requests = [inputs.requests[0], { ...inputs.requests[0], id: 'same-time' }];
  const { args } = await temporaryInputs(t, inputs);
  const result = run(args);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.match(/Suitable rooms: Cedar Studio \(cedar\), Orchid Hall \(orchid\)/g)?.length, 2);
});

test('empty requests, rooms or bookings are valid and clearly reported', async (t) => {
  for (const inputs of [
    { rooms: [], bookings: [], requests: [] },
    { rooms: [], bookings: [], requests: [fixtureInputs.requests[0]] },
    { rooms: fixtureInputs.rooms, bookings: [], requests: [fixtureInputs.requests[0]] },
  ]) {
    const { args } = await temporaryInputs(t, inputs);
    const result = run(args);
    assert.equal(result.status, 0, result.stderr);
    if (inputs.requests.length === 0) assert.match(result.stdout, /No requests supplied/);
    else if (inputs.rooms.length === 0) assert.match(result.stdout, /Suitable rooms: none.*\nNo rooms supplied/);
    else assert.match(result.stdout, /Suitable rooms: Cedar Studio/);
  }
});

test('help succeeds without reading any input file', () => {
  for (const flag of ['--help', '-h']) {
    const result = run([flag]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /^Usage:/);
    assert.equal(result.stderr, '');
  }
});

test('bad arguments fail clearly without a partial report', () => {
  for (const args of [[], ['--approve'], ['unexpected'], ['--rooms'], ['--rooms', ''], ['--rooms', 'rooms.json']]) {
    const result = run(args);
    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^Cobalt Rooms: /);
  }
});

test('missing files and invalid JSON identify the source without a stack or partial report', async (t) => {
  const { files, args } = await temporaryInputs(t);
  await rm(files.rooms);
  let result = run(args);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.ok(result.stderr.includes(files.rooms));
  assert.match(result.stderr, /cannot read JSON file \(ENOENT\)/);
  await writeFile(files.rooms, '{broken');
  result = run(args);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.ok(result.stderr.includes(files.rooms));
  assert.match(result.stderr, /invalid JSON/);
  assert.doesNotMatch(result.stderr, /\n\s+at /);
});

test('malformed late input fails with filename and field before any report is printed', async (t) => {
  const inputs = structuredClone(fixtureInputs);
  inputs.requests[2].start = '2026-02-30T09:30:00Z';
  const { files, args } = await temporaryInputs(t, inputs);
  const result = run(args);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.ok(result.stderr.includes(files.requests));
  assert.match(result.stderr, /requests\[2\]\.start must be a real UTC calendar date and time/);
});
