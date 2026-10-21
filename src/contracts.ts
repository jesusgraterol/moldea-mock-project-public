import { z } from 'zod';

// JavaScript timestamps have millisecond precision; reject finer input instead
// of silently rounding a request onto the inclusive boundary.
export const UtcTimestampSchema = z.iso.datetime().refine(
  (value) => !/\.\d{4,}Z$/.test(value),
  { error: 'Use UTC timestamps with at most millisecond precision.' },
);

export const ReturnRequestSchema = z.strictObject({
  orderId: z.string().min(1),
  requestedAt: UtcTimestampSchema,
});

export const OrderLookupInputSchema = z.strictObject({
  orderId: z.string().min(1),
});

export const OrderRecordSchema = z.strictObject({
  id: z.string().min(1),
  reference: z.string().min(1),
  item: z.string().min(1),
  // Delivery may be absent or invalid; assessment must not invent a date.
  deliveredAt: z.string().nullable().default(null),
});

export const StaffRecommendationSchema = z.strictObject({
  requestedOrderId: z.string().min(1),
  supportingOrder: z.strictObject({
    id: z.string().min(1),
    reference: z.string().min(1),
  }).nullable().describe('Identifiers from the lookup only; null when unverified.'),
  lookupStatus: z.enum(['found', 'not_found', 'unavailable']),
  assessment: z.strictObject({
    status: z.enum(['within_window', 'outside_window', 'unknown']),
    reason: z.enum([
      'assessed', 'missing_delivery', 'invalid_delivery',
      'order_not_found', 'lookup_failed', 'request_before_delivery',
    ]),
    deliveredAt: UtcTimestampSchema.nullable(),
    requestedAt: UtcTimestampSchema,
    elapsedMs: z.number().int().nullable(),
    windowMs: z.literal(1_814_400_000),
  }),
  missingFacts: z.array(z.enum(['order_record', 'delivery_timestamp'])),
  recommendation: z.enum([
    'recommend_within_window', 'recommend_outside_window', 'needs_more_information',
  ]).describe('Advisory recommendation, never an approval or operational action.'),
  rationale: z.string().min(1).describe('Brief staff-facing explanation grounded in the tool result.'),
  staffApproval: z.strictObject({
    required: z.literal(true),
    status: z.literal('pending'),
  }),
  authority: z.literal('recommendation_only'),
});

export type ReturnRequest = z.infer<typeof ReturnRequestSchema>;
export type OrderRecord = z.infer<typeof OrderRecordSchema>;
export type StaffRecommendation = z.infer<typeof StaffRecommendationSchema>;
export type GroundedFacts = Omit<StaffRecommendation, 'rationale'>;
export type OrderLookupResult =
  | { status: 'found'; order: OrderRecord }
  | { status: 'not_found' | 'unavailable'; order: null };
