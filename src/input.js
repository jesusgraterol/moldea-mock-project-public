import { readFile } from 'node:fs/promises';

const kinds = ['rooms', 'bookings', 'requests'];

function fail(source, field, message) {
  throw new Error(`${source}: ${field} ${message}.`);
}

function requireText(value, source, field) {
  if (typeof value !== 'string' || value.length === 0 || value.trim() !== value) {
    fail(source, field, 'must be a non-empty, trimmed string');
  }
}

function requireCount(value, source, field) {
  if (!Number.isSafeInteger(value) || value < 1) {
    fail(source, field, 'must be a positive safe integer');
  }
}

function requireEquipment(value, source, field) {
  if (!Array.isArray(value)) fail(source, field, 'must be an array');
  const seen = new Set();
  value.forEach((item, index) => {
    requireText(item, source, `${field}[${index}]`);
    if (seen.has(item)) fail(source, `${field}[${index}]`, `duplicates equipment ${JSON.stringify(item)}`);
    seen.add(item);
  });
}

function requireTimestamp(value, source, field) {
  const match = typeof value === 'string'
    && /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,3}))?(?:Z|\+00:00)$/.exec(value);
  if (!match) fail(source, field, 'must be a UTC timestamp with seconds and Z or +00:00');
  const milliseconds = Date.parse(value);
  const canonical = `${match[1]}.${(match[2] ?? '').padEnd(3, '0')}Z`;
  if (!Number.isFinite(milliseconds) || new Date(milliseconds).toISOString() !== canonical) {
    fail(source, field, 'must be a real UTC calendar date and time');
  }
  return milliseconds;
}

export function validateInputs(inputs, sources = {}) {
  const roomIds = new Set();
  for (const kind of kinds) {
    const source = sources[kind] ?? `${kind}.json`;
    const records = inputs[kind];
    if (!Array.isArray(records)) fail(source, kind, 'must be a JSON array');
    const seen = new Set();
    records.forEach((record, index) => {
      const field = `${kind}[${index}]`;
      if (record === null || typeof record !== 'object' || Array.isArray(record)) {
        fail(source, field, 'must be an object');
      }
      requireText(record.id, source, `${field}.id`);
      if (seen.has(record.id)) fail(source, `${field}.id`, `duplicates identifier ${JSON.stringify(record.id)}`);
      seen.add(record.id);

      if (kind === 'rooms') {
        roomIds.add(record.id);
        requireText(record.name, source, `${field}.name`);
        requireCount(record.capacity, source, `${field}.capacity`);
        requireEquipment(record.equipment, source, `${field}.equipment`);
      } else {
        if (kind === 'bookings') {
          requireText(record.roomId, source, `${field}.roomId`);
          if (!roomIds.has(record.roomId)) {
            fail(source, `${field}.roomId`, `references unknown room ${JSON.stringify(record.roomId)}`);
          }
        } else {
          requireCount(record.attendees, source, `${field}.attendees`);
          requireEquipment(record.equipment, source, `${field}.equipment`);
        }
        const start = requireTimestamp(record.start, source, `${field}.start`);
        const end = requireTimestamp(record.end, source, `${field}.end`);
        if (end <= start) fail(source, `${field}.end`, 'must be strictly after start');
      }
    });
  }
  return inputs;
}

export async function loadInputs(files) {
  const inputs = {};
  for (const kind of kinds) {
    const filename = files[kind];
    let text;
    try {
      text = await readFile(filename, 'utf8');
    } catch (error) {
      throw new Error(`${filename}: cannot read JSON file (${error.code ?? error.message}).`, { cause: error });
    }
    try {
      inputs[kind] = JSON.parse(text);
    } catch (error) {
      throw new Error(`${filename}: invalid JSON (${error.message}).`, { cause: error });
    }
  }
  return validateInputs(inputs, files);
}
