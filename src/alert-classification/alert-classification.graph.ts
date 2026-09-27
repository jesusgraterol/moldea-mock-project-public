import { readFile } from 'node:fs/promises';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { END, START, StateGraph, StateSchema } from '@langchain/langgraph';
import { z } from 'zod';

import { normalizeSignal } from './transformers.js';
import {
  AlertBatchSchema,
  ClassificationRecommendationSchema,
  ClassificationResultSchema,
  NormalizedSignalSchema,
  type IAlertBatch,
  type IClassificationResult,
} from './types.js';

// graph state keeps the raw input and each meaningful stage result visible
const AlertClassificationState = new StateSchema({
  rawBatch: AlertBatchSchema,
  normalizedSignals: z.array(NormalizedSignalSchema).optional(),
  instructions: z.string().optional(),
  recommendation: ClassificationRecommendationSchema.optional(),
});

const normalizeAlerts: typeof AlertClassificationState.Node = (state) => ({
  normalizedSignals: state.rawBatch.events.map(normalizeSignal),
});

const loadInstructions: typeof AlertClassificationState.Node = async () => ({
  instructions: await readFile(
    new URL('./classification-instructions.md', import.meta.url),
    'utf8',
  ),
});

/**
 * Classifies a bounded alert batch with a caller-supplied structured-output chat model.
 * @param model A chat model that supports `withStructuredOutput` for the recommendation schema.
 * @param alertBatch The raw alerts and explicitly known context to review.
 * @returns The raw events, deterministic normalized signals, and model recommendation.
 */
export const classifyAlertBatch = async (
  model: BaseChatModel,
  alertBatch: IAlertBatch,
): Promise<IClassificationResult> => {
  const rawBatch = AlertBatchSchema.parse(alertBatch);

  const recommendClassification: typeof AlertClassificationState.Node = async (state) => {
    const instructions = z.string().min(1).parse(state.instructions);
    const normalizedSignals = z.array(NormalizedSignalSchema).min(1).parse(state.normalizedSignals);
    const structuredModel = model.withStructuredOutput(ClassificationRecommendationSchema);
    const recommendation = await structuredModel.invoke([
      new SystemMessage(instructions),
      new HumanMessage(
        JSON.stringify({
          batchId: state.rawBatch.batchId,
          capturedAt: state.rawBatch.capturedAt,
          observations: normalizedSignals,
          deploymentTimingContext: state.rawBatch.deployment ?? null,
          knownEvidenceGaps: state.rawBatch.knownEvidenceGaps,
        }),
      ),
    ]);

    return { recommendation: ClassificationRecommendationSchema.parse(recommendation) };
  };

  const graph = new StateGraph(AlertClassificationState)
    .addNode('normalizeAlerts', normalizeAlerts)
    .addNode('loadInstructions', loadInstructions)
    .addNode('recommendClassification', recommendClassification)
    .addEdge(START, 'normalizeAlerts')
    .addEdge('normalizeAlerts', 'loadInstructions')
    .addEdge('loadInstructions', 'recommendClassification')
    .addEdge('recommendClassification', END)
    .compile();

  const result = await graph.invoke({ rawBatch });

  return ClassificationResultSchema.parse({
    rawBatch: result.rawBatch,
    rawEventIds: result.rawBatch.events.map((event) => event.eventId),
    normalizedSignals: result.normalizedSignals,
    recommendation: result.recommendation,
  });
};
