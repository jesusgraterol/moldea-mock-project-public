import { defineInstructions } from 'eve/instructions';
import canonicalInstruction from '../moldea/agents/quarry-handover/instruction.md?raw';

export function loadHandoverInstructions(): string {
  return canonicalInstruction;
}

export default defineInstructions({ content: loadHandoverInstructions() });
