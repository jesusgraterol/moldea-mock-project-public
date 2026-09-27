import { defineTool } from 'eve/tools';

import { LookupNotesInputSchema } from '../contracts.js';
import { lookupNotes } from '../source-catalog.js';

export default defineTool({
  description:
    'Return curated checked-in sources for FN-101, FN-102, or an edge-events/edge-ingest lag note query.',
  inputSchema: LookupNotesInputSchema,
  execute: lookupNotes,
});
