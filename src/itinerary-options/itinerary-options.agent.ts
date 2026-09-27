import { Agent } from '@openai/agents';

import { fareRuleAgent } from '../fare-rule/index.js';

import { loadItineraryOptionsInstruction } from './instructions.js';

// the canonical instruction is loaded before any SDK run is requested
export const itineraryOptionsAgent = new Agent({
  name: 'itinerary-options',
  instructions: loadItineraryOptionsInstruction(),
  handoffs: [fareRuleAgent],
});
