import assert from 'node:assert/strict';
import test from 'node:test';
import { validateInputs } from '../src/input.js';

function validInputs() {
  return {
    rooms: [{ id: 'cedar', name: 'Cedar', capacity: 12, equipment: ['projector'] }],
    bookings: [{ id: 'b1', roomId: 'cedar', start: '2026-11-02T09:00:00Z', end: '2026-11-02T10:00:00Z' }],
    requests: [{ id: 'r1', start: '2026-11-02T10:15:00Z', end: '2026-11-02T11:00:00Z', attendees: 12, equipment: ['projector'] }],
  };
}

test('validation preserves supplied facts without normalization or mutation', () => {
  const inputs = validInputs();
  const before = structuredClone(inputs);
  assert.equal(validateInputs(inputs), inputs);
  assert.deepEqual(inputs, before);
});

test('empty lists, empty equipment and valid leap-day UTC dates are supported', () => {
  validateInputs({ rooms: [], bookings: [], requests: [] });
  const inputs = validInputs();
  inputs.rooms[0].equipment = [];
  inputs.requests[0].equipment = [];
  inputs.requests[0].start = '2028-02-29T10:15:00.1+00:00';
  inputs.requests[0].end = '2028-02-29T11:00:00.123Z';
  validateInputs(inputs);
});

for (const kind of ['rooms', 'bookings', 'requests']) {
  test(`${kind} requires an array, object records and unique identifiers`, () => {
    for (const invalid of [undefined, null, {}]) {
      const inputs = validInputs();
      inputs[kind] = invalid;
      assert.throws(() => validateInputs(inputs), /must be a JSON array/);
    }
    for (const invalid of [null, [], 'record']) {
      const inputs = validInputs();
      inputs[kind] = [invalid];
      assert.throws(() => validateInputs(inputs), /\[0\] must be an object/);
    }
    const inputs = validInputs();
    inputs[kind].push(structuredClone(inputs[kind][0]));
    assert.throws(() => validateInputs(inputs), /\[1\]\.id duplicates identifier/);
  });
}

const invalidFields = [
  ['rooms', 'id', undefined, /id must be a non-empty/],
  ['rooms', 'name', '   ', /name must be a non-empty/],
  ['rooms', 'capacity', 0, /capacity must be a positive safe integer/],
  ['rooms', 'capacity', 1.5, /capacity must be a positive safe integer/],
  ['rooms', 'capacity', '12', /capacity must be a positive safe integer/],
  ['rooms', 'capacity', Number.MAX_SAFE_INTEGER + 1, /capacity must be a positive safe integer/],
  ['rooms', 'equipment', undefined, /equipment must be an array/],
  ['rooms', 'equipment', ['projector', 'projector'], /duplicates equipment/],
  ['rooms', 'equipment', [''], /equipment\[0\] must be a non-empty/],
  ['bookings', 'id', '', /id must be a non-empty/],
  ['bookings', 'roomId', undefined, /roomId must be a non-empty/],
  ['bookings', 'roomId', 'unknown', /references unknown room/],
  ['bookings', 'start', undefined, /start must be a UTC timestamp/],
  ['bookings', 'end', 'not-a-date', /end must be a UTC timestamp/],
  ['bookings', 'end', '2026-11-02T08:00:00Z', /end must be strictly after start/],
  ['requests', 'id', ' padded ', /id must be a non-empty, trimmed string/],
  ['requests', 'attendees', undefined, /attendees must be a positive safe integer/],
  ['requests', 'attendees', -1, /attendees must be a positive safe integer/],
  ['requests', 'attendees', 0, /attendees must be a positive safe integer/],
  ['requests', 'attendees', 1.5, /attendees must be a positive safe integer/],
  ['requests', 'equipment', 'projector', /equipment must be an array/],
  ['requests', 'equipment', [42], /equipment\[0\] must be a non-empty/],
  ['requests', 'equipment', ['projector', 'projector'], /duplicates equipment/],
  ['requests', 'start', '2026-11-02T10:15:00', /start must be a UTC timestamp/],
  ['requests', 'start', '2026-11-02T10:15:00-04:00', /start must be a UTC timestamp/],
  ['requests', 'start', '2026-02-29T10:15:00Z', /start must be a real UTC calendar/],
  ['requests', 'start', '2026-11-31T10:15:00Z', /start must be a real UTC calendar/],
  ['requests', 'start', '2026-11-02T24:00:00Z', /start must be a real UTC calendar/],
  ['requests', 'start', '2026-13-02T10:15:00Z', /start must be a real UTC calendar/],
  ['requests', 'start', '2026-11-02T10:15:00.1234Z', /start must be a UTC timestamp/],
  ['requests', 'end', '2026-11-02T10:15:00Z', /end must be strictly after start/],
];

for (const [kind, field, value, expected] of invalidFields) {
  test(`rejects ${kind}.${field} = ${JSON.stringify(value)}`, () => {
    const inputs = validInputs();
    inputs[kind][0][field] = value;
    assert.throws(() => validateInputs(inputs, { [kind]: 'fixture.json' }), (error) => {
      assert.match(error.message, /^fixture\.json: /);
      assert.ok(error.message.includes(`${kind}[0].${field}`));
      assert.match(error.message, expected);
      return true;
    });
  });
}
