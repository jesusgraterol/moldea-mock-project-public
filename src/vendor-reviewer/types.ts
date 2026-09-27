import { z } from 'zod';

// structured claims identify the numeric rule without interpreting vendor prose
const SubmittedClaimSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('numeric-recycled-content'),
    quantity: z.number().finite(),
    unit: z.string().trim().min(1),
    material: z.string().trim().min(1),
  }),
  z.strictObject({
    kind: z.literal('other'),
    description: z.string().trim().min(1),
  }),
]);

// provenance describes the document source, not whether its claim is true
const EvidenceKindSchema = z.enum(['recycled-content-verification', 'other']);

// caller-provided facts distinguish absent evidence from received evidence
export const SupplierPacketSchema = z.strictObject({
  packetId: z.string().trim().min(1),
  supplierName: z.string().trim().min(1),
  category: z.string().trim().min(1),
  reviewDate: z.iso.date(),
  submittedClaims: z.array(SubmittedClaimSchema),
  evidence: z.array(
    z.discriminatedUnion('status', [
      z.strictObject({
        name: z.string().trim().min(1),
        status: z.literal('missing'),
        kind: EvidenceKindSchema,
      }),
      z.strictObject({
        name: z.string().trim().min(1),
        status: z.literal('received'),
        kind: EvidenceKindSchema,
        provenance: z.enum(['independent', 'vendor', 'unknown']),
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
  | { kind: 'missing-independent-recycled-content-verification'; evidenceName: string }
  | { kind: 'expired'; evidenceName: string; validThrough: string }
  | { kind: 'unsigned'; evidenceName: string };

// a null draft means no listed evidence gap calls for a supplier follow-up
export type IReviewResult = {
  packetId: string;
  gaps: IEvidenceGap[];
  draftFollowUp: string | null;
  claimVerification: 'not-assessed';
};
