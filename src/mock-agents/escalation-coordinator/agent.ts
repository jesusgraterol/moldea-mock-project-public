import { createMockAgent } from "../../mock-runtime/agent.js";
import { EscalationCoordinatorInputSchema, EscalationCoordinatorOutputSchema } from "./schemas.js";
import { loadEscalationCoordinatorInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readEscalationMatrixTool } from "../../mock-tools/read-escalation-matrix.js";
import { previewHandoffNoteTool } from "../../mock-tools/preview-handoff-note.js";

export const registeredTools = [readEscalationMatrixTool, previewHandoffNoteTool];
export const registeredSkills = [
  {
    "name": "case-routing",
    "path": "/fixtures/skills/case-routing/SKILL.md"
  },
  {
    "name": "evidence-summary",
    "path": "/fixtures/skills/evidence-summary/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const escalationCoordinatorAgent = createMockAgent({
  id: "escalation-coordinator",
  inputSchema: EscalationCoordinatorInputSchema,
  outputSchema: EscalationCoordinatorOutputSchema,
  loadInstruction: loadEscalationCoordinatorInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/escalation-coordinator/output.json",
});
