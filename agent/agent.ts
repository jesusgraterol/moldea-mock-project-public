import { defineAgent } from 'eve';
import { fixtureModel } from '../evals/fixture-model.ts';

// This fictional local assistant deliberately has no live provider configured.
export const rootAssistant = defineAgent({
  model: fixtureModel,
  defaultTools: false,
  tool: false,
});

export default rootAssistant;
