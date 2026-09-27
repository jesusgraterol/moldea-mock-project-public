import type { IDeskReview, IReviewSource } from '../desk-review/index.ts';

// claims inputs exclude equipment intake, product fit, and fulfillment evidence
export interface IClaimsReviewInvocation {
  instructions: string;
  claimSource: IReviewSource & { path: '/records/hs-214-claims.md' };
  policySource: IReviewSource & { path: '/policies/parts-warranty.md' };
}

export interface IClaimsReview extends IDeskReview {
  desk: 'claims-review';
}

export type IClaimsReviewInvoker = (
  invocation: IClaimsReviewInvocation,
) => Promise<IClaimsReview>;

export interface IClaimsReviewAgent {
  /**
   * Loads only the claims instruction, claim evidence, and warranty policy.
   * @returns A source-attributed, staff-only preliminary claims review.
   * @throws
   * - An HS-214 claims input is empty.
   * - An HS-214 preview input changed and must be reviewed.
   */
  invoke(): Promise<IClaimsReview>;
}
