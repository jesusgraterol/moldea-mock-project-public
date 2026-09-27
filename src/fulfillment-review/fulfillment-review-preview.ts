import { assertReviewedSource } from '../desk-review/index.ts';

import type { IFulfillmentReview, IFulfillmentReviewInvocation } from './types.ts';

const REVIEWED_SHA256 = {
  instructions: '1fdb0131bd1a3efdaf60de833a4d0dbe80902b95765c7e06f69f1e2e4edc3496',
  fulfillmentSource: '134a61680022cd796410256647e021fbab728cd2c525879790c8bc4078611a55',
} as const;

/**
 * Produces a dated fulfillment review, never a live stock or delivery assertion.
 * @param invocation The fulfillment instruction and evidence.
 * @returns Staff-only source-attributed shipment findings and questions.
 * @throws
 * - An HS-214 preview input changed and must be reviewed.
 */
export const previewFulfillmentReview = async (
  invocation: IFulfillmentReviewInvocation,
): Promise<IFulfillmentReview> => {
  assertReviewedSource(
    { path: '/moldea/agents/fulfillment-review/instruction.md', markdown: invocation.instructions },
    '/moldea/agents/fulfillment-review/instruction.md',
    REVIEWED_SHA256.instructions,
  );
  assertReviewedSource(
    invocation.fulfillmentSource,
    '/records/hs-214-fulfillment.md',
    REVIEWED_SHA256.fulfillmentSource,
  );

  return {
    audience: 'staff-only',
    desk: 'fulfillment-review',
    findings: [
      {
        text: 'The 2026-09-26 snapshot listed four GS-240-B kits at the East depot and none reserved for HS-214. It does not establish current availability.',
        sources: ['/records/hs-214-fulfillment.md'],
      },
      {
        text: 'The normal route takes roughly three to five business days after dispatch. This is not a dispatch date or delivery promise.',
        sources: ['/records/hs-214-fulfillment.md'],
      },
    ],
    openQuestions: [
      {
        text: 'Confirm current availability, whether a kit can be reserved, the destination, dispatch, and timing before any shipping commitment.',
        sources: ['/records/hs-214-fulfillment.md'],
      },
    ],
  };
};
