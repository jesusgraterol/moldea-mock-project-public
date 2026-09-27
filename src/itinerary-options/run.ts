import { readFile } from 'node:fs/promises';
import { run } from '@openai/agents';

import { itineraryOptionsAgent } from './itinerary-options.agent.js';

/**
 * Invokes the SDK with the supplied TC-201 record when an application explicitly calls it.
 * @returns The SDK result for the supplied case record.
 */
export const runTc201 = async () => {
  const caseRecord = await readFile(new URL('../../records/tc-201.md', import.meta.url), 'utf8');
  const request = `Explain the two alternatives for the traveler's departure-after-09:30 request, including timing tradeoffs and fare-quote limitations.
Use this supplied case record only:

${caseRecord}`;

  return run(itineraryOptionsAgent, request);
};
