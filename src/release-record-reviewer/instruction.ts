import { readFileSync } from 'node:fs';

/** Loads the canonical held-record review instruction for the SDK subagent. */
export const loadReleaseRecordReviewInstruction = (): string =>
  readFileSync(
    new URL('../../moldea/agents/release-record-reviewer/instruction.md', import.meta.url),
    'utf8',
  );
