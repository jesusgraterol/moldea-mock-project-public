import { SystemMessage } from '@langchain/core/messages';
import { createAgent } from 'langchain';

import { QueueRecommendationSchema } from './contracts.js';
import { loadQueueRecommenderInstruction } from './instructions.js';

export const queueRecommenderAgent = createAgent({
  model: 'openai:gpt-4o',
  name: 'queue-recommender',
  tools: [],
  systemPrompt: new SystemMessage(loadQueueRecommenderInstruction()),
  responseFormat: QueueRecommendationSchema,
});
