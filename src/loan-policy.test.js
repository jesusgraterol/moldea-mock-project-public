import assert from 'node:assert/strict';
import test from 'node:test';

import { canBorrow, daysOverdue, dueDate } from './loan-policy.js';

const day = (iso) => new Date(`${iso}T00:00:00Z`);

test('hand tools are due after 7 days and power tools after 5', () => {
  assert.deepEqual(dueDate({ category: 'hand' }, day('2026-10-01')), day('2026-10-08'));
  assert.deepEqual(dueDate({ category: 'power' }, day('2026-10-01')), day('2026-10-06'));
});

test('an unknown category is rejected', () => {
  assert.throws(() => dueDate({ category: 'garden' }, day('2026-10-01')), /Unknown tool category/);
});

test('overdue days are whole days after the due date', () => {
  assert.equal(daysOverdue({ dueOn: day('2026-10-08') }, day('2026-10-08')), 0);
  assert.equal(daysOverdue({ dueOn: day('2026-10-08') }, day('2026-10-11')), 3);
});

test('members are limited to 3 tools and suspended after 14 overdue days', () => {
  const today = day('2026-10-30');
  const current = { dueOn: day('2026-10-31') };
  assert.deepEqual(canBorrow([current, current], today), { allowed: true, reason: null });
  assert.deepEqual(canBorrow([current, current, current], today), { allowed: false, reason: 'limit' });
  assert.deepEqual(canBorrow([{ dueOn: day('2026-10-16') }], today), { allowed: true, reason: null });
  assert.deepEqual(canBorrow([{ dueOn: day('2026-10-15') }], today), {
    allowed: false,
    reason: 'suspended',
  });
});
