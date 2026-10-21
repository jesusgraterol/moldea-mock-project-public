import {
  UtcTimestampSchema,
  type GroundedFacts,
  type OrderLookupResult,
  type ReturnRequest,
} from './contracts.ts';

export const RETURN_WINDOW_MS = 1_814_400_000; // 21 * 24 * 60 * 60 * 1_000

/** Fixed elapsed time from supplied UTC timestamps, never the machine clock. */
export function assessReturn(request: ReturnRequest, lookup: OrderLookupResult): GroundedFacts {
  const facts: GroundedFacts = {
    requestedOrderId: request.orderId,
    supportingOrder: null,
    lookupStatus: lookup.status,
    assessment: {
      status: 'unknown',
      reason: lookup.status === 'not_found' ? 'order_not_found' : 'lookup_failed',
      deliveredAt: null,
      requestedAt: request.requestedAt,
      elapsedMs: null,
      windowMs: RETURN_WINDOW_MS,
    },
    missingFacts: ['order_record', 'delivery_timestamp'],
    recommendation: 'needs_more_information',
    staffApproval: { required: true, status: 'pending' },
    authority: 'recommendation_only',
  };

  if (lookup.status !== 'found') return facts;
  const { order } = lookup;
  facts.supportingOrder = { id: order.id, reference: order.reference };
  facts.missingFacts = ['delivery_timestamp'];
  facts.assessment.reason = 'missing_delivery';
  if (order.deliveredAt === null) return facts;

  const delivery = UtcTimestampSchema.safeParse(order.deliveredAt);
  if (!delivery.success) {
    facts.assessment.reason = 'invalid_delivery';
    return facts;
  }

  facts.missingFacts = [];
  facts.assessment.deliveredAt = delivery.data;
  const elapsedMs = Date.parse(request.requestedAt) - Date.parse(delivery.data);
  facts.assessment.elapsedMs = elapsedMs;
  if (elapsedMs < 0) {
    facts.assessment.reason = 'request_before_delivery';
    return facts;
  }

  const withinWindow = elapsedMs <= RETURN_WINDOW_MS;
  facts.assessment.status = withinWindow ? 'within_window' : 'outside_window';
  facts.assessment.reason = 'assessed';
  facts.recommendation = withinWindow ? 'recommend_within_window' : 'recommend_outside_window';
  return facts;
}
