import assert from 'node:assert/strict';
import test from 'node:test';
import { planAvailability } from '../src/booking-rules.js';

function inputsFor(start = '2026-11-02T10:15:00Z', end = '2026-11-02T11:00:00Z') {
  return {
    rooms: [{ id: 'cedar', name: 'Cedar', capacity: 12, equipment: ['projector', 'whiteboard'] }],
    bookings: [{ id: 'b1', roomId: 'cedar', start: '2026-11-02T09:00:00Z', end: '2026-11-02T10:00:00Z' }],
    requests: [{ id: 'r1', start, end, attendees: 12, equipment: ['projector'] }],
  };
}

function reasons(inputs) {
  return planAvailability(inputs)[0].rooms[0].reasons;
}

const boundaryCases = [
  ['after: touching fails', '2026-11-02T10:00:00Z', '2026-11-02T11:00:00Z', false],
  ['after: 899.999 seconds fails', '2026-11-02T10:14:59.999Z', '2026-11-02T11:00:00Z', false],
  ['after: exactly 900 seconds passes', '2026-11-02T10:15:00Z', '2026-11-02T11:00:00Z', true],
  ['after: 900.001 seconds passes', '2026-11-02T10:15:00.001Z', '2026-11-02T11:00:00Z', true],
  ['before: touching fails', '2026-11-02T08:00:00Z', '2026-11-02T09:00:00Z', false],
  ['before: 899.999 seconds fails', '2026-11-02T08:00:00Z', '2026-11-02T08:45:00.001Z', false],
  ['before: exactly 900 seconds passes', '2026-11-02T08:00:00Z', '2026-11-02T08:45:00Z', true],
  ['before: 900.001 seconds passes', '2026-11-02T08:00:00Z', '2026-11-02T08:44:59.999Z', true],
];

for (const [name, start, end, passes] of boundaryCases) {
  test(name, () => {
    const result = reasons(inputsFor(start, end));
    assert.deepEqual(result.map(({ code }) => code), passes ? [] : ['turnaround']);
  });
}

for (const [start, end] of [
  ['2026-11-02T09:00:00Z', '2026-11-02T10:00:00Z'],
  ['2026-11-02T09:15:00Z', '2026-11-02T09:45:00Z'],
  ['2026-11-02T08:00:00Z', '2026-11-02T11:00:00Z'],
  ['2026-11-02T08:30:00Z', '2026-11-02T09:30:00Z'],
  ['2026-11-02T09:30:00Z', '2026-11-02T10:30:00Z'],
]) {
  test(`overlap is distinct from turnaround: ${start} to ${end}`, () => {
    assert.deepEqual(reasons(inputsFor(start, end)).map(({ code }) => code), ['overlap']);
  });
}

test('exact capacity and complete equipment pass; all deficits are explained', () => {
  const inputs = inputsFor();
  assert.deepEqual(reasons(inputs), []);
  inputs.requests[0].attendees = 13;
  inputs.requests[0].equipment = ['projector', 'microphone', 'camera'];
  assert.deepEqual(reasons(inputs), [
    { code: 'capacity', capacity: 12, attendees: 13 },
    { code: 'equipment', missing: ['microphone', 'camera'] },
  ]);
  inputs.requests[0].attendees = 12;
  inputs.requests[0].equipment = [];
  assert.deepEqual(reasons(inputs), []);
});

test('checks every same-room booking, not just the first, without requiring sorted input', () => {
  const inputs = inputsFor();
  inputs.bookings.unshift({ ...inputs.bookings[0], id: 'unrelated', roomId: 'other' });
  inputs.bookings.push({ id: 'later', roomId: 'cedar', start: '2026-11-02T11:14:59Z', end: '2026-11-02T12:00:00Z' });
  inputs.bookings.reverse();
  const result = reasons(inputs);
  assert.equal(result.length, 1);
  assert.equal(result[0].code, 'turnaround');
  assert.equal(result[0].booking.id, 'later');
  assert.equal(result[0].gapMs, 899_000);
});

test('booking conflicts in another room do not affect availability', () => {
  const inputs = inputsFor('2026-11-02T09:15:00Z', '2026-11-02T09:45:00Z');
  inputs.rooms.push({ ...inputs.rooms[0], id: 'other', name: 'Other' });
  const plans = planAvailability(inputs);
  assert.equal(plans[0].rooms[0].reasons[0].code, 'overlap');
  assert.deepEqual(plans[0].rooms[1].reasons, []);
});

test('uses absolute UTC instants across midnight', () => {
  const inputs = inputsFor('2026-11-03T00:15:00+00:00', '2026-11-03T01:00:00Z');
  inputs.bookings[0].start = '2026-11-02T23:00:00Z';
  inputs.bookings[0].end = '2026-11-03T00:00:00Z';
  assert.deepEqual(reasons(inputs), []);
});

test('independent overlapping requests both retain their options and inputs stay immutable', () => {
  const inputs = inputsFor();
  inputs.requests.push({ ...inputs.requests[0], id: 'r2' });
  const before = structuredClone(inputs);
  function freeze(value) {
    if (value !== null && typeof value === 'object') {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  }
  freeze(inputs);
  const plans = planAvailability(inputs);
  assert.deepEqual(plans.map((plan) => plan.rooms[0].reasons), [[], []]);
  assert.deepEqual(inputs, before);
});

test('availability never consults the machine clock', () => {
  const originalNow = Date.now;
  try {
    Date.now = () => { throw new Error('Machine clock must not be used'); };
    assert.deepEqual(reasons(inputsFor()), []);
  } finally {
    Date.now = originalNow;
  }
});
