import assert from 'node:assert/strict';
import { test } from 'node:test';

import { screenWarrantyReportingWindow } from './claims-review-warranty.ts';

test('HS-214 report is within the applicable 18-month window', () => {
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2026-09-27', 18), 'within-period');
});

test('other parts retain the 12-month screen', () => {
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2026-09-27', 12), 'within-period');
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2027-01-13', 12), 'outside-period');
});

test('18-month anniversary and nearby reports remain distinct', () => {
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2027-07-11', 18), 'within-period');
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2027-07-12', 18), 'boundary-review');
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2027-07-13', 18), 'outside-period');
  assert.equal(screenWarrantyReportingWindow('2026-01-12', '2026-01-11', 18), 'outside-period');
});

test('missing anniversary days require staff interpretation for either policy window', () => {
  assert.equal(screenWarrantyReportingWindow('2024-02-29', '2025-02-28', 12), 'boundary-review');
  assert.equal(screenWarrantyReportingWindow('2024-02-29', '2025-03-01', 12), 'boundary-review');
  assert.equal(screenWarrantyReportingWindow('2024-02-29', '2024-09-27', 12), 'within-period');
  assert.equal(screenWarrantyReportingWindow('2026-08-31', '2028-02-28', 18), 'within-period');
  assert.equal(screenWarrantyReportingWindow('2026-08-31', '2028-02-29', 18), 'boundary-review');
  assert.equal(screenWarrantyReportingWindow('2026-08-31', '2028-03-01', 18), 'boundary-review');
  assert.equal(screenWarrantyReportingWindow('2026-08-31', '2028-03-02', 18), 'outside-period');
});

test('invalid calendar dates fail rather than producing a screening result', () => {
  assert.throws(
    () => screenWarrantyReportingWindow('2026-02-30', '2026-09-27', 18),
    /Warranty dates must be valid YYYY-MM-DD values/,
  );
});
