import { readFile } from 'node:fs/promises';

import type { IFulfillmentReviewAgent, IFulfillmentReviewInvoker } from './types.ts';

const INSTRUCTION_URL = new URL(
  '../../moldea/agents/fulfillment-review/instruction.md',
  import.meta.url,
);
const FULFILLMENT_URL = new URL('../../records/hs-214-fulfillment.md', import.meta.url);

/**
 * Loads the canonical fulfillment instruction on each invocation.
 * @returns The current fulfillment-review instruction.
 * @throws
 * - An HS-214 fulfillment input is empty.
 */
export const loadFulfillmentReviewInstruction = async (): Promise<string> => {
  const instructions = await readFile(INSTRUCTION_URL, 'utf8');

  if (!instructions.trim()) {
    throw new Error('An HS-214 fulfillment input is empty.');
  }

  return instructions;
};

/**
 * Creates the fulfillment desk's source-restricted invocation boundary.
 * @param invoker The fulfillment reviewer, currently a deterministic preview.
 * @returns A fulfillment agent without reservation or shipping capability.
 */
export const createFulfillmentReviewAgent = (
  invoker: IFulfillmentReviewInvoker,
): IFulfillmentReviewAgent => ({
  invoke: async () => {
    const [instructions, fulfillmentMarkdown] = await Promise.all([
      loadFulfillmentReviewInstruction(),
      readFile(FULFILLMENT_URL, 'utf8'),
    ]);

    if (!fulfillmentMarkdown.trim()) {
      throw new Error('An HS-214 fulfillment input is empty.');
    }

    return invoker({
      instructions,
      fulfillmentSource: {
        path: '/records/hs-214-fulfillment.md',
        markdown: fulfillmentMarkdown,
      },
    });
  },
});
