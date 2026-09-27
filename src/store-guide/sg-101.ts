import { readFile } from 'node:fs/promises';

import { storeGuideAgent } from './store-guide.agent.js';

/** Invokes the source-only guide for the SG-101 shopper note when a host calls it. */
export const runSg101 = async (): Promise<string> => {
  const shopperNote = await readFile(new URL('../../records/sg-101.md', import.meta.url), 'utf8');
  const result = await storeGuideAgent.generate({ prompt: shopperNote });

  if (result.steps.some((step) => step.content.some((part) => part.type === 'tool-error'))) {
    throw new Error('The catalog lookup failed; no recommendation was returned.');
  }

  if (
    !result.steps.some((step) =>
      step.toolResults.some((toolResult) => toolResult.toolName === 'lookup_bags'),
    )
  ) {
    throw new Error('The catalog was not consulted; no recommendation was returned.');
  }

  if (result.text.trim() === '') {
    throw new Error('The Store Guide did not return a recommendation.');
  }

  return result.text;
};
