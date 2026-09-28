import { z } from 'zod';

// closed records belong to this repository's versioned evidence format
export const UnknownSchema = z.strictObject({
  state: z.literal('unknown'),
  reason: z.string().min(1),
});

const knownOrUnknown = (schema) => z.union([schema, UnknownSchema]);
const CommitSchema = z.string().regex(/^[0-9a-f]{40}$/);
const Sha256Schema = z.string().regex(/^[0-9a-f]{64}$/);
const EventOrdinalSchema = z.int().nonnegative();
const PortablePathSchema = z.string().min(1);

export const RedactionRuleSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  reason: z.string().min(1),
  eventOrdinal: EventOrdinalSchema,
  path: z.array(z.union([z.string().min(1), EventOrdinalSchema])).min(1),
  start: EventOrdinalSchema.optional(),
  end: EventOrdinalSchema.optional(),
});

export const CaptureRulesSchema = z.strictObject({
  includeBaseInstructions: z.boolean().default(false),
  rules: z.array(RedactionRuleSchema),
});

// native fields consumed by capture; unrelated fields remain available to the projector
export const NativeRecordSchema = z.looseObject({
  type: z.string().min(1),
  timestamp: z.string().optional(),
  payload: z.unknown(),
});

const RedactionRecordSchema = z.strictObject({
  id: z.string().min(1),
  reason: z.string().min(1),
  sessionId: z.uuid(),
  eventOrdinal: EventOrdinalSchema,
  path: z.array(z.union([z.string(), EventOrdinalSchema])).min(1),
  affectedLocations: z.array(PortablePathSchema),
});

const TurnSchema = z.strictObject({
  eventOrdinal: EventOrdinalSchema,
  requestedModel: knownOrUnknown(z.string().min(1)),
  requestedEffort: knownOrUnknown(z.string().min(1)),
  effectiveModel: knownOrUnknown(z.string().min(1)),
  effectiveEffort: knownOrUnknown(z.string().min(1)),
  deviation: knownOrUnknown(z.boolean()),
});

// exact Release asset identity used by evidence references
const AssetLocatorSchema = z.strictObject({
  tag: z.string().min(1),
  name: z.string().min(1),
});

// exact release or installation output retained in a verified evidence asset
const EvidenceSourceSchema = AssetLocatorSchema.extend({
  locator: z.string().min(1),
});

const SessionSchema = z.strictObject({
  id: z.uuid(),
  hostVersion: knownOrUnknown(z.string().min(1)),
  turns: knownOrUnknown(z.array(TurnSchema)),
});

const RequestSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  ordinal: z.int().positive(),
  kind: z.enum(['initial', 'follow-up', 'intervention']),
  text: z.string().min(1),
  sessionId: z.uuid(),
  eventOrdinal: EventOrdinalSchema,
  beforeCommit: CommitSchema,
  afterCommit: CommitSchema.nullable(),
  observedResult: z.string().min(1),
  redactionIds: z.array(z.string().min(1)),
});

const CheckSchema = z.strictObject({
  kind: z.enum(['command', 'manual']),
  description: z.string().min(1),
  inputCommit: CommitSchema.nullable(),
  result: z.enum(['passed', 'failed', 'blocked']),
  coveredArtifacts: z.array(PortablePathSchema),
  asset: AssetLocatorSchema.nullable(),
});

const AssetSchema = z.strictObject({
  kind: z.enum(['session', 'log', 'recovery']),
  tag: z.string().min(1),
  name: z.string().min(1),
  sizeBytes: z.int().nonnegative(),
  sha256: Sha256Schema,
  mediaType: z.string().min(1),
  sessionId: z.uuid().nullable(),
  firstEventOrdinal: EventOrdinalSchema.nullable(),
  lastEventOrdinal: EventOrdinalSchema.nullable(),
});

const InterventionSchema = z.strictObject({
  requestId: z.string().min(1),
  interventionRequestId: z.string().min(1),
  originalResult: z.string().min(1),
  assistedResult: z.string().min(1),
  originalCommit: CommitSchema.nullable(),
  assistedCommit: CommitSchema.nullable(),
});

const FailureSchema = z.strictObject({
  kind: z.enum(['actor', 'driver', 'environment', 'package', 'model-variance']),
  requestId: z.string().nullable(),
  description: z.string().min(1),
  asset: AssetLocatorSchema.nullable(),
});

const InstallationSchema = z.strictObject({
  sessionId: z.uuid(),
  eventOrdinal: EventOrdinalSchema,
  source: EvidenceSourceSchema,
  skill: z.strictObject({
    ref: z.string().min(1),
    contentHash: Sha256Schema,
  }),
  cli: z.strictObject({
    version: z.string().min(1),
    integrity: knownOrUnknown(z.string().min(1)),
  }),
  core: z.strictObject({
    version: z.string().min(1),
    integrity: knownOrUnknown(z.string().min(1)),
  }),
  adapters: z.array(z.strictObject({
    name: z.string().min(1),
    version: z.string().min(1),
    integrity: knownOrUnknown(z.string().min(1)),
  })),
});

const RecoveryItemSchema = z.strictObject({
  path: PortablePathSchema,
  kind: z.enum(['file', 'symlink', 'deletion']),
  mode: z.string().nullable(),
  sha256: Sha256Schema.nullable(),
});

const RecoverySchema = z.strictObject({
  kind: z.enum(['checkpoint', 'asset']),
  baseCommit: CommitSchema,
  checkpointCommit: CommitSchema.nullable(),
  asset: AssetLocatorSchema.nullable(),
  inventory: z.array(RecoveryItemSchema),
  restoreProcedure: z.string().min(1),
  verified: z.boolean(),
  gaps: z.array(z.string().min(1)),
});

export const AttemptSchema = z.strictObject({
  formatVersion: z.literal(1),
  runId: z.string().min(1),
  scenarioId: z.string().min(1),
  attemptId: z.string().min(1),
  branch: z.string().min(1),
  baseCommit: CommitSchema,
  finalCommit: CommitSchema.nullable(),
  lastDurableCommit: CommitSchema,
  scenarioDefinition: knownOrUnknown(z.strictObject({
    path: PortablePathSchema,
    commit: CommitSchema,
  })),
  observedSummary: z.string().min(1),
  actorOutcome: z.enum(['pending', 'concluded', 'failed', 'abandoned', 'interrupted', 'unknown']),
  outcomeReason: z.string().nullable(),
  evidenceStatus: z.enum(['incomplete', 'complete']),
  reviewStatus: z.enum(['pending', 'complete', 'unknown']),
  review: knownOrUnknown(PortablePathSchema.nullable()),
  sessions: z.array(SessionSchema).min(1),
  requests: knownOrUnknown(z.array(RequestSchema)),
  ignoredDeveloperEvents: knownOrUnknown(z.array(z.strictObject({
    sessionId: z.uuid(),
    eventOrdinal: EventOrdinalSchema,
    reason: z.string().min(1),
  }))),
  checks: knownOrUnknown(z.array(CheckSchema)),
  installations: knownOrUnknown(z.array(InstallationSchema)),
  skillRelease: knownOrUnknown(z.string().min(1)),
  assets: knownOrUnknown(z.array(AssetSchema)),
  interventions: knownOrUnknown(z.array(InterventionSchema)),
  failures: knownOrUnknown(z.array(FailureSchema)),
  redactions: z.array(RedactionRecordSchema),
  recovery: knownOrUnknown(RecoverySchema.nullable()),
  predecessorAttemptId: z.string().nullable(),
  limitations: z.array(z.string().min(1)),
});

export const RunSchema = z.strictObject({
  formatVersion: z.literal(1),
  runId: z.string().min(1),
  date: z.iso.date(),
  summary: z.string().min(1),
  expectedActor: knownOrUnknown(z.strictObject({
    model: z.string().min(1),
    effort: z.string().min(1),
  })),
  prerequisites: knownOrUnknown(z.array(z.strictObject({
    component: z.string().min(1),
    version: z.string().min(1),
    integrity: knownOrUnknown(z.string().min(1)),
    source: EvidenceSourceSchema,
  }))),
  attempts: z.array(PortablePathSchema).min(1),
  evidenceStatus: z.enum(['incomplete', 'complete']),
  reviewStatus: z.enum(['pending', 'complete', 'unknown']),
  review: knownOrUnknown(PortablePathSchema.nullable()),
  limitations: z.array(z.string().min(1)),
});

export const IndexSchema = z.strictObject({
  formatVersion: z.literal(1),
  runs: z.array(z.strictObject({
    runId: z.string().min(1),
    manifestPath: PortablePathSchema,
    summary: z.string().min(1),
    evidenceStatus: z.enum(['incomplete', 'complete']),
    reviewStatus: z.enum(['pending', 'complete', 'unknown']),
  })),
});
