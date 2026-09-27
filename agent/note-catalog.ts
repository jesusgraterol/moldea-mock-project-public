import fn101Record from '../records/fn-101.md?raw';
import ingestLagNote from '../notes/ingest-lag.md?raw';
import schemaRolloutNote from '../notes/schema-rollout.md?raw';

import type { IFindNotesInput } from './contracts.js';

// embed only the reviewed, checked-in FN-101 sources in the compiled agent
const FN_101_SOURCES = [
  { path: 'records/fn-101.md', kind: 'case', content: fn101Record },
  { path: 'notes/ingest-lag.md', kind: 'note', content: ingestLagNote },
  { path: 'notes/schema-rollout.md', kind: 'note', content: schemaRolloutNote },
] as const;

/** Returns the FN-101 record and relevant operational notes without accessing live systems. */
export const getFn101Sources = ({ caseId }: IFindNotesInput) => ({
  caseId,
  sources: FN_101_SOURCES,
});
