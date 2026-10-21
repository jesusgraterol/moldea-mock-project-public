import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { checkLabelLength, countLabelWords } from './count-label-words.mjs';

test('counts whitespace-separated words without splitting hyphens or punctuation', () => {
  assert.equal(countLabelWords('hand-made bowl'), 2);
  assert.equal(countLabelWords('hand made bowl'), 3);
  assert.equal(countLabelWords(' \tBlue-glazed\n\nstoneware\r\ncup.\u00a0'), 3);
  assert.equal(countLabelWords('Marr, 1968; Pike, 1971.'), 4);
  assert.equal(countLabelWords('bowl — oak'), 3);
  assert.equal(countLabelWords(' \t\r\n'), 0);
});

test('accepts exactly 60 words, rejects 61, and rejects empty labels', () => {
  assert.equal(checkLabelLength(Array(60).fill('word').join(' ')).length, 'PASS');
  assert.equal(checkLabelLength(Array(61).fill('word').join(' ')).reason, 'over-limit');
  assert.equal(checkLabelLength('').reason, 'empty-label');
});

test('does not silently extract label text from surrounding metadata', () => {
  assert.equal(countLabelWords('# Label\n\nhand-made bowl\n\nEvidence: S-101'), 6);
});

test('worked example counts match the complete label blocks', async () => {
  const examples = await readFile(new URL('../design-and-examples.md', import.meta.url), 'utf8');
  const labels = [...examples.matchAll(/```text\n([\s\S]*?)\n```\n\n\*\*Word count:\*\* (\d+)\/60\./gu)];
  assert.equal(labels.length, 6);
  for (const [, label, reportedCount] of labels) {
    assert.equal(countLabelWords(label), Number(reportedCount));
  }
});

function runCounter(args, input = '') {
  const result = spawnSync(
    process.execPath,
    [join(import.meta.dirname, 'count-label-words.mjs'), ...args],
    { cwd: tmpdir(), input, encoding: 'utf8', timeout: 5000, maxBuffer: 65536 },
  );
  assert.equal(result.error, undefined);
  return result;
}

test('CLI checks argument text or stdin and works outside the repository cwd', () => {
  const argument = runCounter(['--text', 'hand-made bowl']);
  const stdin = runCounter([], 'hand made\nbowl');
  assert.equal(argument.status, 0);
  assert.equal(stdin.status, 0);
  assert.deepEqual(JSON.parse(argument.stdout), {
    schemaVersion: 1, wordCount: 2, limit: 60, length: 'PASS', reason: null,
  });
  assert.equal(JSON.parse(stdin.stdout).wordCount, 3);
  assert.equal(argument.stderr, '');
  assert.equal(stdin.stderr, '');
});

test('CLI distinguishes a failing length check from an unexecuted check', () => {
  const exact = runCounter(['--text', Array(60).fill('word').join(' ')]);
  const over = runCounter([], Array(61).fill('word').join('\t'));
  const empty = runCounter(['--text', ' \n']);
  const invalid = runCounter(['--notes', 'not-an-option']);
  assert.equal(exact.status, 0);
  assert.equal(JSON.parse(exact.stdout).wordCount, 60);
  assert.equal(over.status, 1);
  assert.equal(JSON.parse(over.stdout).wordCount, 61);
  assert.equal(JSON.parse(over.stdout).reason, 'over-limit');
  assert.equal(empty.status, 1);
  assert.equal(JSON.parse(empty.stdout).reason, 'empty-label');
  assert.equal(invalid.status, 2);
  assert.equal(invalid.stdout, '');
  assert.match(invalid.stderr, /Word count not checked/u);
});
