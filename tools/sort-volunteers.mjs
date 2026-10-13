import { readFileSync } from 'node:fs';

function fail(message) {
  process.stderr.write(`sort-volunteers: ${message}\n`);
  process.exitCode = 1;
}

function main() {
  let input;
  try {
    input = readFileSync(0, 'utf8');
  } catch {
    fail('could not read stdin');
    return;
  }

  let names;
  try {
    names = JSON.parse(input);
  } catch {
    fail('invalid JSON');
    return;
  }

  if (!Array.isArray(names)) {
    fail('input must be an array');
    return;
  }
  if (!names.every((name) => typeof name === 'string')) {
    fail('names must all be strings');
    return;
  }

  const collator = new Intl.Collator('en', { sensitivity: 'accent' });
  // Stable sort preserves input order for names that compare equally.
  names.sort(collator.compare);
  process.stdout.write(`${JSON.stringify(names)}\n`);
}

main();
