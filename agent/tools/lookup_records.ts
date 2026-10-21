import { defineTool } from 'eve/tools';
import { LookupInputSchema, LookupResultSchema } from '../../src/contracts.ts';
import { lookupRecords } from '../../src/records.ts';

export const lookupRecordsTool = defineTool({
  description: 'Read selected fictional local shift records and compute age-based supervisor-review flags using only the supplied timestamps. Returns missing IDs, unknown times and all unresolved same-scope claims. Never writes records or executes actions.',
  inputSchema: LookupInputSchema,
  outputSchema: LookupResultSchema,
  execute: lookupRecords,
});

export default lookupRecordsTool;
