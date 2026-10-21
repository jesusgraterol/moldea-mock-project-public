import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import { z } from "zod";
import { assessRequest, assertGroundedHandoff } from "./assessment.ts";
import { HandoffFactsSchema, HandoffSchema, InventoryRecordSchema, RequestSchema, parseBoundary } from "./contracts.ts";
import { loadDispatchInstruction } from "./instructions.ts";
import { createInventoryLookupTool } from "./inventory.ts";

const DispatchState = new StateSchema({
  request: RequestSchema,
  record: InventoryRecordSchema.nullable().optional(),
  facts: HandoffFactsSchema.optional(),
  draft: z.unknown().optional(),
  handoff: HandoffSchema.optional(),
});

export async function createDispatchAssistant(options: { model: BaseChatModel; inventory: unknown }) {
  const instruction = await loadDispatchInstruction();
  const lookup = createInventoryLookupTool(options.inventory);
  // The schema is supplied through the real SDK's structured-output pipeline.
  // Its response-format function is not an operational tool or dispatch capability.
  const model = options.model.withStructuredOutput(HandoffSchema, { name: "staff_handoff" });

  const graph = new StateGraph(DispatchState)
    .addNode("lookup", async (state) => {
      const record = parseBoundary(InventoryRecordSchema.nullable(), await lookup.invoke({ itemId: state.request.itemId }), "lookup result");
      return { record, facts: assessRequest(state.request, record) };
    })
    .addNode("draft-handoff", async (state, config) => {
      const facts = parseBoundary(HandoffFactsSchema, state.facts, "handoff facts");
      const draft: unknown = await model.invoke([
        new SystemMessage(instruction),
        new HumanMessage(JSON.stringify({ request: state.request, inventoryRecord: state.record, facts })),
      ], config);
      return { draft };
    })
    .addNode("validate", (state) => {
      const handoff = parseBoundary(HandoffSchema, state.draft, "staff handoff");
      assertGroundedHandoff(handoff, parseBoundary(HandoffFactsSchema, state.facts, "handoff facts"));
      return { handoff };
    })
    .addEdge(START, "lookup")
    .addEdge("lookup", "draft-handoff")
    .addEdge("draft-handoff", "validate")
    .addEdge("validate", END)
    .compile();

  return {
    async invoke(input: unknown, config: { signal?: AbortSignal } = {}) {
      const request = parseBoundary(RequestSchema, input, "equipment request");
      const deadline = AbortSignal.timeout(30_000);
      const signal = config.signal ? AbortSignal.any([config.signal, deadline]) : deadline;
      const result = await graph.invoke({ request }, { signal, recursionLimit: 6 });
      return parseBoundary(HandoffSchema, result.handoff, "staff handoff");
    },
  };
}
