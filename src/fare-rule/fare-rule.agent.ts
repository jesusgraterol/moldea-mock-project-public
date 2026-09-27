import { Agent } from '@openai/agents';

import { loadFareRuleInstruction } from './instructions.js';

// routing text matches the canonical handoff description
export const fareRuleAgent = new Agent({
  name: 'fare-rule',
  instructions: loadFareRuleInstruction(),
  handoffDescription:
    'Handle Basic fare voluntary-change and carrier-cancellation fee questions without deciding or performing a change.',
});
