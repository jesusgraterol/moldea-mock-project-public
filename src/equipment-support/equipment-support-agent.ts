import { readFile } from 'node:fs/promises';

import type { IEquipmentSupportAgent, IEquipmentSupportInvoker } from './types.ts';

const INSTRUCTION_URL = new URL('../../moldea/agents/equipment-support/instruction.md', import.meta.url);
const CASE_URL = new URL('../../records/hs-214.md', import.meta.url);
const PRODUCT_URL = new URL('../../catalog/hc-240.md', import.meta.url);

/**
 * Loads the canonical equipment instruction on each invocation.
 * @returns The current equipment-support instruction.
 * @throws
 * - An HS-214 equipment input is empty.
 */
export const loadEquipmentSupportInstruction = async (): Promise<string> => {
  const instructions = await readFile(INSTRUCTION_URL, 'utf8');

  if (!instructions.trim()) {
    throw new Error('An HS-214 equipment input is empty.');
  }

  return instructions;
};

/**
 * Creates the equipment desk's source-restricted invocation boundary.
 * @param invoker The desk reviewer, currently a deterministic preview.
 * @returns An equipment-support agent without provider or send capability.
 */
export const createEquipmentSupportAgent = (
  invoker: IEquipmentSupportInvoker,
): IEquipmentSupportAgent => ({
  invoke: async () => {
    const [instructions, caseMarkdown, productMarkdown] = await Promise.all([
      loadEquipmentSupportInstruction(),
      readFile(CASE_URL, 'utf8'),
      readFile(PRODUCT_URL, 'utf8'),
    ]);

    if (!caseMarkdown.trim() || !productMarkdown.trim()) {
      throw new Error('An HS-214 equipment input is empty.');
    }

    return invoker({
      instructions,
      caseSource: { path: '/records/hs-214.md', markdown: caseMarkdown },
      productSource: { path: '/catalog/hc-240.md', markdown: productMarkdown },
    });
  },
});
