import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test, type TestContext } from 'node:test';
import { orderReferencesToCsv } from '../src/order-reference-csv.ts';

const script = resolve(import.meta.dirname, '../scripts/order-reference-csv.ts');

function runCli(args: string[], cwd: string) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd, encoding: 'utf8', timeout: 5_000, maxBuffer: 65_536,
  });
  assert.equal(result.error, undefined);
  return result;
}

async function temporaryDirectory(t: TestContext): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'cinder-csv-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test('CSV contains only the requested columns, with stable lexicographic sorting and no mutation', () => {
  const input = [
    { id: 'CR-2', reference: 'second', item: 'Not exported', deliveredAt: null },
    { id: 'CR-10', reference: 'first' },
    { id: 'CR-10', reference: 'same ID, next row' },
    { id: 'a', reference: 'lowercase' },
    { id: 'Z', reference: 'uppercase' },
  ];
  const before = structuredClone(input);
  assert.equal(orderReferencesToCsv(input),
    'orderId,reference\r\nCR-10,first\r\nCR-10,"same ID, next row"\r\nCR-2,second\r\nZ,uppercase\r\na,lowercase\r\n');
  assert.deepEqual(input, before);
});

test('CSV quotes commas, double quotes, CR and LF in either column and preserves Unicode', () => {
  assert.equal(orderReferencesToCsv([
    { id: 'A,"quoted"', reference: 'café\r\nsecond line' },
    { id: 'B\nnext', reference: 'x\ry' },
  ]), 'orderId,reference\r\n"A,""quoted""","café\r\nsecond line"\r\n"B\nnext","x\ry"\r\n');
});

test('an empty order array exports just the header', () => {
  assert.equal(orderReferencesToCsv([]), 'orderId,reference\r\n');
});

for (const input of [
  null,
  {},
  [null],
  [{ reference: 'CINDER-101' }],
  [{ id: 'CR-101' }],
  [{ id: 'CR-101', reference: 123 }],
  [{ id: '', reference: 'CINDER-101' }],
  [{ id: 'CR-101', reference: '  ' }],
]) {
  test(`malformed order references are rejected: ${JSON.stringify(input)}`, () => {
    assert.throws(() => orderReferencesToCsv(input), /Invalid order records at orders/);
  });
}

test('CLI default input works from another cwd, emits only CSV and leaves source bytes unchanged', async (t) => {
  const cwd = await temporaryDirectory(t);
  const ordersFile = resolve(import.meta.dirname, '../data/orders.json');
  const before = await readFile(ordersFile);
  const result = runCli([], cwd);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout,
    'orderId,reference\r\nCR-101,CINDER-101\r\nCR-102,CINDER-102\r\nCR-103,CINDER-103\r\n');
  assert.deepEqual(await readFile(ordersFile), before);
});

test('CLI accepts a caller-relative native input path, quotes values and does not modify it', async (t) => {
  const cwd = await temporaryDirectory(t);
  const inputFile = join(cwd, 'orders with spaces.json');
  const input = JSON.stringify([
    { id: 'B', reference: 'second' }, { id: 'A', reference: 'first,"quoted"' },
  ]);
  await writeFile(inputFile, input);
  const result = runCli(['--input', 'orders with spaces.json'], cwd);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, 'orderId,reference\r\nA,"first,""quoted"""\r\nB,second\r\n');
  assert.equal(await readFile(inputFile, 'utf8'), input);
});

for (const [name, contents, expectedError] of [
  ['invalid JSON', '[', /valid JSON/],
  ['invalid record after a valid row', '[{"id":"A","reference":"valid"},{"id":"B","reference":123}]', /orders\[1\]\.reference/],
] as const) {
  test(`CLI rejects ${name} with no partial CSV`, async (t) => {
    const cwd = await temporaryDirectory(t);
    const inputFile = join(cwd, 'orders.json');
    await writeFile(inputFile, contents);
    const result = runCli(['--input', inputFile], cwd);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, expectedError);
    assert.equal(await readFile(inputFile, 'utf8'), contents);
  });
}

test('CLI reports a missing file rather than emitting an empty successful export', async (t) => {
  const cwd = await temporaryDirectory(t);
  const result = runCli(['--input', join(cwd, 'missing.json')], cwd);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Cannot read orders file \(ENOENT\)/);
});

for (const args of [['--unknown'], ['--input'], ['--input', ''], ['extra-positional']]) {
  test(`CLI reports invalid arguments: ${JSON.stringify(args)}`, async (t) => {
    const cwd = await temporaryDirectory(t);
    const result = runCli(args, cwd);
    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /Usage:/);
  });
}

test('CLI help is available without reading an input file', async (t) => {
  const cwd = await temporaryDirectory(t);
  const result = runCli(['--help', '--input', 'missing.json'], cwd);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /^Usage:/);
});
