import { z } from 'zod';
import { AlertReviewSchema, EventSchema, ObservationSchema } from './contracts.ts';

export const TimelineEntrySchema = z.object({
  at: z.string(),
  kind: z.enum(['context', 'signal', 'batch-capture']),
  source: z.string(),
  eventId: z.string().optional(),
  statement: z.string(),
});

export const ModelSynopsisSchema = z.object({
  synopsis: z.string().trim().min(1).max(400),
}).strict();

export const HandoffBriefSchema = z.object({
  batchId: z.string(),
  sourceEvidence: z.object({
    timeline: z.array(TimelineEntrySchema),
    observations: z.array(ObservationSchema),
    evidenceGaps: z.array(z.string()),
    rawEvents: z.array(EventSchema),
  }),
  classification: AlertReviewSchema.pick({ engineerReview: true, hypotheses: true }),
  modelDraft: ModelSynopsisSchema,
  humanReviewRequired: z.literal(true),
});

export const HandoffInputSchema = z.object({ classification: AlertReviewSchema });
export const HandoffOutputSchema = z.object({ brief: HandoffBriefSchema });
export const HandoffStateSchema = HandoffInputSchema.extend({
  timeline: z.array(TimelineEntrySchema).optional(),
  modelDraft: ModelSynopsisSchema.optional(),
  brief: HandoffBriefSchema.optional(),
});
