import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';

const script = path.join(import.meta.dirname, 'staff-roster.js');
const header = '| Name | Role |\n| --- | --- |\n';

function run(input, nodeArgs = []) {
  const result = spawnSync(process.execPath, [...nodeArgs, script], {
    input, encoding: 'utf8', timeout: 5000, maxBuffer: 1_048_576,
  });
  assert.ifError(result.error);
  return result;
}

function assertInvalid(input, expected) {
  const result = run(input);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, '', 'invalid input must not print even a table header');
  assert.match(result.stderr, /^staff-roster: stdin: /);
  assert.match(result.stderr, expected);
  assert.doesNotMatch(result.stderr, /\n\s+at /);
}

test('prints two columns in input order, retaining duplicate people and Unicode', () => {
  const people = [
    { name: 'Zoë Vale', role: 'Host', ignored: true },
    { name: 'Arlo Moss', role: 'Guide' },
    { name: 'Zoë Vale', role: 'Host' },
  ];
  const result = run(JSON.stringify(people));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, `${header}| Zoë Vale | Host |\n| Arlo Moss | Guide |\n| Zoë Vale | Host |\n`);
});

test('escapes pipes and existing backslashes in either column', () => {
  const result = run(JSON.stringify([{ name: 'Mira | Holt', role: 'Guide\\|Desk\\' }]));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, `${header}| Mira \\| Holt | Guide\\\\\\|Desk\\\\ |\n`);
});

test('all embedded line endings stay inside a single physical table row', () => {
  const result = run(JSON.stringify([{ name: 'Mira\nHolt', role: 'a\r\nb\rc\nd\u2028e\u2029f' }]));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, `${header}| Mira<br>Holt | a<br>b<br>c<br>d<br>e<br>f |\n`);
  assert.equal(result.stdout.trimEnd().split('\n').length, 3);
});

test('keeps input HTML literal while generating line breaks for actual newlines', () => {
  const result = run(JSON.stringify([{ name: 'A & B <Crew>', role: '<br>\nGuide' }]));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, `${header}| A &amp; B &lt;Crew&gt; | &lt;br&gt;<br>Guide |\n`);
});

test('does not trim otherwise valid field values', () => {
  const result = run(JSON.stringify([{ name: ' Mira ', role: ' Guide ' }]));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, `${header}|  Mira  |  Guide  |\n`);
});

test('an empty roster succeeds with just the header and separator', () => {
  const result = run('[]');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, header);
  assert.equal(result.stderr, '');
});

test('empty stdin, broken JSON and trailing content fail without output', () => {
  for (const input of ['', '[', '[{"name":"Mira","role":"Host"}] extra']) {
    assertInvalid(input, /invalid JSON/);
  }
});

test('rejects non-array JSON roots', () => {
  for (const value of [null, {}, 'Mira', 7, true]) {
    assertInvalid(JSON.stringify(value), /expected a JSON array of people/);
  }
});

test('rejects records that are not objects', () => {
  for (const value of [null, [], 'Mira', 7, false]) {
    assertInvalid(JSON.stringify([value]), /people\[0\] must be an object/);
  }
});

for (const field of ['name', 'role']) {
  test(`rejects missing, non-string and blank ${field} fields`, () => {
    for (const value of [undefined, null, 7, false, [], {}, '', ' \r\n ']) {
      const person = { name: 'Mira Holt', role: 'Host', [field]: value };
      assertInvalid(JSON.stringify([person]), new RegExp(`people\\[0\\]\\.${field} must be a non-empty string`));
    }
  });
}

test('validates late records before printing any table output', () => {
  assertInvalid(JSON.stringify([
    { name: 'Mira Holt', role: 'Host' },
    { name: 'Arlo Moss', role: 'Guide' },
    { name: 'Zoë Vale' },
  ]), /people\[2\]\.role must be a non-empty string/);
});

test('runs with filesystem write permission denied', () => {
  const result = run('[{"name":"Mira Holt","role":"Host"}]', ['--permission', '--allow-fs-read=*']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, `${header}| Mira Holt | Host |\n`);
});
