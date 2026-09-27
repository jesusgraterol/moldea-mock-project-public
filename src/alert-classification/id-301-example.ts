import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

import { classifyAlertBatch } from './alert-classification.graph.js';
import type { IAlertBatch, IClassificationResult } from './types.js';

// source-only example transcribed from records/id-301.md
export const ID_301_BATCH = {
  batchId: 'ID-301',
  capturedAt: '2026-09-27T09:16:00Z',
  events: [
    {
      eventId: 'P-771',
      observedAt: '2026-09-27T09:12:00Z',
      service: 'booking-api',
      signal: 'http_5xx_rate',
      value: 12,
      unit: 'percent',
      threshold: 5,
    },
    {
      eventId: 'P-772',
      observedAt: '2026-09-27T09:14:00Z',
      service: 'booking-api',
      signal: 'request_latency_p95',
      value: 2800,
      unit: 'ms',
      threshold: 1000,
    },
  ],
  deployment: {
    service: 'booking-api',
    release: '2.14',
    completedAt: '2026-09-27T09:08:00Z',
  },
  knownEvidenceGaps: [
    'Customer-impact count not supplied',
    'Database-health evidence not supplied',
  ],
} satisfies IAlertBatch;

/**
 * Invokes the classification graph for the fictional ID-301 batch without choosing a provider.
 * @param model A configured structured-output chat model supplied by the caller.
 * @returns The source observations and a recommendation for human review.
 */
export const classifyId301 = (model: BaseChatModel): Promise<IClassificationResult> =>
  classifyAlertBatch(model, ID_301_BATCH);
