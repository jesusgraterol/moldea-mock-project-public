import { createMockAgent } from "../../mock-runtime/agent.js";
import { StockWatcherInputSchema, StockWatcherOutputSchema } from "./schemas.js";
import { loadStockWatcherInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readInventorySnapshotTool } from "../../mock-tools/read-inventory-snapshot.js";

export const registeredTools = [readInventorySnapshotTool];
export const registeredSkills = [];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const stockWatcherAgent = createMockAgent({
  id: "stock-watcher",
  inputSchema: StockWatcherInputSchema,
  outputSchema: StockWatcherOutputSchema,
  loadInstruction: loadStockWatcherInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/stock-watcher/output.json",
});
