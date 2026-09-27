import { assertReviewedSource } from '../desk-review/index.ts';

import { screenWarrantyReportingWindow } from './claims-review-warranty.ts';
import type { IClaimsReview, IClaimsReviewInvocation } from './types.ts';

const REVIEWED_SHA256 = {
  instructions: '5fed093f837e1b7204b1d678b93b1491e1be1a448295ab196af7da4fc7fda743',
  claimSource: '4e1d628f64cdd8261a1f64273e26c51b72cd205310a101d208ae5ec61da2b6c2',
  policySource: 'b47044781a9b72333f4d12a71d108893a8c6d19d747fe53f8802d479ed465b7a',
} as const;

// dates extracted from the reviewed claims evidence, not a live claim system
const INVOICE_DATE = '2026-01-12';
const REPORT_DATE = '2026-09-27';

/**
 * Produces a preliminary claims screen, never a coverage decision.
 * @param invocation The claims instruction, evidence, and policy.
 * @returns Staff-only source-attributed claims findings and open questions.
 * @throws
 * - An HS-214 preview input changed and must be reviewed.
 * - Warranty dates must be valid YYYY-MM-DD values.
 */
export const previewClaimsReview = async (
  invocation: IClaimsReviewInvocation,
): Promise<IClaimsReview> => {
  assertReviewedSource(
    { path: '/moldea/agents/claims-review/instruction.md', markdown: invocation.instructions },
    '/moldea/agents/claims-review/instruction.md',
    REVIEWED_SHA256.instructions,
  );
  assertReviewedSource(
    invocation.claimSource,
    '/records/hs-214-claims.md',
    REVIEWED_SHA256.claimSource,
  );
  assertReviewedSource(
    invocation.policySource,
    '/policies/parts-warranty.md',
    REVIEWED_SHA256.policySource,
  );

  const reportingWindow = screenWarrantyReportingWindow(INVOICE_DATE, REPORT_DATE);
  const windowFinding =
    reportingWindow === 'within-period'
      ? `The authorized-dealer invoice is dated ${INVOICE_DATE}; the ${REPORT_DATE} report is within the 12-month reporting period. This is not claim approval.`
      : reportingWindow === 'outside-period'
        ? `The ${REPORT_DATE} report appears outside the 12-month period from the ${INVOICE_DATE} invoice. Staff must verify the dates and policy.`
        : `The ${REPORT_DATE} report falls at an unsettled 12-month boundary from the ${INVOICE_DATE} invoice. Staff must interpret the policy.`;

  return {
    audience: 'staff-only',
    desk: 'claims-review',
    findings: [
      { text: windowFinding, sources: ['/records/hs-214-claims.md', '/policies/parts-warranty.md'] },
      {
        text: 'The warranty covers manufacturing defects and excludes documented cleaning damage. The evidence establishes neither a manufacturing defect nor documented cleaning damage as the cause of the tear.',
        sources: ['/records/hs-214-claims.md', '/policies/parts-warranty.md'],
      },
    ],
    openQuestions: [
      {
        text: 'Review the close-up and any known circumstances of the tear, then let staff decide whether the claim qualifies. Do not communicate a preliminary screen as approval.',
        sources: ['/records/hs-214-claims.md', '/policies/parts-warranty.md'],
      },
    ],
  };
};
