import { readFile } from 'node:fs/promises';

/**
 * Loads the canonical release-note drafting instruction.
 * @returns A promise resolving to the current instruction text.
 */
export const loadReleaseNoteInstruction = (): Promise<string> =>
  readFile(new URL('../../moldea/agents/release-note-drafter/instruction.md', import.meta.url), 'utf8');
