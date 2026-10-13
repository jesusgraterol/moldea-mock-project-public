import assert from 'node:assert/strict';
import test from 'node:test';
import { planWatering } from '../src/water-plan.mjs';

const validZone = { id: 'herb-bed', moisturePercent: 10, requestedLitres: 3 };

test('selects 20 and 24.999 but not 25, retaining supplied litres in ID order', () => {
  assert.deepEqual(planWatering([
    { id: 'dry-bed', moisturePercent: 0, requestedLitres: 3 },
    { id: 'threshold-bed', moisturePercent: 25, requestedLitres: 50 },
    { id: 'almost-threshold', moisturePercent: 24.999, requestedLitres: 2.5 },
    { id: 'twenty-percent-bed', moisturePercent: 20, requestedLitres: 4 },
    { id: 'saturated-bed', moisturePercent: 100, requestedLitres: 20 },
    { id: 'zero-request', moisturePercent: 5, requestedLitres: 0 },
  ]), {
    zones: [
      { id: 'almost-threshold', requestedLitres: 2.5 },
      { id: 'dry-bed', requestedLitres: 3 },
      { id: 'twenty-percent-bed', requestedLitres: 4 },
      { id: 'zero-request', requestedLitres: 0 },
    ],
    totalLitres: 9.5,
  });
});

test('orders exact IDs by JavaScript strings, without locale or normalization rules', () => {
  const ids = ['é', 'zone-2', 'a', '\uE000', 'Z-bed', 'zone-10', '😀', 'e\u0301', ' a', 'a '];
  const plan = planWatering(ids.map((id) => ({ ...validZone, id })));

  assert.deepEqual(plan.zones.map((zone) => zone.id), [
    ' a', 'Z-bed', 'a', 'a ', 'e\u0301', 'zone-10', 'zone-2', 'é', '😀', '\uE000',
  ]);
});

test('preserves input order for equal IDs among selected zones', () => {
  assert.deepEqual(planWatering([
    { ...validZone, id: 'b', requestedLitres: 9 },
    { ...validZone, id: 'a', requestedLitres: 5 },
    { ...validZone, id: 'b', moisturePercent: 25, requestedLitres: 99 },
    { ...validZone, id: 'b', requestedLitres: 3 },
    { ...validZone, id: 'a', requestedLitres: 2 },
    { ...validZone, id: 'b', requestedLitres: 0 },
  ]), {
    zones: [
      { id: 'a', requestedLitres: 5 },
      { id: 'a', requestedLitres: 2 },
      { id: 'b', requestedLitres: 9 },
      { id: 'b', requestedLitres: 3 },
      { id: 'b', requestedLitres: 0 },
    ],
    totalLitres: 19,
  });
});

test('returns an empty plan for no zones or no dry zones', () => {
  const emptyPlan = { zones: [], totalLitres: 0 };
  assert.deepEqual(planWatering([]), emptyPlan);
  assert.deepEqual(planWatering([{ ...validZone, moisturePercent: 25 }]), emptyPlan);
});

test('is deterministic and does not mutate or expose input records', () => {
  const input = Object.freeze([
    Object.freeze({ ...validZone, id: 'z-bed', requestedLitres: 5 }),
    Object.freeze({ ...validZone, id: 'a-bed', requestedLitres: 3 }),
    Object.freeze({ ...validZone, id: 'm-bed', moisturePercent: 25, requestedLitres: 7 }),
  ]);
  const originalInput = structuredClone(input);
  const firstPlan = planWatering(input);
  const originalPlan = structuredClone(firstPlan);
  assert.deepEqual(planWatering(input), firstPlan);
  firstPlan.zones[0].requestedLitres = 99;
  assert.deepEqual(input, originalInput);
  assert.deepEqual(planWatering(input), originalPlan);
});

test('rejects missing facts, including on zones that would not be selected', () => {
  for (const field of ['id', 'moisturePercent', 'requestedLitres']) {
    const incomplete = { ...validZone, moisturePercent: 50 };
    delete incomplete[field];
    assert.throws(() => planWatering([validZone, incomplete]), TypeError, field);
  }
});

test('rejects invalid containers, records, sparse arrays and empty IDs', () => {
  for (const input of [undefined, null, {}, 'zones', 3]) {
    assert.throws(() => planWatering(input), TypeError);
  }
  for (const record of [undefined, null, [], 'zone', 3]) {
    assert.throws(() => planWatering([record]), TypeError);
  }
  assert.throws(() => planWatering(new Array(1)), TypeError);
  for (const id of ['', ' \t\n', null, 0]) {
    assert.throws(() => planWatering([{ ...validZone, id }]), TypeError);
  }
});

test('requires actual finite numbers without coercion or invented defaults', () => {
  for (const field of ['moisturePercent', 'requestedLitres']) {
    for (const value of [NaN, Infinity, -Infinity, undefined, null, '10', false]) {
      assert.throws(
        () => planWatering([{ ...validZone, [field]: value }]),
        TypeError,
        `${field}: ${String(value)}`,
      );
    }
  }
});

test('rejects out-of-range moisture and negative litres, even on wet zones', () => {
  for (const moisturePercent of [-0.001, 100.001]) {
    assert.throws(() => planWatering([{ ...validZone, moisturePercent }]), RangeError);
  }
  assert.throws(() => planWatering([
    { ...validZone, moisturePercent: 50, requestedLitres: -0.001 },
  ]), RangeError);
});

test('rejects a total that overflows despite finite individual requests', () => {
  assert.throws(() => planWatering([
    { ...validZone, requestedLitres: Number.MAX_VALUE },
    { ...validZone, id: 'second-bed', requestedLitres: Number.MAX_VALUE },
  ]), RangeError);
});
