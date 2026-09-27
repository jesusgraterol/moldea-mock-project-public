import { createClaimsReviewAgent, previewClaimsReview } from '../claims-review/index.ts';
import {
  createDealerReplyAgent,
  previewDealerReply,
  type IDealerReplyResult,
} from '../dealer-reply/index.ts';
import { createEquipmentSupportAgent, previewEquipmentSupport } from '../equipment-support/index.ts';
import { createFulfillmentReviewAgent, previewFulfillmentReview } from '../fulfillment-review/index.ts';

/**
 * Runs the three independent desk reviews before composing the staff packet.
 * @returns The source-only HS-214 review packet and dealer draft.
 * @throws
 * - An HS-214 equipment input is empty.
 * - An HS-214 claims input is empty.
 * - An HS-214 fulfillment input is empty.
 * - The dealer-reply instruction is empty.
 * - An HS-214 preview input changed and must be reviewed.
 */
export const runHs214Preview = async (): Promise<IDealerReplyResult> => {
  const equipmentAgent = createEquipmentSupportAgent(previewEquipmentSupport);
  const claimsAgent = createClaimsReviewAgent(previewClaimsReview);
  const fulfillmentAgent = createFulfillmentReviewAgent(previewFulfillmentReview);
  const replyAgent = createDealerReplyAgent(previewDealerReply);

  const [equipmentReview, claimsReview, fulfillmentReview] = await Promise.all([
    equipmentAgent.invoke(),
    claimsAgent.invoke(),
    fulfillmentAgent.invoke(),
  ]);

  return replyAgent.invoke({ equipmentReview, claimsReview, fulfillmentReview });
};
