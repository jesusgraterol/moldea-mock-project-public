import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const utility = fileURLToPath(new URL('./sort-volunteers.mjs', import.meta.url));

function run(input) {
  const result = spawnSync(process.execPath, [utility], {
    input,
    encoding: 'utf8',
    timeout: 5_000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  return result;
}

function expectSorted(names, expected) {
  const result = run(JSON.stringify(names));
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.deepEqual(JSON.parse(result.stdout), expected);
}

test('sorts alphabetically without regard to case', () => {
  expectSorted(
    ['zoe', 'Amy', 'ben', 'alice', 'Zara'],
    ['alice', 'Amy', 'ben', 'Zara', 'zoe'],
  );
});

test('preserves input order and spelling for equal names', () => {
  expectSorted(
    ['bOB', 'alice', 'Bob', 'ALICE', 'bob', 'Alice'],
    ['alice', 'ALICE', 'Alice', 'bOB', 'Bob', 'bob'],
  );
});

test('compares accented names without regard to case', () => {
  expectSorted(
    ['Émile', 'EMILE', 'émile', 'emile'],
    ['EMILE', 'emile', 'Émile', 'émile'],
  );
});

test('accepts an empty array', () => {
  expectSorted([], []);
});

test('preserves empty strings and whitespace in names', () => {
  expectSorted(['Bob', '', ' Ada '], ['', ' Ada ', 'Bob']);
});

const invalidCases = [
  ['empty input', '', 'invalid JSON'],
  ['malformed JSON', '["Ada",]', 'invalid JSON'],
  ['multiple JSON values', '[] []', 'invalid JSON'],
  ['an object', '{}', 'input must be an array'],
  ['null', 'null', 'input must be an array'],
  ['a string', '"Ada"', 'input must be an array'],
  ['a number', '42', 'input must be an array'],
  ['a boolean', 'true', 'input must be an array'],
  ['a numeric name', '["Ada", 42]', 'names must all be strings'],
  ['a null name', '["Ada", null]', 'names must all be strings'],
  ['a boolean name', '[false]', 'names must all be strings'],
  ['an object name', '[{}]', 'names must all be strings'],
  ['a nested array', '[[]]', 'names must all be strings'],
];

for (const [label, input, message] of invalidCases) {
  test(`rejects ${label} with a concise stderr message`, () => {
    const result = run(input);
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, `sort-volunteers: ${message}\n`);
  });
}
