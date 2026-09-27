import type { IEvidenceGap, ISupplierPacket } from './types.js';

/**
 * Identifies gaps in the expected evidence explicitly listed by the caller.
 * @param packet A validated supplier packet.
 * @returns Missing, expired, and unsigned evidence findings, including unmet independent verification.
 */
export const identifyEvidenceGaps = (packet: ISupplierPacket): IEvidenceGap[] => {
  const gaps: IEvidenceGap[] = [];
  const hasNumericRecycledContentClaim = packet.submittedClaims.some(
    (claim) => claim.kind === 'numeric-recycled-content',
  );
  const hasIndependentVerification = packet.evidence.some(
    (evidence) =>
      evidence.status === 'received' &&
      evidence.kind === 'recycled-content-verification' &&
      evidence.provenance === 'independent',
  );
  const needsIndependentVerification =
    hasNumericRecycledContentClaim && !hasIndependentVerification;
  let hasIndependentVerificationGap = false;

  for (const evidence of packet.evidence) {
    if (evidence.status === 'missing') {
      if (needsIndependentVerification && evidence.kind === 'recycled-content-verification') {
        if (!hasIndependentVerificationGap) {
          gaps.push({
            kind: 'missing-independent-recycled-content-verification',
            evidenceName: 'Independent recycled-content verification document',
          });
          hasIndependentVerificationGap = true;
        }
      } else {
        gaps.push({ kind: 'missing', evidenceName: evidence.name });
      }
      continue;
    }

    // valid-through dates remain valid on that date
    if (evidence.validThrough && evidence.validThrough < packet.reviewDate) {
      gaps.push({
        kind: 'expired',
        evidenceName: evidence.name,
        validThrough: evidence.validThrough,
      });
    }

    if (evidence.signatureStatus === 'unsigned') {
      gaps.push({ kind: 'unsigned', evidenceName: evidence.name });
    }
  }

  if (needsIndependentVerification && !hasIndependentVerificationGap) {
    gaps.push({
      kind: 'missing-independent-recycled-content-verification',
      evidenceName: 'Independent recycled-content verification document',
    });
  }

  return gaps;
};
