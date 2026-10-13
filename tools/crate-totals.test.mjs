import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const utility = fileURLToPath(new URL('./crate-totals.mjs', import.meta.url));

function run(input) {
  const result = spawnSync(process.execPath, [utility], {
    input,
    encoding: 'utf8',
    timeout: 5000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  return result;
}

function succeeds(entries, expected) {
  succeedsRaw(JSON.stringify(entries), expected);
}

function succeedsRaw(input, expected) {
  const result = run(input);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, `${JSON.stringify(expected)}\n`);
}

function rejects(input, message) {
  const result = run(input);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /^crate-totals: [^\n]+\n$/);
  assert.match(result.stderr, message);
  assert.ok(result.stderr.length < 200, 'error should be concise');
}

test('groups repeated labels and sorts the output by label', () => {
  succeeds([
    { label: 'rice', count: 3 },
    { label: 'beans', count: 2 },
    { label: 'rice', count: 4 },
    { label: 'beans', count: 0 },
  ], [
    { label: 'beans', count: 2 },
    { label: 'rice', count: 7 },
  ]);
});

test('preserves exact labels, including case, whitespace, and object-property names', () => {
  succeeds([
    { label: 'rice', count: 1 },
    { label: 'Rice', count: 2 },
    { label: ' rice', count: 3 },
    { label: '__proto__', count: 4 },
    { label: 'constructor', count: 5 },
    { label: ' ', count: 6 },
    { label: '__proto__', count: 7 },
  ], [
    { label: ' ', count: 6 },
    { label: ' rice', count: 3 },
    { label: 'Rice', count: 2 },
    { label: '__proto__', count: 11 },
    { label: 'constructor', count: 5 },
    { label: 'rice', count: 1 },
  ]);
});

test('an empty array produces an empty array', () => {
  succeeds([], []);
});

test('accepts zero and a total exactly at the safe-integer limit', () => {
  succeeds([
    { label: 'rice', count: Number.MAX_SAFE_INTEGER - 1 },
    { label: 'rice', count: 1 },
    { label: 'zero', count: 0 },
  ], [
    { label: 'rice', count: Number.MAX_SAFE_INTEGER },
    { label: 'zero', count: 0 },
  ]);
});

test('rejects malformed JSON and missing input', () => {
  for (const input of ['', ' ', '[', '[{"label":"rice","count":1},]']) {
    rejects(input, /valid JSON/);
  }
});

test('rejects non-array JSON roots', () => {
  for (const input of ['null', '{}', '1', 'true', '"rice"']) {
    rejects(input, /must be an array/);
  }
});

test('rejects non-object entries without printing earlier valid totals', () => {
  for (const entry of [null, [], 'rice', 1, true]) {
    rejects(JSON.stringify([{ label: 'valid', count: 2 }, entry]), /entry 2 must be an object/);
  }
});

test('requires a nonempty string label', () => {
  for (const label of [undefined, '', null, 1, true]) {
    rejects(JSON.stringify([{ label, count: 1 }]), /label must be a nonempty string/);
  }
});

test('requires nonnegative safe-integer counts without coercion', () => {
  for (const count of [undefined, null, '1', true, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    rejects(JSON.stringify([{ label: 'rice', count }]), /count must be a nonnegative safe integer/);
  }
  rejects('[{"label":"rice","count":1e309}]', /count must be a nonnegative safe integer/);
});

test('rejects raw fractional counts that round to safe integers', () => {
  for (const input of [
    '[{"label":"valid","count":2},{"label":"rice","count":9007199254740991.1}]',
    '[{"label":"rice","count":9007199254740990.9}]',
    '[{"label":"rice","count":1.0000000000000001}]',
    '[{"label":"rice","count":0.99999999999999999}]',
  ]) {
    rejects(input, /count must be a nonnegative safe integer/);
  }
});

test('validates long raw numeric tokens without rounding away fractional digits', () => {
  const zeros = '0'.repeat(100_000);
  rejects(
    `[{"label":"valid","count":2},{"label":"rice","count":1.${zeros}1}]`,
    /entry 2 count must be a nonnegative safe integer/,
  );
  succeedsRaw(`[{"label":"rice","count":1.${zeros}}]`, [
    { label: 'rice', count: 1 },
  ]);
});

test('rejects raw nonzero counts that underflow to zero', () => {
  for (const input of [
    '[{"label":"valid","count":2},{"label":"rice","count":-1e-400}]',
    '[{"label":"rice","count":1e-400}]',
    '[{"label":"rice","count":-1e-999999999999999999999}]',
    '[{"label":"rice","count":1e-999999999999999999999}]',
  ]) {
    rejects(input, /count must be a nonnegative safe integer/);
  }
});

test('accepts raw integral decimal and exponent representations, including exact zero', () => {
  succeedsRaw(`[
    {"label":"rice","count":1.000000000000000000000},
    {"label":"rice","count":100e-2},
    {"label":"rice","count":1.5e1},
    {"label":"Rice","count":2E+1},
    {"label":"max","count":9.007199254740991e15},
    {"label":"scaled","count":90071992547409910e-1},
    {"label":"zero","count":-0.0e-400},
    {"label":"zero","count":0e999999999999999999999}
  ]`, [
    { label: 'Rice', count: 20 },
    { label: 'max', count: Number.MAX_SAFE_INTEGER },
    { label: 'rice', count: 17 },
    { label: 'scaled', count: Number.MAX_SAFE_INTEGER },
    { label: 'zero', count: 0 },
  ]);
});

test('rejects unsafe grouped totals without partial stdout', () => {
  rejects(JSON.stringify([
    { label: 'beans', count: 2 },
    { label: 'rice', count: Number.MAX_SAFE_INTEGER },
    { label: 'rice', count: 1 },
  ]), /entry 3 makes its label total unsafe/);
});
