import { readFile } from 'node:fs/promises';

/**
 * Loads the canonical vendor-reviewer instructions from the source tree.
 * @returns The model-facing instructions.
 * @throws
 * - The canonical instruction file cannot be read.
 */
export const loadVendorReviewerInstruction = (): Promise<string> =>
  readFile(new URL('../../moldea/agents/vendor-reviewer/instruction.md', import.meta.url), 'utf8');
