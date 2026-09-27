import { readFile } from 'node:fs/promises';
import { run } from '@openai/agents';

import { itineraryOptionsAgent } from './itinerary-options.agent.js';

/**
 * Invokes the policy handoff for TC-202 without asserting a carrier-cancellation rule.
 * @returns The SDK result, including any handoff to the fare-rule specialist.
 */
export const runTc202CarrierCancellationQuestion = async () => {
  const [caseRecord, voluntaryChangeRule] = await Promise.all([
    readFile(new URL('../../records/tc-202.md', import.meta.url), 'utf8'),
    readFile(new URL('../../records/basic-fare-rule.md', import.meta.url), 'utf8'),
  ]);
  const request = `For TC-202, does the supplied local rule establish whether the $30 Basic change fee is waived after AeroLink cancelled AL-210? Hand off this policy question and explain only what the sources establish.

Case record:
${caseRecord}

Local voluntary-change rule:
${voluntaryChangeRule}`;

  return run(itineraryOptionsAgent, request);
};
