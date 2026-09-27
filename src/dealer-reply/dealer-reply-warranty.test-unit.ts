import assert from 'node:assert/strict';
import { test } from 'node:test';

import { screenWarrantyReportingWindow } from './dealer-reply-warranty.ts';

test('HS-214 report is within 12 months of the invoice', () => {
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2026-09-27'), 'within-period');
});

test('reports before the invoice or after the anniversary are outside the period', () => {
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2026-01-11'), 'outside-period');
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2027-01-13'), 'outside-period');
});

test('unsettled anniversary cases require staff policy review', () => {
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2027-01-12'), 'boundary-review');
  assert.equal(screenWarrantyReportingWindow('2024-02-29', '2025-02-28'), 'boundary-review');
  assert.equal(screenWarrantyReportingWindow('2024-02-29', '2025-03-01'), 'boundary-review');
  assert.equal(screenWarrantyReportingWindow('2024-02-29', '2024-09-27'), 'within-period');
});

test('invalid calendar dates fail rather than producing a screening result', () => {
  assert.throws(
    () => screenWarrantyReportingWindow('2026-02-30', '2026-09-27'),
    /Warranty dates must be valid YYYY-MM-DD values/,
  );
});
