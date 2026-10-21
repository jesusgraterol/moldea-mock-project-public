import { z } from 'zod';

export const TimestampSchema = z.iso.datetime({ offset: true });

export const ReportSchema = z.strictObject({
  id: z.string().min(1),
  scope: z.string().min(1),
  reportedAt: TimestampSchema.nullish(),
  status: z.enum(['unresolved', 'resolved']),
  observation: z.string().min(1),
});

export const LookupInputSchema = z.strictObject({
  recordIds: z.array(z.string().min(1)).min(1)
    .describe('Identifiers of fictional local shift records to read; never filesystem paths.'),
  referenceAt: TimestampSchema.nullish()
    .describe('Supplied reference timestamp, including timezone. Omit or use null when unknown; never substitute the machine clock.'),
});

export const AnnotatedReportSchema = ReportSchema.extend({
  reportedAt: TimestampSchema.nullable(),
  elapsedMs: z.number().nonnegative().nullable(),
  supervisorReview: z.boolean().nullable(),
  timeIssue: z.enum([
    'missing-report-time', 'missing-reference-time', 'missing-both-times',
    'report-after-reference',
  ]).nullable(),
});

export const LookupResultSchema = z.strictObject({
  source: z.literal('fictional-local-records'),
  draftOnly: z.literal(true),
  referenceAt: TimestampSchema.nullable(),
  records: z.array(AnnotatedReportSchema),
  missingRecordIds: z.array(z.string()),
  potentialConflicts: z.array(z.strictObject({
    scope: z.string(),
    claims: z.array(z.strictObject({ recordId: z.string(), observation: z.string() })),
  })),
});

export type Report = z.infer<typeof ReportSchema>;
export type LookupInput = z.infer<typeof LookupInputSchema>;
export type AnnotatedReport = z.infer<typeof AnnotatedReportSchema>;
export type LookupResult = z.infer<typeof LookupResultSchema>;
