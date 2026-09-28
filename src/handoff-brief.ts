import { readFileSync } from 'node:fs';
import { END, START, StateGraph } from '@langchain/langgraph';
import { AlertReviewSchema } from './contracts.ts';
import {
  HandoffBriefSchema,
  HandoffInputSchema,
  HandoffOutputSchema,
  HandoffStateSchema,
  ModelSynopsisSchema,
} from './handoff-contracts.ts';

export function loadHandoffBriefInstruction() {
  return readFileSync(new URL('../moldea/agents/handoff-brief/instruction.md', import.meta.url), 'utf8');
}

function prepare({ classification }) {
  const parsed = AlertReviewSchema.parse(classification);
  const rawIds = parsed.rawEvents.map((event) => event.id);
  const ids = new Set(rawIds);
  if (ids.size !== rawIds.length ||
      parsed.observations.length !== rawIds.length ||
      parsed.observations.some((item) => !ids.has(item.eventId)) ||
      new Set(parsed.observations.map((item) => item.eventId)).size !== rawIds.length ||
      parsed.engineerReview.eventIds.some((id) => !ids.has(id)) ||
      parsed.hypotheses.some((item) => item.supportingEventIds.some((id) => !ids.has(id)))) {
    throw new Error('Classification references must match unique raw event IDs');
  }

  const observations = new Map(parsed.observations.map((item) => [item.eventId, item]));
  const timeline = [
    ...parsed.context.map((item) => ({
      at: item.occurredAt,
      kind: 'context',
      source: item.source,
      statement: item.statement,
    })),
    ...parsed.rawEvents.map((event) => ({
      at: event.observedAt,
      kind: 'signal',
      source: event.source,
      eventId: event.id,
      statement: observations.get(event.id).statement,
    })),
    {
      at: parsed.capturedAt,
      kind: 'batch-capture',
      source: 'Incident Desk batch',
      statement: `${parsed.batchId} captured`,
    },
  ];
  for (const item of timeline) {
    if (!Number.isFinite(Date.parse(item.at))) throw new Error('Timeline timestamps must be parseable');
  }
  timeline.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  return { timeline };
}

async function draft({ classification, timeline }, config) {
  const synopsisModel = config?.configurable?.synopsisModel;
  if (!synopsisModel || typeof synopsisModel.withStructuredOutput !== 'function') {
    throw new Error('A structured synopsisModel must be supplied in graph config');
  }
  const answer = await synopsisModel.withStructuredOutput(ModelSynopsisSchema).invoke([
    { role: 'system', content: loadHandoffBriefInstruction() },
    { role: 'user', content: JSON.stringify({ classification, timeline }) },
  ]);
  const modelDraft = ModelSynopsisSchema.parse(answer);
  if (classification.engineerReview.eventIds.some((id) => !modelDraft.synopsis.includes(id))) {
    throw new Error('Synopsis must cite each event selected for engineer review');
  }
  return { modelDraft };
}

function assemble({ classification, timeline, modelDraft }) {
  if (!timeline || !modelDraft) throw new Error('Handoff graph is missing a required result');
  return { brief: HandoffBriefSchema.parse({
    batchId: classification.batchId,
    sourceEvidence: {
      timeline,
      observations: classification.observations,
      evidenceGaps: classification.missingEvidence,
      rawEvents: classification.rawEvents,
    },
    classification: {
      engineerReview: classification.engineerReview,
      hypotheses: classification.hypotheses,
    },
    modelDraft,
    humanReviewRequired: true,
  }) };
}

const builder = new StateGraph({
  state: HandoffStateSchema,
  input: HandoffInputSchema,
  output: HandoffOutputSchema,
});
builder.addNode('prepare', prepare);
builder.addNode('draft', draft);
builder.addNode('assemble', assemble);
builder.addEdge(START, 'prepare');
builder.addEdge('prepare', 'draft');
builder.addEdge('draft', 'assemble');
builder.addEdge('assemble', END);

export const handoffBriefGraph = builder.compile({ name: 'incident_desk_handoff_brief' });

export async function draftHandoffBrief(classification, synopsisModel) {
  AlertReviewSchema.parse(classification);
  const { brief } = await handoffBriefGraph.invoke(
    { classification },
    { configurable: { synopsisModel } },
  );
  return HandoffBriefSchema.parse(brief);
}
