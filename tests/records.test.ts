import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lookupRecords, annotateReport, SUPERVISOR_REVIEW_AGE_MS } from '../src/records.ts';
import { LookupResultSchema, LookupInputSchema, type Report } from '../src/contracts.ts';

const report: Report = { id: 'test', scope: 'fixture', reportedAt: '2026-10-20T00:00:00.000Z', status: 'unresolved', observation: 'Fictional observation.' };

test('the inclusive 12-hour rule uses elapsed instants, including timezone offsets', () => {
  for (const [referenceAt, expected] of [
    ['2026-10-20T11:59:59.999Z', false],
    ['2026-10-20T12:00:00.000Z', true],
    ['2026-10-20T12:00:00.001Z', true],
    ['2026-10-20T08:00:00.000-04:00', true],
  ] as const) assert.equal(annotateReport(report, referenceAt).supervisorReview, expected);
  assert.equal(SUPERVISOR_REVIEW_AGE_MS, 43_200_000);
});

test('missing times and future reports retain unknown age and eligibility', () => {
  for (const [reportedAt, referenceAt, issue] of [
    [null, '2026-10-20T12:00:00Z', 'missing-report-time'],
    [undefined, '2026-10-20T12:00:00Z', 'missing-report-time'],
    [report.reportedAt, null, 'missing-reference-time'],
    [null, null, 'missing-both-times'],
    [report.reportedAt, '2026-10-19T23:00:00Z', 'report-after-reference'],
  ] as const) {
    const result = annotateReport({ ...report, reportedAt }, referenceAt);
    assert.equal(result.elapsedMs, null);
    assert.equal(result.supervisorReview, null);
    assert.equal(result.timeIssue, issue);
    assert.equal(result.reportedAt, reportedAt ?? null);
  }
});

test('resolved reports never become unresolved age-based review items', () => {
  assert.equal(annotateReport({ ...report, status: 'resolved' }, '2026-10-21T00:00:00Z').supervisorReview, false);
  assert.equal(annotateReport({ ...report, status: 'resolved' }, null).supervisorReview, false);
});

test('lookup preserves both unresolved claims, null timestamps, statuses and missing IDs', () => {
  const input = { recordIds: ['QH-102', 'QH-101', 'QH-103', 'QH-104', 'unknown', 'QH-101'], referenceAt: '2026-10-20T12:00:00.000Z' };
  const before = structuredClone(input);
  const result = lookupRecords(input);
  assert.ok(LookupResultSchema.safeParse(result).success);
  assert.deepEqual(result.records.map((record) => record.id), ['QH-102', 'QH-101', 'QH-103', 'QH-104']);
  assert.deepEqual(result.records.map((record) => record.supervisorReview), [false, true, null, false]);
  assert.deepEqual(result.missingRecordIds, ['unknown']);
  assert.deepEqual(result.potentialConflicts, [{ scope: 'loading-bay-latch', claims: [
    { recordId: 'QH-102', observation: 'Door latch operated normally during the check.' },
    { recordId: 'QH-101', observation: 'Door latch catches intermittently during closing.' },
  ] }]);
  assert.deepEqual(input, before);
  result.records[0]!.observation = 'Changed by caller';
  assert.equal(lookupRecords(input).records[0]!.observation, 'Door latch operated normally during the check.');
});

test('unknown reference stays unknown and input cannot request extra actions or paths', () => {
  assert.equal(lookupRecords({ recordIds: ['QH-101'] }).records[0]!.supervisorReview, null);
  assert.deepEqual(lookupRecords({ recordIds: ['../../package.json'] }).missingRecordIds, ['../../package.json']);
  for (const referenceAt of ['yesterday', '2026-10-20T12:00:00', '2026-02-31T12:00:00Z']) {
    assert.equal(LookupInputSchema.safeParse({ recordIds: ['QH-101'], referenceAt }).success, false);
  }
  assert.equal(LookupInputSchema.safeParse({ recordIds: ['QH-101'], close: true }).success, false);
});
