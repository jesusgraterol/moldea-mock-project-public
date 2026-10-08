import { createMockAgent } from "../../mock-runtime/agent.js";
import { FraudScreenerInputSchema, FraudScreenerOutputSchema } from "./schemas.js";
import { loadFraudScreenerInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readCaseSignalsTool } from "../../mock-tools/read-case-signals.js";
import { readReviewHistoryTool } from "../../mock-tools/read-review-history.js";

export const registeredTools = [readCaseSignalsTool, readReviewHistoryTool];
export const registeredSkills = [
  {
    "name": "risk-language",
    "path": "/fixtures/skills/risk-language/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const fraudScreenerAgent = createMockAgent({
  id: "fraud-screener",
  inputSchema: FraudScreenerInputSchema,
  outputSchema: FraudScreenerOutputSchema,
  loadInstruction: loadFraudScreenerInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/fraud-screener/output.json",
});
