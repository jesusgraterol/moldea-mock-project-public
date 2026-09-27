import { assertReviewedSource } from '../desk-review/index.ts';

import type { IEquipmentSupportInvocation, IEquipmentSupportReview } from './types.ts';

const REVIEWED_SHA256 = {
  instructions: '2936df22e656488981ccac686489f93d856c1df90dc7c78e2854d526e5edef42',
  caseSource: 'f632cb1f8980dece14aa5afda27ea744c69f0691470c0a47bb8b146b281cc70f',
  productSource: '96b982d1904ac48a74f732f1f51fb952b4787d1ac5c21eb5a0e98639084c27aa',
} as const;

/**
 * Produces a fixed equipment review only for the reviewed source snapshots.
 * @param invocation The equipment instruction and equipment-owned sources.
 * @returns Staff-only fit and symptom findings with source attribution.
 * @throws
 * - An HS-214 preview input changed and must be reviewed.
 */
export const previewEquipmentSupport = async (
  invocation: IEquipmentSupportInvocation,
): Promise<IEquipmentSupportReview> => {
  assertReviewedSource(
    { path: '/moldea/agents/equipment-support/instruction.md', markdown: invocation.instructions },
    '/moldea/agents/equipment-support/instruction.md',
    REVIEWED_SHA256.instructions,
  );
  assertReviewedSource(invocation.caseSource, '/records/hs-214.md', REVIEWED_SHA256.caseSource);
  assertReviewedSource(
    invocation.productSource,
    '/catalog/hc-240.md',
    REVIEWED_SHA256.productSource,
  );

  return {
    audience: 'staff-only',
    desk: 'equipment-support',
    dealerSafeFacts: { doorRevision: 'Rev B', tearLocation: 'near the lower corner' },
    findings: [
      {
        text: 'The clear gasket-channel photo identifies the fitted door as Rev B. The HC-240 sheet maps that channel to GS-240-B; staff confirm the part before recommending it.',
        sources: ['/records/hs-214.md', '/catalog/hc-240.md'],
      },
      {
        text: 'A tear near the lower corner and door-edge moisture are reported. Moisture appearing after cleaning is timing, not an established cause of the tear or moisture.',
        sources: ['/records/hs-214.md', '/catalog/hc-240.md'],
      },
    ],
    openQuestions: [
      {
        text: 'Request a measured cabinet temperature, door-closure information, a close-up of the tear, and any known circumstances of its appearance.',
        sources: ['/records/hs-214.md', '/catalog/hc-240.md'],
      },
      {
        text: 'If the cabinet is not holding a safe temperature, staff apply their food-safety and equipment-escalation procedures; do not issue unreviewed safety advice.',
        sources: ['/catalog/hc-240.md'],
      },
    ],
  };
};
