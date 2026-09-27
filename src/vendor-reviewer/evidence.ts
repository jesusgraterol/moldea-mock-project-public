import type { IEvidenceGap, ISupplierPacket } from './types.js';

/**
 * Identifies gaps in the expected evidence explicitly listed by the caller.
 * @param packet A validated supplier packet.
 * @returns Missing, expired, and unsigned evidence findings.
 */
export const identifyEvidenceGaps = (packet: ISupplierPacket): IEvidenceGap[] => {
  const gaps: IEvidenceGap[] = [];

  for (const evidence of packet.evidence) {
    if (evidence.status === 'missing') {
      gaps.push({ kind: 'missing', evidenceName: evidence.name });
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

  return gaps;
};
