import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  observedAt: z.string().min(1),
  service: z.string().min(1),
  signal: z.string().min(1),
  value: z.number().finite(),
  unit: z.string().min(1),
  threshold: z.number().finite(),
});

export const ContextEventSchema = z.object({
  occurredAt: z.string().min(1),
  source: z.string().min(1),
  statement: z.string().min(1),
});

export const BatchSchema = z.object({
  batchId: z.string().min(1),
  capturedAt: z.string().min(1),
  events: z.array(EventSchema).min(1),
  context: z.array(ContextEventSchema),
  missingEvidence: z.array(z.string()),
});

export const ObservationSchema = z.object({
  eventId: z.string(),
  statement: z.string(),
  aboveThreshold: z.boolean(),
});

export const ModelReviewSchema = z.object({
  reviewEventIds: z.array(z.string()),
  hypotheses: z.array(z.object({
    question: z.string().min(1),
    supportingEventIds: z.array(z.string()),
  }).strict()),
}).strict();

export const AlertReviewSchema = z.object({
  batchId: z.string(),
  capturedAt: z.string(),
  rawEvents: z.array(EventSchema),
  observations: z.array(ObservationSchema),
  context: z.array(ContextEventSchema),
  missingEvidence: z.array(z.string()),
  engineerReview: z.object({
    recommended: z.boolean(),
    eventIds: z.array(z.string()),
  }),
  hypotheses: z.array(z.object({
    question: z.string(),
    status: z.literal('unverified'),
    supportingEventIds: z.array(z.string()),
  })),
});

export const GraphInputSchema = z.object({ batch: BatchSchema });
export const GraphOutputSchema = z.object({ result: AlertReviewSchema });
export const GraphStateSchema = GraphInputSchema.extend({
  observations: z.array(ObservationSchema).optional(),
  modelReview: ModelReviewSchema.optional(),
  result: AlertReviewSchema.optional(),
});
