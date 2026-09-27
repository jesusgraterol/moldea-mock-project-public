import { assertReviewedSource } from '../desk-review/index.ts';

import type { IDealerReplyInvocation, IDealerReplyResult } from './types.ts';

const REVIEWED_SHA256 = {
  instructions: '44a3c53492d21516f713b93f3c30c6c1f797ab404424a8d40a338807183f881c',
  equipmentReview: 'd65da68c23a419e66808ff1eeeb17fe56090c02a42baa509ef04c9f42009389f',
  claimsReview: '467c6ec0690287bf057067357518d8bc6c65d85dd6fd2834e1a955514d9033bd',
  fulfillmentReview: 'e2aae079ea0fe41ba5b0c7d60b7b53a5a3af4accd9ba8a498b86f19767240d93',
} as const;

/**
 * Composes the reviewed HS-214 desk outputs without making a desk decision.
 * @param invocation The writer instruction and three staff-only reviews.
 * @returns A dealer draft, original desk reviews, and manager approval checks.
 * @throws
 * - An HS-214 preview input changed and must be reviewed.
 */
export const previewDealerReply = async (
  invocation: IDealerReplyInvocation,
): Promise<IDealerReplyResult> => {
  assertReviewedSource(
    { path: '/moldea/agents/dealer-reply/instruction.md', markdown: invocation.instructions },
    '/moldea/agents/dealer-reply/instruction.md',
    REVIEWED_SHA256.instructions,
  );
  assertReviewedSource(
    { path: 'equipment-review', markdown: JSON.stringify(invocation.equipmentReview) },
    'equipment-review',
    REVIEWED_SHA256.equipmentReview,
  );
  assertReviewedSource(
    { path: 'claims-review', markdown: JSON.stringify(invocation.claimsReview) },
    'claims-review',
    REVIEWED_SHA256.claimsReview,
  );
  assertReviewedSource(
    { path: 'fulfillment-review', markdown: JSON.stringify(invocation.fulfillmentReview) },
    'fulfillment-review',
    REVIEWED_SHA256.fulfillmentReview,
  );

  const { doorRevision, tearLocation } = invocation.equipmentReview.dealerSafeFacts;

  return {
    mode: 'deterministic-preview',
    dealerDraft: [
      'Hello Ridgeway Foodservice,',
      '',
      `Thanks for sending the clearer HC-240 door-channel photo. It identifies a ${doorRevision} door channel, and you have reported a tear ${tearLocation} of the gasket. Our team will confirm the appropriate replacement part before advising you.`,
      '',
      'You mentioned that moisture appeared around the door edge after cleaning. That timing alone does not establish the cause. Could you share a measured cabinet temperature, let us know whether the door closes fully, and send a close-up photo of the torn area? If you know when the tear first appeared or observed what happened before it, please include that context.',
      '',
      'We will review those details and follow up.',
    ].join('\n'),
    deskReviews: {
      equipment: invocation.equipmentReview,
      claims: invocation.claimsReview,
      fulfillment: invocation.fulfillmentReview,
    },
    managerChecks: [
      'Manager approves the dealer response and any part, claim, shipping, or safety commitment before staff send it.',
      'This preview has no send path, live inventory, claim decision, or provider-backed conversation.',
    ],
  };
};
