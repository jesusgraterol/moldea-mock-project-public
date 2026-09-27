import { z } from 'zod';

// cases with reviewed, checked-in source sets
export const LookupNotesInputSchema = z.strictObject({
  caseId: z.enum(['FN-101', 'FN-102']),
});

export type ILookupNotesInput = z.infer<typeof LookupNotesInputSchema>;
