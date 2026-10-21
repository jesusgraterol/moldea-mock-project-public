import source from '../data/records.json' with { type: 'json' };
import {
  LookupInputSchema, ReportSchema,
  type AnnotatedReport, type LookupInput, type LookupResult, type Report,
} from './contracts.ts';

export const SUPERVISOR_REVIEW_AGE_MS = 12 * 60 * 60 * 1_000;

const parsedSource = ReportSchema.array().safeParse(source);
if (!parsedSource.success) throw new TypeError('Invalid fictional shift-record dataset.');
const records = parsedSource.data;
if (new Set(records.map((record) => record.id)).size !== records.length) {
  throw new TypeError('Shift-record identifiers must be unique.');
}

/** No clock access: every age is relative to the supplied reference. */
export function annotateReport(record: Report, referenceAt: string | null): AnnotatedReport {
  const reportedAt = record.reportedAt ?? null;
  let timeIssue: AnnotatedReport['timeIssue'] = null;
  let elapsedMs: number | null = null;
  if (reportedAt === null && referenceAt === null) timeIssue = 'missing-both-times';
  else if (reportedAt === null) timeIssue = 'missing-report-time';
  else if (referenceAt === null) timeIssue = 'missing-reference-time';
  else {
    const difference = Date.parse(referenceAt) - Date.parse(reportedAt);
    if (difference < 0) timeIssue = 'report-after-reference';
    else elapsedMs = difference;
  }
  return {
    ...record,
    reportedAt,
    elapsedMs,
    timeIssue,
    supervisorReview: record.status === 'resolved'
      ? false
      : elapsedMs === null ? null : elapsedMs >= SUPERVISOR_REVIEW_AGE_MS,
  };
}

/** Reads only a bundled dataset; input IDs can never select paths or write state. */
export function lookupRecords(input: LookupInput): LookupResult {
  const parsed = LookupInputSchema.safeParse(input);
  if (!parsed.success) throw new TypeError('Invalid lookup request: supply record IDs and a zoned timestamp or null.');
  const referenceAt = parsed.data.referenceAt ?? null;
  const selected: AnnotatedReport[] = [];
  const missingRecordIds: string[] = [];
  for (const id of new Set(parsed.data.recordIds)) {
    const record = records.find((candidate) => candidate.id === id);
    if (record) selected.push(annotateReport(record, referenceAt));
    else missingRecordIds.push(id);
  }
  const groups = new Map<string, AnnotatedReport[]>();
  for (const record of selected) {
    if (record.status !== 'unresolved') continue;
    const group = groups.get(record.scope) ?? [];
    group.push(record);
    groups.set(record.scope, group);
  }
  const potentialConflicts = [...groups.entries()]
    .filter(([, group]) => new Set(group.map((record) => record.observation)).size > 1)
    .map(([scope, group]) => ({
      scope,
      claims: group.map((record) => ({ recordId: record.id, observation: record.observation })),
    }));
  return { source: 'fictional-local-records', draftOnly: true, referenceAt, records: selected, missingRecordIds, potentialConflicts };
}
