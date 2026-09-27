import { readFile } from 'node:fs/promises';

import type { IClaimsReviewAgent, IClaimsReviewInvoker } from './types.ts';

const INSTRUCTION_URL = new URL('../../moldea/agents/claims-review/instruction.md', import.meta.url);
const CLAIM_URL = new URL('../../records/hs-214-claims.md', import.meta.url);
const POLICY_URL = new URL('../../policies/parts-warranty.md', import.meta.url);

/**
 * Loads the canonical claims instruction on each invocation.
 * @returns The current claims-review instruction.
 * @throws
 * - An HS-214 claims input is empty.
 */
export const loadClaimsReviewInstruction = async (): Promise<string> => {
  const instructions = await readFile(INSTRUCTION_URL, 'utf8');

  if (!instructions.trim()) {
    throw new Error('An HS-214 claims input is empty.');
  }

  return instructions;
};

/**
 * Creates the claims desk's source-restricted invocation boundary.
 * @param invoker The claims reviewer, currently a deterministic preview.
 * @returns A claims agent without claim-approval authority.
 */
export const createClaimsReviewAgent = (invoker: IClaimsReviewInvoker): IClaimsReviewAgent => ({
  invoke: async () => {
    const [instructions, claimMarkdown, policyMarkdown] = await Promise.all([
      loadClaimsReviewInstruction(),
      readFile(CLAIM_URL, 'utf8'),
      readFile(POLICY_URL, 'utf8'),
    ]);

    if (!claimMarkdown.trim() || !policyMarkdown.trim()) {
      throw new Error('An HS-214 claims input is empty.');
    }

    return invoker({
      instructions,
      claimSource: { path: '/records/hs-214-claims.md', markdown: claimMarkdown },
      policySource: { path: '/policies/parts-warranty.md', markdown: policyMarkdown },
    });
  },
});
