import fn101Record from '../../../records/fn-101.md?raw';
import fn102Record from '../../../records/fn-102.md?raw';
import ingestLagNote from '../../../notes/ingest-lag.md?raw';
import schemaRolloutNote from '../../../notes/schema-rollout.md?raw';

import type { ILookupNotesInput } from './contracts.js';

// each case selects only the checked-in sources relevant to its question
const CASE_SOURCES = {
  'FN-101': [
    { path: 'records/fn-101.md', kind: 'record', content: fn101Record },
    { path: 'notes/ingest-lag.md', kind: 'note', content: ingestLagNote },
    { path: 'notes/schema-rollout.md', kind: 'note', content: schemaRolloutNote },
  ],
  'FN-102': [
    { path: 'records/fn-102.md', kind: 'record', content: fn102Record },
    { path: 'notes/schema-rollout.md', kind: 'note', content: schemaRolloutNote },
  ],
} as const;

/** Returns the curated checked-in source set for one supported case. */
export const lookupCaseSources = ({ caseId }: ILookupNotesInput) => ({
  caseId,
  sources: CASE_SOURCES[caseId],
});
