import { readFileSync } from 'node:fs';

function isNonnegativeIntegralSource(source) {
  // JSON.parse has already checked the number grammar. Check its decimal value
  // without converting the coefficient to a rounded JavaScript number.
  const [, sign, integer, fraction = '', exponent = '0'] =
    source.match(/^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  const digits = (integer + fraction).replace(/^0+/, '');
  if (digits.length === 0) return true; // Exact zero, including -0.
  if (sign === '-') return false;
  const trailingZeros = digits.length - digits.replace(/0+$/, '').length;
  return Number(exponent) + trailingZeros >= fraction.length;
}

function crateTotals() {
  let source;
  try {
    source = readFileSync(0, 'utf8');
  } catch {
    throw new Error('could not read stdin');
  }

  let entries;
  const countSources = new WeakMap();
  try {
    entries = JSON.parse(source, function (key, value, context) {
      if (key === 'count' && typeof value === 'number') {
        countSources.set(this, context.source);
      }
      return value;
    });
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
    if (!Number.isSafeInteger(entry.count) || entry.count < 0 ||
        !isNonnegativeIntegralSource(countSources.get(entry))) {
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
