import fn101Record from '../../../records/fn-101.md?raw';
import fn102Record from '../../../records/fn-102.md?raw';
import ingestLagNote from '../../../notes/ingest-lag.md?raw';
import schemaRolloutNote from '../../../notes/schema-rollout.md?raw';

import type { ILookupNotesInput } from './contracts.js';

// shared source used by case and note-only lookups
const INGEST_LAG_SOURCE = {
  path: 'notes/ingest-lag.md',
  kind: 'note',
  content: ingestLagNote,
} as const;

// each case selects only the checked-in sources relevant to its question
const CASE_SOURCES = {
  'FN-101': [
    { path: 'records/fn-101.md', kind: 'record', content: fn101Record },
    INGEST_LAG_SOURCE,
    { path: 'notes/schema-rollout.md', kind: 'note', content: schemaRolloutNote },
  ],
  'FN-102': [
    { path: 'records/fn-102.md', kind: 'record', content: fn102Record },
    { path: 'notes/schema-rollout.md', kind: 'note', content: schemaRolloutNote },
  ],
} as const;

/** Returns curated checked-in sources for a supported case or known note query. */
export const lookupNotes = (input: ILookupNotesInput) => {
  if ('caseId' in input) {
    return { caseId: input.caseId, sources: CASE_SOURCES[input.caseId] };
  }

  const isIngestLagQuery =
    /\bedge-(?:events|ingest)\b/i.test(input.query) && /\blag\b/i.test(input.query);

  return {
    query: input.query,
    sources: isIngestLagQuery ? [INGEST_LAG_SOURCE] : [],
  };
};
