import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

import { classifyAlertBatch } from './alert-classification.graph.js';
import type { IAlertBatch, IClassificationResult } from './types.js';

// source-only example transcribed from records/id-302.md
export const ID_302_BATCH = {
  batchId: 'ID-302',
  capturedAt: '2026-09-27T09:22:00Z',
  events: [
    {
      eventId: 'P-773',
      observedAt: '2026-09-27T09:18:00Z',
      service: 'booking-api',
      signal: 'request_latency_p95',
      value: 2800,
      unit: 'ms',
      threshold: 1000,
    },
    {
      eventId: 'M-302',
      observedAt: '2026-09-27T09:19:00Z',
      service: 'booking-api',
      signal: 'request_latency_p95',
      value: 2.8,
      unit: 'seconds',
      threshold: 1,
    },
  ],
  knownEvidenceGaps: [
    'Customer-impact count not supplied',
    'Cause not established by the supplied readings',
  ],
} satisfies IAlertBatch;

/**
 * Invokes the classification graph for the fictional ID-302 batch without choosing a provider.
 * @param model A configured structured-output chat model supplied by the caller.
 * @returns The separate source observations and a recommendation for human review.
 */
export const classifyId302 = (model: BaseChatModel): Promise<IClassificationResult> =>
  classifyAlertBatch(model, ID_302_BATCH);
