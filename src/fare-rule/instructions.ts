import { readFileSync } from 'node:fs';

/**
 * Reads the canonical fare-rule instruction from the repository.
 * @returns The instruction text supplied to the specialist.
 */
export const loadFareRuleInstruction = (): string =>
  readFileSync(new URL('../../moldea/agents/fare-rule/instruction.md', import.meta.url), 'utf8');
