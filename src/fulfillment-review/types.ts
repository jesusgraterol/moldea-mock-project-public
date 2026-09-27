import type { IDeskReview, IReviewSource } from '../desk-review/index.ts';

// fulfillment inputs exclude equipment and claim evidence
export interface IFulfillmentReviewInvocation {
  instructions: string;
  fulfillmentSource: IReviewSource & { path: '/records/hs-214-fulfillment.md' };
}

export interface IFulfillmentReview extends IDeskReview {
  desk: 'fulfillment-review';
}

export type IFulfillmentReviewInvoker = (
  invocation: IFulfillmentReviewInvocation,
) => Promise<IFulfillmentReview>;

export interface IFulfillmentReviewAgent {
  /**
   * Loads only the fulfillment instruction and dated stock/transit evidence.
   * @returns A source-attributed, staff-only fulfillment review.
   * @throws
   * - An HS-214 fulfillment input is empty.
   * - An HS-214 preview input changed and must be reviewed.
   */
  invoke(): Promise<IFulfillmentReview>;
}
