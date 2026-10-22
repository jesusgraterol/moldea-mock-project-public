import assert from 'node:assert/strict';
import test from 'node:test';

import { reminderFor } from './reminders.js';

const day = (iso) => new Date(`${iso}T00:00:00Z`);
const loan = { member: 'Ada', tool: 'cordless drill', dueOn: day('2026-10-10') };

test('a reminder goes out the day before the due date', () => {
  assert.equal(
    reminderFor(loan, day('2026-10-09')),
    'Hi Ada, a reminder that the cordless drill is due back tomorrow.',
  );
});

test('overdue notes go out on the first and seventh overdue day only', () => {
  assert.match(reminderFor(loan, day('2026-10-11')), /1 day overdue/);
  assert.match(reminderFor(loan, day('2026-10-17')), /7 days overdue/);
  assert.equal(reminderFor(loan, day('2026-10-12')), null);
  assert.equal(reminderFor(loan, day('2026-10-10')), null);
});
