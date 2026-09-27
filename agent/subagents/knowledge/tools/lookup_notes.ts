import { defineTool } from 'eve/tools';

import { LookupNotesInputSchema } from '../contracts.js';
import { lookupCaseSources } from '../source-catalog.js';

export default defineTool({
  description: 'Return the reviewed checked-in record and operational notes for FN-101 or FN-102.',
  inputSchema: LookupNotesInputSchema,
  execute: lookupCaseSources,
});
