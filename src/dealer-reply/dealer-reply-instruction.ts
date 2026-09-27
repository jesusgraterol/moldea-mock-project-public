import { readFile } from 'node:fs/promises';

const INSTRUCTION_URL = new URL('../../moldea/agents/dealer-reply/instruction.md', import.meta.url);

/**
 * Loads the canonical dealer-reply instruction for each invocation.
 * @returns The current model-facing instruction text.
 * @throws
 * - The dealer-reply instruction is empty.
 */
export const loadDealerReplyInstruction = async (): Promise<string> => {
  const instructions = await readFile(INSTRUCTION_URL, 'utf8');

  if (!instructions.trim()) {
    throw new Error('The dealer-reply instruction is empty.');
  }

  return instructions;
};
