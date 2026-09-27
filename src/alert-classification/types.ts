import { z } from 'zod';

// bounds keep one model request finite without prescribing alert-source formats
const MAX_EVENT_COUNT = 32;
const MAX_FIELD_LENGTH = 128;
const MAX_EVIDENCE_GAP_COUNT = 16;
const MAX_EVIDENCE_GAP_LENGTH = 256;

// one bounded, caller-supplied alert batch; event identifiers remain opaque strings
export const AlertBatchSchema = z.strictObject({
  batchId: z.string().min(1).max(MAX_FIELD_LENGTH),
  capturedAt: z.iso.datetime(),
  events: z
    .array(
      z.strictObject({
        eventId: z.string().min(1).max(MAX_FIELD_LENGTH),
        observedAt: z.iso.datetime(),
        service: z.string().min(1).max(MAX_FIELD_LENGTH),
        signal: z.string().min(1).max(MAX_FIELD_LENGTH),
        value: z.number().finite(),
        unit: z.string().min(1).max(MAX_FIELD_LENGTH),
        threshold: z.number().finite(),
      }),
    )
    .min(1)
    .max(MAX_EVENT_COUNT),
  deployment: z
    .strictObject({
      service: z.string().min(1).max(MAX_FIELD_LENGTH),
      release: z.string().min(1).max(MAX_FIELD_LENGTH),
      completedAt: z.iso.datetime(),
    })
    .optional(),
  knownEvidenceGaps: z
    .array(z.string().min(1).max(MAX_EVIDENCE_GAP_LENGTH))
    .max(MAX_EVIDENCE_GAP_COUNT),
});

export type IAlertBatch = z.infer<typeof AlertBatchSchema>;

// deterministic observations derived from source events, never from model output
export const NormalizedSignalSchema = z.strictObject({
  rawEventId: z.string(),
  observedAt: z.string(),
  service: z.string(),
  signal: z.string(),
  observedValue: z.number(),
  threshold: z.number(),
  unit: z.string(),
  isThresholdExceeded: z.boolean(),
});

export type INormalizedSignal = z.infer<typeof NormalizedSignalSchema>;

// model-authored recommendation for human review, not an incident or paging decision
export const ClassificationRecommendationSchema = z.strictObject({
  reviewPriority: z.enum(['routine', 'prompt']).meta({
    description: 'Suggested human review priority; not a paging or incident-status decision.',
  }),
  summary: z.string().min(1).meta({ description: 'Concise summary of observed alert signals.' }),
  rationale: z.string().min(1).meta({ description: 'Why these observations merit review.' }),
  hypotheses: z.array(z.string().min(1)).meta({
    description: 'Possible explanations explicitly presented as unconfirmed hypotheses.',
  }),
  evidenceNeeded: z.array(z.string().min(1)).meta({
    description: 'Additional evidence an engineer could inspect before deciding what happened.',
  }),
});

export type IClassificationRecommendation = z.infer<typeof ClassificationRecommendationSchema>;

// stage outputs retain original input and IDs alongside the model recommendation
export const ClassificationResultSchema = z.strictObject({
  rawBatch: AlertBatchSchema,
  rawEventIds: z.array(z.string()),
  normalizedSignals: z.array(NormalizedSignalSchema),
  recommendation: ClassificationRecommendationSchema,
});

export type IClassificationResult = z.infer<typeof ClassificationResultSchema>;
