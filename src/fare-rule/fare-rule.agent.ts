import { Agent } from '@openai/agents';

import { loadFareRuleInstruction } from './instructions.js';

// routing text matches the canonical handoff description
export const fareRuleAgent = new Agent({
  name: 'fare-rule',
  instructions: loadFareRuleInstruction(),
  handoffDescription:
    'Answer Basic fare voluntary-change policy questions using the supplied local rule; do not decide or perform a change.',
});
