import { z } from 'zod';

export const AccessionRecordSchema = z.strictObject({
  id: z.string().min(1), description: z.string().min(1),
  maker: z.string().min(1).nullable(), date: z.string().min(1).nullable(),
  provenance: z.string().min(1).nullable(),
});

export const AccessionNoteSchema = z.strictObject({
  accessionId: z.string().min(1), draftNote: z.string().min(1),
  missingFields: z.array(z.enum(['maker', 'date', 'provenance'])),
  approvalAuthority: z.literal('collections-lead'), humanApprovalRequired: z.literal(true),
});

export type AccessionNote = z.infer<typeof AccessionNoteSchema>;
