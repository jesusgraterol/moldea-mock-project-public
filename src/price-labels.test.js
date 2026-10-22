import assert from 'node:assert/strict';
import test from 'node:test';

import { priceLabel } from './price-labels.js';

test('prices round up to the nearest 50 cents, omitting cents for whole dollars', () => {
  assert.equal(priceLabel(0), '$0');
  assert.equal(priceLabel(1200), '$12');
  assert.equal(priceLabel(1210), '$12.50');
  assert.equal(priceLabel(1250), '$12.50');
  assert.equal(priceLabel(1251), '$13');
});

test('dishes without a fixed price show a market price label', () => {
  assert.equal(priceLabel(null), 'Market price');
});

test('invalid prices are rejected', () => {
  assert.throws(() => priceLabel(-1), /Invalid price/);
  assert.throws(() => priceLabel(12.5), /Invalid price/);
});
