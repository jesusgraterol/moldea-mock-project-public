import { createMockAgent } from "../../mock-runtime/agent.js";
import { OrderLookupInputSchema, OrderLookupOutputSchema } from "./schemas.js";
import { loadOrderLookupInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readOrderSnapshotTool } from "../../mock-tools/read-order-snapshot.js";

export const registeredTools = [readOrderSnapshotTool];
export const registeredSkills = [
  {
    "name": "evidence-summary",
    "path": "/fixtures/skills/evidence-summary/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const orderLookupAgent = createMockAgent({
  id: "order-lookup",
  inputSchema: OrderLookupInputSchema,
  outputSchema: OrderLookupOutputSchema,
  loadInstruction: loadOrderLookupInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/order-lookup/output.json",
});
