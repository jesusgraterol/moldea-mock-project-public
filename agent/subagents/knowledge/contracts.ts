import { z } from 'zod';

// case lookups and note searches have distinct source-selection rules
export const LookupNotesInputSchema = z.union([
  z.strictObject({ caseId: z.enum(['FN-101', 'FN-102']) }),
  z.strictObject({
    query: z.string().trim().min(1).meta({ description: 'A note question with no case ID.' }),
  }),
]);

export type ILookupNotesInput = z.infer<typeof LookupNotesInputSchema>;
