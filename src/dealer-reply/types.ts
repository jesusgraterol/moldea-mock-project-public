import type { IClaimsReview } from '../claims-review/index.ts';
import type { IEquipmentSupportReview } from '../equipment-support/index.ts';
import type { IFulfillmentReview } from '../fulfillment-review/index.ts';

// the writer receives desk findings, not the underlying desk-owned sources
export interface IDealerReplyInvocation {
  instructions: string;
  equipmentReview: IEquipmentSupportReview;
  claimsReview: IClaimsReview;
  fulfillmentReview: IFulfillmentReview;
}

// staff-facing result, with all source-attributed desk reviews kept separate
export interface IDealerReplyResult {
  mode: 'deterministic-preview';
  dealerDraft: string;
  deskReviews: {
    equipment: IEquipmentSupportReview;
    claims: IClaimsReview;
    fulfillment: IFulfillmentReview;
  };
  managerChecks: string[];
}

// replaceable invocation boundary; no provider implementation is installed
export type IDealerReplyInvoker = (
  invocation: IDealerReplyInvocation,
) => Promise<IDealerReplyResult>;

export interface IDealerReplyAgent {
  /**
   * Loads the writer instruction and invokes it with completed desk reviews.
   * @param reviews The three independent, staff-only desk reviews.
   * @returns A dealer draft alongside the original reviews and approval checks.
   * @throws
   * - The dealer-reply instruction is empty.
   * - An HS-214 preview input changed and must be reviewed.
   */
  invoke(reviews: Omit<IDealerReplyInvocation, 'instructions'>): Promise<IDealerReplyResult>;
}
