import { queueRecommenderAgent } from './agent.js';
import {
  CustomerRequestSchema,
  QueueRecommendationSchema,
  type IQueueRecommendation,
} from './contracts.js';

/**
 * Recommends a queue for staff review without taking any ticket or account action.
 * @param customerRequest The customer's request to classify.
 * @returns A promise resolving to the recommendation and its supporting request evidence.
 */
export const recommendQueue = async (customerRequest: string): Promise<IQueueRecommendation> => {
  const request = CustomerRequestSchema.parse(customerRequest);
  const result = await queueRecommenderAgent.invoke({
    messages: [{ role: 'user', content: request }],
  });

  return QueueRecommendationSchema.parse(result.structuredResponse);
};
