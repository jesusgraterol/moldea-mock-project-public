import { createMockAgent } from "../../mock-runtime/agent.js";
import { DeliveryInvestigatorInputSchema, DeliveryInvestigatorOutputSchema } from "./schemas.js";
import { loadDeliveryInvestigatorInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readTrackingHistoryTool } from "../../mock-tools/read-tracking-history.js";
import { readCarrierExceptionsTool } from "../../mock-tools/read-carrier-exceptions.js";

export const registeredTools = [readTrackingHistoryTool, readCarrierExceptionsTool];
export const registeredSkills = [
  {
    "name": "timeline-review",
    "path": "/fixtures/skills/timeline-review/SKILL.md"
  },
  {
    "name": "evidence-summary",
    "path": "/fixtures/skills/evidence-summary/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const deliveryInvestigatorAgent = createMockAgent({
  id: "delivery-investigator",
  inputSchema: DeliveryInvestigatorInputSchema,
  outputSchema: DeliveryInvestigatorOutputSchema,
  loadInstruction: loadDeliveryInvestigatorInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/delivery-investigator/output.json",
});
