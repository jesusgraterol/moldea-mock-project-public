import { readFileSync } from 'node:fs';

import { stepCountIs, ToolLoopAgent } from 'ai';

import { lookupBagsTool } from './catalog.js';

/** Loads the sole durable model instruction from the moldea-owned file. */
export const loadStoreGuideInstruction = (): string =>
  readFileSync(new URL('../../moldea/agents/store-guide/instruction.md', import.meta.url), 'utf8');

// the first step must consult the catalog; the second can only answer
export const storeGuideAgent = new ToolLoopAgent({
  model: 'openai/gpt-5.4',
  instructions: loadStoreGuideInstruction(),
  tools: { lookup_bags: lookupBagsTool },
  prepareStep: ({ stepNumber }) => ({
    toolChoice: stepNumber === 0 ? { type: 'tool', toolName: 'lookup_bags' } : 'none',
  }),
  stopWhen: stepCountIs(2),
});
