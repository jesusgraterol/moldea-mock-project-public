import assert from 'node:assert/strict';
import test from 'node:test';
import { planWatering } from '../src/water-plan.mjs';

const validZone = { id: 'herb-bed', moisturePercent: 10, requestedLitres: 3 };

test('selects only moisture below 20, retaining supplied litres and input order', () => {
  assert.deepEqual(planWatering([
    { id: 'dry-bed', moisturePercent: 0, requestedLitres: 3 },
    { id: 'threshold-bed', moisturePercent: 20, requestedLitres: 50 },
    { id: 'almost-threshold', moisturePercent: 19.999, requestedLitres: 2.5 },
    { id: 'saturated-bed', moisturePercent: 100, requestedLitres: 20 },
    { id: 'zero-request', moisturePercent: 5, requestedLitres: 0 },
  ]), {
    zones: [
      { id: 'dry-bed', requestedLitres: 3 },
      { id: 'almost-threshold', requestedLitres: 2.5 },
      { id: 'zero-request', requestedLitres: 0 },
    ],
    totalLitres: 5.5,
  });
});

test('returns an empty plan for no zones or no dry zones', () => {
  const emptyPlan = { zones: [], totalLitres: 0 };
  assert.deepEqual(planWatering([]), emptyPlan);
  assert.deepEqual(planWatering([{ ...validZone, moisturePercent: 20 }]), emptyPlan);
});

test('is deterministic and does not mutate or expose input records', () => {
  const zone = Object.freeze({ ...validZone });
  const input = Object.freeze([zone]);
  const firstPlan = planWatering(input);
  assert.deepEqual(planWatering(input), firstPlan);
  firstPlan.zones[0].requestedLitres = 99;
  assert.equal(zone.requestedLitres, 3);
  assert.equal(planWatering(input).totalLitres, 3);
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
