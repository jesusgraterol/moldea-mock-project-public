import { defineTool } from 'eve/tools';

import { FindNotesInputSchema } from '../contracts.js';
import { getFn101Sources } from '../note-catalog.js';

export default defineTool({
  description: 'Read the checked-in FN-101 case record and relevant operational notes. No live access.',
  inputSchema: FindNotesInputSchema,
  execute: getFn101Sources,
});
