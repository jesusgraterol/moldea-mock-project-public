import { createHash } from 'node:crypto';

import { screenWarrantyReportingWindow } from './dealer-reply-warranty.ts';
import type { IDealerReplyInvocation, IDealerReplyResult } from './types.ts';

// reviewed snapshots keep this fixed HS-214 wording from surviving source changes
const REVIEWED_SHA256 = {
  instructions: '300d56ff0388e5dceca9c93ab553bd5864cac0e476c369e4d9c5f191a6a46248',
  caseSource: '44c17bbbc689b23bd1a24ba010b7890972ebf7a3312c7e902651a072c4c70f35',
  productSource: '96b982d1904ac48a74f732f1f51fb952b4787d1ac5c21eb5a0e98639084c27aa',
  warrantySource: 'b47044781a9b72333f4d12a71d108893a8c6d19d747fe53f8802d479ed465b7a',
} as const;

// typed facts are a reviewed extraction of the hash-bound case and policy sources
const REVIEWED_FACTS = {
  invoiceDate: '2026-01-12',
  reportDate: '2026-09-27',
  stockSnapshotDate: '2026-09-26',
  stockDepot: 'East',
  stockKits: 4,
  reservedForCase: 0,
  routeBusinessDaysMinimum: 3,
  routeBusinessDaysMaximum: 5,
} as const;

const assertReviewed = (text: string, expectedHash: string): void => {
  const actualHash = createHash('sha256').update(text).digest('hex');

  if (actualHash !== expectedHash) {
    throw new Error('An HS-214 preview input changed and must be reviewed.');
  }
};

/**
 * Returns a reviewed, case-specific preview rather than invoking a model.
 * @param invocation The loaded canonical instruction and checked-in sources.
 * @returns A dealer draft and separate staff verification notes.
 * @throws
 * - An HS-214 preview input changed and must be reviewed.
 */
export const previewDealerReply = async (
  invocation: IDealerReplyInvocation,
): Promise<IDealerReplyResult> => {
  assertReviewed(invocation.instructions, REVIEWED_SHA256.instructions);
  assertReviewed(invocation.caseSource.markdown, REVIEWED_SHA256.caseSource);
  assertReviewed(invocation.productSource.markdown, REVIEWED_SHA256.productSource);
  assertReviewed(invocation.warrantySource.markdown, REVIEWED_SHA256.warrantySource);

  const reportingWindow = screenWarrantyReportingWindow(
    REVIEWED_FACTS.invoiceDate,
    REVIEWED_FACTS.reportDate,
  );
  const reportingWindowNote =
    reportingWindow === 'within-period'
      ? `The authorized-dealer invoice is dated ${REVIEWED_FACTS.invoiceDate}, and the ${REVIEWED_FACTS.reportDate} report is within the 12-month reporting period. This time screen is not claim approval.`
      : reportingWindow === 'outside-period'
        ? `The ${REVIEWED_FACTS.reportDate} report appears outside the 12-month period from the ${REVIEWED_FACTS.invoiceDate} invoice. Staff must verify the dates and policy before deciding the claim.`
        : `The ${REVIEWED_FACTS.reportDate} report is at an unsettled calendar boundary from the ${REVIEWED_FACTS.invoiceDate} invoice. Staff must interpret the policy before deciding the claim.`;

  return {
    mode: 'deterministic-preview',
    dealerDraft: [
      'Hello Ridgeway Foodservice,',
      '',
      'Thanks for sending the clearer HC-240 door-channel photo. It identifies a Rev B door channel, and you have reported a tear near the lower corner of the gasket. Our team will confirm the appropriate replacement part before advising you.',
      '',
      'You mentioned that moisture appeared around the door edge after cleaning. That timing alone does not establish the cause. Could you share a measured cabinet temperature, let us know whether the door closes fully, and send a close-up photo of the torn area? If you know when the tear first appeared or observed what happened before it, please include that context.',
      '',
      'We will review those details and follow up.',
    ].join('\n'),
    verificationNotes: {
      fit: [
        'The clear gasket-channel photo identifies the fitted door as Rev B; the product sheet maps Rev B to GS-240-B. Staff confirm the part before a dealer recommendation.',
      ],
      symptomFollowUp: [
        'The gasket has a tear near the lower corner. Moisture after cleaning is reported timing, not evidence of what caused the tear or moisture.',
        'Request a measured cabinet temperature, door-closure information, a close-up of the tear, and any known circumstances of its appearance. Staff follow their own food-safety and equipment-escalation procedures if the cabinet is not holding a safe temperature.',
      ],
      warrantyScreening: [
        reportingWindowNote,
        'The warranty covers manufacturing defects, and documented cleaning damage is excluded. Neither cause is established here. Staff decide whether the claim qualifies; keep this screening out of the dealer draft.',
      ],
      shipmentQuestions: [
        `The ${REVIEWED_FACTS.stockSnapshotDate} snapshot listed ${REVIEWED_FACTS.stockKits} GS-240-B kits at the ${REVIEWED_FACTS.stockDepot} depot, with ${REVIEWED_FACTS.reservedForCase} reserved for HS-214. Confirm current availability and whether a kit can be reserved.`,
        `The normal route is roughly ${REVIEWED_FACTS.routeBusinessDaysMinimum} to ${REVIEWED_FACTS.routeBusinessDaysMaximum} business days after dispatch. Confirm destination, dispatch, and timing before making a commitment; the snapshot is not a delivery promise.`,
      ],
      staffApproval: [
        'Staff confirm the part, warranty outcome, current stock and timing, and any safety advice, then approve the dealer response before sending it. This preview has no send path.',
      ],
    },
  };
};
