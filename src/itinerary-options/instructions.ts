import { readFileSync } from 'node:fs';

/**
 * Reads the canonical itinerary-options instruction from the repository.
 * @returns The instruction text supplied to the agent.
 */
export const loadItineraryOptionsInstruction = (): string =>
  readFileSync(
    new URL('../../moldea/agents/itinerary-options/instruction.md', import.meta.url),
    'utf8',
  );
