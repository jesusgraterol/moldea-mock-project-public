import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const utilityPath = fileURLToPath(new URL('./unique-zones.mjs', import.meta.url));

function run(input) {
  const result = spawnSync(process.execPath, [utilityPath], {
    input,
    encoding: 'utf8',
    timeout: 5000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  return result;
}

function assertSuccess(input, expected) {
  const result = run(input);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.deepEqual(JSON.parse(result.stdout), expected);
}

function assertFailure(input) {
  const result = run(input);
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /^unique-zones: [^\n]+\n$/);
  assert.ok(result.stderr.length < 100, 'stderr should be concise');
}

test('keeps the first occurrence of each exact string in input order', () => {
  assertSuccess('[\n "z-bed", "a-bed", "z-bed", "m-bed", "a-bed"\n]', [
    'z-bed', 'a-bed', 'm-bed',
  ]);
});

test('preserves case, whitespace and Unicode without trimming or normalization', () => {
  const names = ['bed', ' bed', 'bed ', 'BED', ' ', '\t', 'é', 'e\u0301'];
  assertSuccess(JSON.stringify([...names, 'bed', ' bed', ' ', 'é']), names);
});

test('accepts empty arrays', () => {
  assertSuccess('[]', []);
});

test('rejects malformed JSON without writing partial stdout', () => {
  for (const input of ['', '[', '["valid",]', '{"zone":}', '["valid"] trailing']) {
    assertFailure(input);
  }
});

test('rejects non-array JSON values', () => {
  for (const value of [null, {}, 'garden', 0, true]) {
    assertFailure(JSON.stringify(value));
  }
});

test('rejects empty strings and non-string entries after valid entries without partial stdout', () => {
  for (const value of ['', null, 0, false, {}, []]) {
    assertFailure(JSON.stringify(['valid', 'valid', value, 'other']));
  }
});
