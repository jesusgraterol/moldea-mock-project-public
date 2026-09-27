import { z } from 'zod';

// only the checked-in FN-101 source set is supported
export const FindNotesInputSchema = z.strictObject({
  caseId: z.literal('FN-101'),
});

export type IFindNotesInput = z.infer<typeof FindNotesInputSchema>;
