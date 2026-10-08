import { createMockAgent } from "../../mock-runtime/agent.js";
import { OperationsReporterInputSchema, OperationsReporterOutputSchema } from "./schemas.js";
import { loadOperationsReporterInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readSupportMetricsTool } from "../../mock-tools/read-support-metrics.js";
import { readStockAlertsTool } from "../../mock-tools/read-stock-alerts.js";

export const registeredTools = [readSupportMetricsTool, readStockAlertsTool];
export const registeredSkills = [
  {
    "name": "money-formatting",
    "path": "/fixtures/skills/money-formatting/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const operationsReporterAgent = createMockAgent({
  id: "operations-reporter",
  inputSchema: OperationsReporterInputSchema,
  outputSchema: OperationsReporterOutputSchema,
  loadInstruction: loadOperationsReporterInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/operations-reporter/output.json",
});
