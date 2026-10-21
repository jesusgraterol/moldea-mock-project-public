import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

function runFormatter(input, args = []) {
  const result = spawnSync(
    process.execPath,
    [join(import.meta.dirname, 'format-contributors.mjs'), ...args],
    { cwd: tmpdir(), input, encoding: 'utf8', timeout: 5000, maxBuffer: 65536 },
  );
  assert.equal(result.error, undefined);
  assert.equal(result.signal, null);
  return result;
}

test('normalizes field whitespace, preserves spelling, and sorts case-insensitively', () => {
  const result = runFormatter(JSON.stringify([
    { name: '  zoE\t Chen  ', contribution: ' layout\n\tand\r\nproduction ' },
    { name: '\u00a0Ada   Lin\u00a0', contribution: '\u2003editing\u2003' },
    { name: 'Bob Ray', contribution: 'research', ignored: 'extra fields are allowed' },
  ]));
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, 'Ada Lin — editing\nBob Ray — research\nzoE Chen — layout and production\n');
});

test('equal normalized lowercase names retain input order, not contribution order', () => {
  const result = runFormatter(JSON.stringify([
    { name: 'Zoe', contribution: 'last' },
    { name: 'Ada  Lin', contribution: 'z-first' },
    { name: 'Bob', contribution: 'middle' },
    { name: 'ADA LIN', contribution: 'a-second' },
    { name: 'ada\tlin', contribution: 'm-third' },
    { name: 'Élodie', contribution: 'unicode first' },
    { name: 'élodie', contribution: 'unicode second' },
  ]));
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, [
    'Ada Lin — z-first',
    'ADA LIN — a-second',
    'ada lin — m-third',
    'Bob — middle',
    'Zoe — last',
    'Élodie — unicode first',
    'élodie — unicode second',
    '',
  ].join('\n'));
});

test('an empty array succeeds without emitting even a blank line', () => {
  const result = runFormatter(' \n[]\t');
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});

test('missing, malformed, or trailing JSON produces an error and no stdout', async (t) => {
  const cases = [
    { label: 'empty stdin', input: '', error: /received no input/u },
    { label: 'whitespace-only stdin', input: ' \t\n', error: /received no input/u },
    { label: 'malformed JSON', input: '[{"name":', error: /Invalid JSON/u },
    { label: 'trailing data', input: '[{"name":"Ada","contribution":"editing"}] []', error: /Invalid JSON/u },
  ];
  for (const { label, input, error } of cases) {
    await t.test(label, () => {
      const result = runFormatter(input);
      assert.equal(result.status, 1);
      assert.equal(result.stdout, '');
      assert.match(result.stderr, error);
    });
  }
});

test('rejects non-array top-level JSON', async (t) => {
  for (const input of ['null', '{}', '"Ada"', '42', 'true']) {
    await t.test(input, () => {
      const result = runFormatter(input);
      assert.equal(result.status, 1);
      assert.equal(result.stdout, '');
      assert.match(result.stderr, /Expected a JSON array/u);
    });
  }
});

test('valid rows are never printed if a later row or required field is invalid', async (t) => {
  const cases = [
    { label: 'null row', person: null, error: /people\[1\] must be an object/u },
    { label: 'array row', person: [], error: /people\[1\] must be an object/u },
    { label: 'string row', person: 'Ada', error: /people\[1\] must be an object/u },
    { label: 'missing name', person: { contribution: 'editing' }, error: /people\[1\]\.name must be a string/u },
    { label: 'numeric name', person: { name: 42, contribution: 'editing' }, error: /people\[1\]\.name must be a string/u },
    { label: 'blank name', person: { name: ' \t\n', contribution: 'editing' }, error: /people\[1\]\.name must not be empty/u },
    { label: 'missing contribution', person: { name: 'Ada' }, error: /people\[1\]\.contribution must be a string/u },
    { label: 'null contribution', person: { name: 'Ada', contribution: null }, error: /people\[1\]\.contribution must be a string/u },
    { label: 'array contribution', person: { name: 'Ada', contribution: [] }, error: /people\[1\]\.contribution must be a string/u },
    { label: 'blank contribution', person: { name: 'Ada', contribution: '\u00a0 \n' }, error: /people\[1\]\.contribution must not be empty/u },
  ];
  for (const { label, person, error } of cases) {
    await t.test(label, () => {
      const result = runFormatter(JSON.stringify([
        { name: 'Aaron', contribution: 'valid first row' },
        person,
        { name: 'Zoe', contribution: 'valid last row' },
      ]));
      assert.equal(result.status, 1);
      assert.equal(result.stdout, '');
      assert.match(result.stderr, error);
    });
  }
});

test('unexpected arguments fail without producing contributor output', () => {
  const result = runFormatter('[]', ['--unknown']);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Could not format contributors/u);
});
