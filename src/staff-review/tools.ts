import { tool } from 'ai';

import { lookupRoutingNote } from './routing-policy.js';
import { LookupRoutingNoteInputSchema, StaffRoutingNoteSchema } from './types.js';

// the only staff-facing custom tool; it has no write or external integration
export const lookupRoutingNoteTool = tool({
  description:
    'Look up fictional case MH-205 or MH-206 and apply the local read-only queue policy. Use before recommending a staff review queue or preparing a routing note. No customer remedy is decided or performed.',
  inputSchema: LookupRoutingNoteInputSchema,
  outputSchema: StaffRoutingNoteSchema,
  execute: lookupRoutingNote,
});
