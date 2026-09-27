import { createHash } from 'node:crypto';

import type { IDealerReplyInvocation, IDealerReplyResult } from './types.ts';

// reviewed snapshots keep this fixed HS-214 wording from surviving source changes
const REVIEWED_SHA256 = {
  instructions: '74f0e2bc65b2a1f7abb45d72ec8b5e677950fa739e34f79df33f39809ef7ea84',
  caseSource: 'dc0877c55cad6339c57dd074ecf7d61dfa2ef4e4f528f73f4373d3bece319a3a',
  productSource: '96b982d1904ac48a74f732f1f51fb952b4787d1ac5c21eb5a0e98639084c27aa',
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

  return {
    mode: 'deterministic-preview',
    dealerDraft: [
      'Hello Ridgeway Foodservice,',
      '',
      'Thanks for sending the HC-240 details. The model and serial number do not confirm which door assembly is fitted, because a door may have been replaced. Could you send a clear photo of the door label or gasket channel? Our team needs to confirm the revision before recommending a gasket.',
      '',
      'You mentioned that moisture appeared around the door edge after cleaning. That timing alone does not establish the cause. Could you also share a measured cabinet temperature and let us know whether the door closes fully?',
      '',
      'Once we have that information, our team can review the next steps.',
    ].join('\n'),
    verificationNotes: [
      'The case photo shows HC-240 and a serial number, but the door revision is unreadable. Confirm the fitted revision from a clear door-label or gasket-channel photo before recommending a kit.',
      'The product sheet maps Rev A to GS-240-A and Rev B to GS-240-B. Keep both part numbers out of dealer-facing text until staff confirms the fitted revision and part.',
      'The dealer has not supplied a measured cabinet temperature. If the cabinet is failing to hold a safe temperature, staff should follow their own food-safety and equipment-escalation procedures; this preview gives no safety or repair advice.',
      'Moisture appearing after cleaning is reported timing, not an established cause. Do not diagnose a gasket fault from that report.',
      'Staff must approve the reply before sending it. Warranty and shipping decisions are outside this HS-214 draft.',
    ],
  };
};
