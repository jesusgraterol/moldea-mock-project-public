import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createClaimsReviewAgent, previewClaimsReview } from '../claims-review/index.ts';
import { createEquipmentSupportAgent, previewEquipmentSupport } from '../equipment-support/index.ts';
import { createFulfillmentReviewAgent, previewFulfillmentReview } from '../fulfillment-review/index.ts';

import { createDealerReplyAgent } from './dealer-reply-agent.ts';
import { previewDealerReply } from './dealer-reply-preview.ts';
import type { IDealerReplyInvocation } from './types.ts';

const loadDeskReviews = async (): Promise<Omit<IDealerReplyInvocation, 'instructions'>> => {
  const [equipmentReview, claimsReview, fulfillmentReview] = await Promise.all([
    createEquipmentSupportAgent(previewEquipmentSupport).invoke(),
    createClaimsReviewAgent(previewClaimsReview).invoke(),
    createFulfillmentReviewAgent(previewFulfillmentReview).invoke(),
  ]);

  return { equipmentReview, claimsReview, fulfillmentReview };
};

test('writer loads its instruction and receives desk reviews rather than their sources', async () => {
  const reviews = await loadDeskReviews();
  let loaded: IDealerReplyInvocation | undefined;
  const agent = createDealerReplyAgent((invocation) => {
    loaded = invocation;
    return previewDealerReply(invocation);
  });

  const result = await agent.invoke(reviews);

  assert.ok(loaded);
  assert.deepEqual(Object.keys(loaded).sort(), [
    'claimsReview',
    'equipmentReview',
    'fulfillmentReview',
    'instructions',
  ]);
  assert.match(loaded.instructions, /`dealer-reply`/);
  assert.equal(result.mode, 'deterministic-preview');
  assert.match(result.dealerDraft, /Rev B door channel/);
  assert.match(result.dealerDraft, /measured cabinet temperature/);
  assert.match(result.dealerDraft, /close-up photo of the torn area/);
  assert.doesNotMatch(result.dealerDraft, /GS-240-[AB]|warranty|stock|business days|delivery/i);
  assert.deepEqual(result.deskReviews, {
    equipment: reviews.equipmentReview,
    claims: reviews.claimsReview,
    fulfillment: reviews.fulfillmentReview,
  });
  assert.match(result.managerChecks.join(' '), /Manager approves the dealer response/);
});

test('writer refuses a changed desk finding or instruction', async () => {
  const reviews = await loadDeskReviews();
  const changedClaims = structuredClone(reviews.claimsReview);
  changedClaims.findings[0].text += ' Changed';

  const agent = createDealerReplyAgent(previewDealerReply);
  await assert.rejects(
    agent.invoke({ ...reviews, claimsReview: changedClaims }),
    /An HS-214 preview input changed/,
  );

  const changedInstructionAgent = createDealerReplyAgent((invocation) =>
    previewDealerReply({ ...invocation, instructions: `${invocation.instructions}\n` }),
  );
  await assert.rejects(
    changedInstructionAgent.invoke(reviews),
    /An HS-214 preview input changed/,
  );
});
