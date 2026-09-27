import type Anthropic from '@anthropic-ai/sdk';

import { identifyEvidenceGaps } from './evidence.js';
import { loadVendorReviewerInstruction } from './instructions.js';
import { SupplierPacketSchema, type IReviewResult } from './types.js';

const MAX_OUTPUT_TOKENS = 1024;

/**
 * Finds gaps in caller-supplied packet facts and asks Anthropic for a buyer-editable follow-up.
 * The caller supplies the client and model; this module does not configure credentials or send drafts.
 * @param client An Anthropic client supplied by the caller.
 * @param model The caller-selected Anthropic model identifier.
 * @param packetFacts The expected evidence and other facts for one supplier packet.
 * @returns The identified gaps and a draft, or null when no listed gap needs follow-up.
 * @throws
 * - Invalid supplier packet facts.
 * - An Anthropic model identifier is required.
 * - The canonical instructions cannot be read or the Anthropic request fails.
 * - Anthropic did not complete the supplier follow-up draft.
 * - Anthropic returned no text for the supplier follow-up draft.
 */
export const reviewSupplierPacket = async (
  client: Anthropic,
  model: string,
  packetFacts: unknown,
): Promise<IReviewResult> => {
  const packet = SupplierPacketSchema.parse(packetFacts);
  const gaps = identifyEvidenceGaps(packet);

  if (gaps.length === 0) {
    return { packetId: packet.packetId, gaps, draftFollowUp: null, claimVerification: 'not-assessed' };
  }

  const modelId = model.trim();
  if (!modelId) {
    throw new Error('An Anthropic model identifier is required.');
  }

  const message = await client.messages.create({
    model: modelId,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: await loadVendorReviewerInstruction(),
    messages: [
      {
        role: 'user',
        content: JSON.stringify({
          packetId: packet.packetId,
          supplierName: packet.supplierName,
          category: packet.category,
          submittedClaims: packet.submittedClaims,
          evidenceGaps: gaps,
        }),
      },
    ],
  });

  if (message.stop_reason !== 'end_turn') {
    throw new Error('Anthropic did not complete the supplier follow-up draft.');
  }

  const draftFollowUp = message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();

  if (!draftFollowUp) {
    throw new Error('Anthropic returned no text for the supplier follow-up draft.');
  }

  return { packetId: packet.packetId, gaps, draftFollowUp, claimVerification: 'not-assessed' };
};
