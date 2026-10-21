import { text as readText } from 'node:stream/consumers';
import { parseArgs } from 'node:util';

function normalizeField(value, location) {
  if (typeof value !== 'string') {
    throw new Error(`${location} must be a string.`);
  }

  const normalized = value.replace(/\s+/gu, ' ').trim();
  if (normalized.length === 0) {
    throw new Error(`${location} must not be empty after whitespace normalization.`);
  }
  return normalized;
}

function formatContributors(inputText) {
  if (inputText.trim().length === 0) {
    throw new Error('Expected a JSON array on stdin; received no input.');
  }

  let input;
  try {
    input = JSON.parse(inputText);
  } catch (error) {
    throw new Error(`Invalid JSON on stdin: ${error.message}`);
  }
  if (!Array.isArray(input)) {
    throw new Error('Expected a JSON array of people with name and contribution fields.');
  }

  // Finish validating every row before constructing or writing any output.
  const people = input.map((person, index) => {
    if (person === null || typeof person !== 'object' || Array.isArray(person)) {
      throw new Error(`people[${index}] must be an object with name and contribution fields.`);
    }
    const name = normalizeField(person.name, `people[${index}].name`);
    const contribution = normalizeField(person.contribution, `people[${index}].contribution`);
    return { name, contribution, sortKey: name.toLowerCase() };
  });

  // Node's stable sort keeps the input order when normalized lowercase keys match.
  people.sort((left, right) => (
    left.sortKey < right.sortKey ? -1 : left.sortKey > right.sortKey ? 1 : 0
  ));
  return people.map(({ name, contribution }) => `${name} — ${contribution}\n`).join('');
}

async function main() {
  parseArgs({ options: {} });
  if (process.stdin.isTTY) {
    throw new Error('Send a JSON array on stdin, for example by piping or redirecting a file.');
  }
  const inputText = await readText(process.stdin);

  let output;
  try {
    output = formatContributors(inputText);
  } catch (error) {
    process.stderr.write(`Invalid contributor input: ${error.message}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(output);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    process.stderr.write(`Could not format contributors: ${error.message}\n`);
    process.exitCode = 2;
  }
}
