import { readFileSync } from 'node:fs';

function parseZoneNames(input) {
  let names;
  try {
    names = JSON.parse(input);
  } catch {
    throw new Error('invalid JSON');
  }

  if (!Array.isArray(names)) {
    throw new Error('input must be a JSON array');
  }

  for (const [index, name] of names.entries()) {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error(`entry ${index} must be a nonempty string`);
    }
  }

  return [...new Set(names)];
}

try {
  const names = parseZoneNames(readFileSync(0, 'utf8'));
  process.stdout.write(`${JSON.stringify(names)}\n`);
} catch (error) {
  process.stderr.write(`unique-zones: ${error.message}\n`);
  process.exitCode = 1;
}
