import { readFileSync } from 'node:fs';

/** Loads the canonical queue-recommender policy from this source checkout. */
export const loadQueueRecommenderInstruction = (): string =>
  readFileSync(
    new URL('../../moldea/agents/queue-recommender/instruction.md', import.meta.url),
    'utf8',
  );
