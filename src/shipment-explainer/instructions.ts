import { readFile } from 'node:fs/promises';

/**
 * Loads the canonical shipment-explainer instruction from the source tree.
 * @returns The instruction text for a Responses request.
 */
export const loadShipmentExplainerInstruction = async (): Promise<string> =>
  readFile(new URL('../../moldea/agents/shipment-explainer/instruction.md', import.meta.url), 'utf8');
