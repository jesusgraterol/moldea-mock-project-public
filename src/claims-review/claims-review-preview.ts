import { assertReviewedSource } from '../desk-review/index.ts';

import { screenWarrantyReportingWindow } from './claims-review-warranty.ts';
import type { IClaimsReview, IClaimsReviewInvocation } from './types.ts';

const REVIEWED_SHA256 = {
  instructions: '15216447276e8cfc0cc2ca167e9a1d25488b9c2614a2a47aad998bcf5c2f4b1f',
  claimSource: '4e1d628f64cdd8261a1f64273e26c51b72cd205310a101d208ae5ec61da2b6c2',
  policySource: '8f0c00fa3d2a0d66ec85f96098eb3513d82183e40211481d4a571c60043f514b',
} as const;

// dates extracted from the reviewed claims evidence, not a live claim system
const INVOICE_DATE = '2026-01-12';
const REPORT_DATE = '2026-09-27';
// HS-214 is an HC-240 door gasket under the reviewed open-case policy
const REPORTING_MONTHS = 18;

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

  const reportingWindow = screenWarrantyReportingWindow(
    INVOICE_DATE,
    REPORT_DATE,
    REPORTING_MONTHS,
  );
  const windowFinding =
    reportingWindow === 'within-period'
      ? `HS-214 concerns an HC-240 door gasket. The authorized-dealer invoice is dated ${INVOICE_DATE}; the ${REPORT_DATE} report is within its applicable ${REPORTING_MONTHS}-month reporting period. This is not claim approval.`
      : reportingWindow === 'outside-period'
        ? `The ${REPORT_DATE} report appears outside the applicable ${REPORTING_MONTHS}-month period from the ${INVOICE_DATE} authorized-dealer invoice. The claims desk must verify the dates and policy.`
        : `The ${REPORT_DATE} report falls at an unsettled ${REPORTING_MONTHS}-month boundary from the ${INVOICE_DATE} authorized-dealer invoice. The claims desk must interpret the policy.`;

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
        text: 'Review the close-up and any known circumstances of the tear. The claims desk and support manager decide whether the claim qualifies; do not communicate a preliminary screen as approval.',
        sources: ['/records/hs-214-claims.md', '/policies/parts-warranty.md'],
      },
    ],
  };
};
