import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test, type TestContext } from 'node:test';
import { runProcess } from 'jg-process';
import { formatRoster } from '../scripts/format-roster.ts';

const projectRoot = resolve(import.meta.dirname, '..');
const script = resolve(projectRoot, 'scripts/format-roster.ts');

const runFormatter = (args: string[], cwd = projectRoot) => runProcess({
  command: process.execPath,
  args: [script, ...args],
  cwd,
  timeoutSeconds: 10,
  maxOutputBytes: 65_536,
});

async function temporaryDirectory(t: TestContext): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'quarry-roster-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test('roster IDs sort lexically, equal IDs stay stable, and inputs are unchanged', () => {
  const entries = [
    { id: 'R-2', name: 'Mira Vale', shift: 'Night' },
    { id: 'R-10', name: 'Nia Rowan', shift: 'Day' },
    { id: 'R-10', name: 'Oren Pike', shift: 'Evening' },
  ];
  const before = structuredClone(entries);
  assert.equal(formatRoster(entries), 'id,name,shift\r\nR-10,Nia Rowan,Day\r\nR-10,Oren Pike,Evening\r\nR-2,Mira Vale,Night\r\n');
  assert.deepEqual(entries, before);
});

test('CSV quotes commas, quotes and line breaks in every column without changing values', () => {
  assert.equal(formatRoster([
    { id: 'R,"3"\nA', name: '  Nia "N", Rowan  ', shift: 'Night\r\nrelief\rdesk' },
  ]), 'id,name,shift\r\n"R,""3""\nA","  Nia ""N"", Rowan  ","Night\r\nrelief\rdesk"\r\n');
  assert.equal(formatRoster([]), 'id,name,shift\r\n');
});

test('the real CLI formats the fictional sample without changing the roster or reports', async () => {
  const sample = resolve(projectRoot, 'data/shift-roster.sample.json');
  const reports = resolve(projectRoot, 'data/records.json');
  const before = await Promise.all([readFile(sample), readFile(reports)]);
  const result = await runFormatter(['--input', sample]);
  assert.equal(result.exitCode, 0);
  assert.equal(result.signalCode, null);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, 'id,name,shift\r\nR-001,Nia Rowan,Day\r\nR-002,"Oren ""Oz"", Pike",Evening\r\nR-003,Mira Vale,Night\r\n');
  assert.deepEqual(await Promise.all([readFile(sample), readFile(reports)]), before);
});

test('the CLI resolves relative paths against its working directory, including spaces', async (t) => {
  const directory = await temporaryDirectory(t);
  const filename = 'fictional roster.json';
  await writeFile(join(directory, filename), '[{"id":"R-1","name":"Mira Vale","shift":"Night"}]');
  const result = await runFormatter(['--input', filename], directory);
  assert.equal(result.exitCode, 0);
  assert.equal(result.signalCode, null);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, 'id,name,shift\r\nR-1,Mira Vale,Night\r\n');
});

test('invalid files report useful errors and never emit even a CSV header or an earlier valid row', async (t) => {
  const directory = await temporaryDirectory(t);
  const filename = join(directory, 'invalid roster.json');
  const valid = { id: 'R-1', name: 'Mira Vale', shift: 'Night' };
  const cases = [
    { name: 'malformed JSON', source: '[{', error: /Invalid JSON/ },
    { name: 'non-array root', source: JSON.stringify(valid), error: /Invalid roster.*array/s },
    { name: 'null entry', source: '[null]', error: /Invalid roster/ },
    { name: 'later entry missing shift', source: JSON.stringify([valid, { id: 'R-2', name: 'Nia Rowan' }]), error: /\[1\]\.shift/ },
    { name: 'wrong field type', source: JSON.stringify([{ ...valid, shift: 12 }]), error: /shift/ },
    { name: 'blank field', source: JSON.stringify([{ ...valid, name: ' \t' }]), error: /nonblank/ },
    { name: 'unsupported field', source: JSON.stringify([{ ...valid, assign: true }]), error: /assign/ },
  ];
  for (const item of cases) {
    await t.test(item.name, async () => {
      await writeFile(filename, item.source);
      const result = await runFormatter(['--input', filename]);
      assert.equal(result.exitCode, 1);
      assert.equal(result.signalCode, null);
      assert.equal(result.stdout, '');
      assert.match(result.stderr, item.error);
      assert.equal(await readFile(filename, 'utf8'), item.source);
    });
  }
});

test('missing files and invalid arguments fail clearly with empty stdout; help is available', async (t) => {
  const directory = await temporaryDirectory(t);
  for (const [args, error] of [
    [[], /Missing required --input/],
    [['--input', join(directory, 'missing.json')], /Cannot read roster file/],
    [['--input'], /Usage:/],
    [['--input', ''], /Usage:/],
    [['--unknown'], /Usage:/],
    [['unexpected.json'], /Usage:/],
    [['--input', 'one.json', '--input', 'two.json'], /Usage:/],
  ] as const) {
    const result = await runFormatter([...args]);
    assert.equal(result.exitCode, 1);
    assert.equal(result.signalCode, null);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, error);
  }
  const help = await runFormatter(['--help']);
  assert.equal(help.exitCode, 0);
  assert.equal(help.signalCode, null);
  assert.equal(help.stderr, '');
  assert.match(help.stdout, /Usage:.*--input <roster\.json>/);
});
