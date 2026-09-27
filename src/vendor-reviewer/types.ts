import { z } from 'zod';

// caller-provided facts distinguish absent evidence from received evidence
export const SupplierPacketSchema = z.strictObject({
  packetId: z.string().trim().min(1),
  supplierName: z.string().trim().min(1),
  category: z.string().trim().min(1),
  reviewDate: z.iso.date(),
  submittedClaims: z.array(z.string().trim().min(1)),
  evidence: z.array(
    z.discriminatedUnion('status', [
      z.strictObject({
        name: z.string().trim().min(1),
        status: z.literal('missing'),
      }),
      z.strictObject({
        name: z.string().trim().min(1),
        status: z.literal('received'),
        validThrough: z.iso.date().optional(),
        signatureStatus: z.enum(['signed', 'unsigned', 'unknown', 'not-applicable']),
      }),
    ]),
  ),
});

export type ISupplierPacket = z.infer<typeof SupplierPacketSchema>;

// gaps describe only conditions established by the supplied evidence facts
export type IEvidenceGap =
  | { kind: 'missing'; evidenceName: string }
  | { kind: 'expired'; evidenceName: string; validThrough: string }
  | { kind: 'unsigned'; evidenceName: string };

// a null draft means no listed evidence gap calls for a supplier follow-up
export type IReviewResult = {
  packetId: string;
  gaps: IEvidenceGap[];
  draftFollowUp: string | null;
};
