import { readFileSync } from 'node:fs';
import { END, START, StateGraph } from '@langchain/langgraph';
import {
  AlertReviewSchema,
  BatchSchema,
  GraphInputSchema,
  GraphOutputSchema,
  GraphStateSchema,
  ModelReviewSchema,
} from './contracts.ts';

export function loadAlertClassifierInstruction() {
  return readFileSync(new URL('../moldea/agents/alert-classifier/instruction.md', import.meta.url), 'utf8');
}

function normalizeDuration(event) {
  if (event.signal !== 'request_latency_p95') return undefined;
  const factor = event.unit === 'ms' ? 1 : event.unit === 'seconds' ? 1000 : undefined;
  if (factor === undefined) throw new Error(`Unsupported latency unit for ${event.id}: ${event.unit}`);
  return {
    value: event.value * factor,
    threshold: event.threshold * factor,
    unit: 'ms',
  };
}

function observe({ batch }) {
  const parsed = BatchSchema.parse(batch);
  const ids = parsed.events.map((event) => event.id);
  if (new Set(ids).size !== ids.length) throw new Error('Event IDs must be unique within a batch');

  return {
    observations: parsed.events.map((event) => {
      const normalizedDuration = normalizeDuration(event);
      return {
        eventId: event.id,
        statement: `${event.source} observed ${event.service} ${event.signal} at ${event.value} ${event.unit}; supplied threshold ${event.threshold} ${event.unit}.` +
          (normalizedDuration ? ` Comparable duration: ${normalizedDuration.value} ms against ${normalizedDuration.threshold} ms.` : ''),
        aboveThreshold: normalizedDuration
          ? normalizedDuration.value > normalizedDuration.threshold
          : event.value > event.threshold,
        ...(normalizedDuration ? { normalizedDuration } : {}),
      };
    }),
  };
}

async function classify({ batch, observations }, config) {
  const reviewModel = config?.configurable?.reviewModel;
  if (!reviewModel || typeof reviewModel.withStructuredOutput !== 'function') {
    throw new Error('A structured reviewModel must be supplied in graph config');
  }
  const structuredModel = reviewModel.withStructuredOutput(ModelReviewSchema);
  const answer = await structuredModel.invoke([
    { role: 'system', content: loadAlertClassifierInstruction() },
    { role: 'user', content: JSON.stringify({ batch, observations }) },
  ]);
  return { modelReview: ModelReviewSchema.parse(answer) };
}

function assemble({ batch, observations, modelReview }) {
  const ids = new Set(batch.events.map((event) => event.id));
  if (!observations || !modelReview) throw new Error('Classifier graph is missing a required result');
  const reviewIds = modelReview.reviewEventIds;
  if (new Set(reviewIds).size !== reviewIds.length || reviewIds.some((id) => !ids.has(id))) {
    throw new Error('Model review IDs must be unique raw event IDs from the batch');
  }
  for (const hypothesis of modelReview.hypotheses) {
    if (!hypothesis.question.trim().endsWith('?')) {
      throw new Error('Hypotheses must be phrased as questions');
    }
    if (new Set(hypothesis.supportingEventIds).size !== hypothesis.supportingEventIds.length ||
        hypothesis.supportingEventIds.some((id) => !ids.has(id))) {
      throw new Error('Hypothesis references must be unique raw event IDs from the batch');
    }
  }

  return { result: AlertReviewSchema.parse({
    batchId: batch.batchId,
    capturedAt: batch.capturedAt,
    rawEvents: batch.events,
    observations,
    context: batch.context,
    missingEvidence: batch.missingEvidence,
    engineerReview: { recommended: reviewIds.length > 0, eventIds: reviewIds },
    hypotheses: modelReview.hypotheses.map((item) => ({ ...item, status: 'unverified' })),
  }) };
}

const builder = new StateGraph({
  state: GraphStateSchema,
  input: GraphInputSchema,
  output: GraphOutputSchema,
});
builder.addNode('observe', observe);
builder.addNode('classify', classify);
builder.addNode('assemble', assemble);
builder.addEdge(START, 'observe');
builder.addEdge('observe', 'classify');
builder.addEdge('classify', 'assemble');
builder.addEdge('assemble', END);

export const alertClassifierGraph = builder.compile({ name: 'incident_desk_alert_classifier' });

export async function classifyAlertBatch(batch, reviewModel) {
  BatchSchema.parse(batch);
  const { result } = await alertClassifierGraph.invoke(
    { batch },
    { configurable: { reviewModel } },
  );
  return AlertReviewSchema.parse(result);
}
