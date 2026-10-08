import { createMockAgent } from "../../mock-runtime/agent.js";
import { SupportTriageInputSchema, SupportTriageOutputSchema } from "./schemas.js";
import { loadSupportTriageInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readCaseSummaryTool } from "../../mock-tools/read-case-summary.js";
import { listReviewQueuesTool } from "../../mock-tools/list-review-queues.js";

export const registeredTools = [readCaseSummaryTool, listReviewQueuesTool];
export const registeredSkills = [
  {
    "name": "evidence-summary",
    "path": "/fixtures/skills/evidence-summary/SKILL.md"
  },
  {
    "name": "case-routing",
    "path": "/fixtures/skills/case-routing/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const supportTriageAgent = createMockAgent({
  id: "support-triage",
  inputSchema: SupportTriageInputSchema,
  outputSchema: SupportTriageOutputSchema,
  loadInstruction: loadSupportTriageInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/support-triage/output.json",
});
