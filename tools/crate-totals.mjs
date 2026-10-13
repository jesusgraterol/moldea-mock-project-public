import { readFileSync } from 'node:fs';

function crateTotals() {
  let source;
  try {
    source = readFileSync(0, 'utf8');
  } catch {
    throw new Error('could not read stdin');
  }

  let entries;
  try {
    entries = JSON.parse(source);
  } catch {
    throw new Error('input must be valid JSON');
  }
  if (!Array.isArray(entries)) {
    throw new Error('input must be an array');
  }

  const totals = new Map();
  for (const [index, entry] of entries.entries()) {
    const position = `entry ${index + 1}`;
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`${position} must be an object`);
    }
    if (typeof entry.label !== 'string' || entry.label.length === 0) {
      throw new Error(`${position} label must be a nonempty string`);
    }
    if (!Number.isSafeInteger(entry.count) || entry.count < 0) {
      throw new Error(`${position} count must be a nonnegative safe integer`);
    }

    const total = (totals.get(entry.label) ?? 0) + entry.count;
    if (!Number.isSafeInteger(total)) {
      throw new Error(`${position} makes its label total unsafe`);
    }
    totals.set(entry.label, total);
  }

  // Default string sorting is deterministic and does not normalize exact labels.
  return [...totals.keys()].sort().map((label) => ({ label, count: totals.get(label) }));
}

try {
  const totals = crateTotals();
  process.stdout.write(`${JSON.stringify(totals)}\n`);
} catch (error) {
  process.stderr.write(`crate-totals: ${error.message}\n`);
  process.exitCode = 1;
}
