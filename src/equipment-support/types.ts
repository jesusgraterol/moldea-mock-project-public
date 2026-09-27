import type { IDeskReview, IReviewSource } from '../desk-review/index.ts';

// equipment desk inputs exclude claims and fulfillment evidence
export interface IEquipmentSupportInvocation {
  instructions: string;
  caseSource: IReviewSource & { path: '/records/hs-214.md' };
  productSource: IReviewSource & { path: '/catalog/hc-240.md' };
}

// fit and symptom facts that the reply writer may use without a part commitment
export interface IEquipmentSupportReview extends IDeskReview {
  desk: 'equipment-support';
  dealerSafeFacts: {
    doorRevision: 'Rev B';
    tearLocation: 'near the lower corner';
  };
}

export type IEquipmentSupportInvoker = (
  invocation: IEquipmentSupportInvocation,
) => Promise<IEquipmentSupportReview>;

export interface IEquipmentSupportAgent {
  /**
   * Loads only the equipment instruction, case intake, and product sheet.
   * @returns A source-attributed, staff-only equipment review.
   * @throws
   * - An HS-214 equipment input is empty.
   * - An HS-214 preview input changed and must be reviewed.
   */
  invoke(): Promise<IEquipmentSupportReview>;
}
