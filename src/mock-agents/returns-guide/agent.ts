import { createMockAgent } from "../../mock-runtime/agent.js";
import { ReturnsGuideInputSchema, ReturnsGuideOutputSchema } from "./schemas.js";
import { loadReturnsGuideInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readReturnPolicyTool } from "../../mock-tools/read-return-policy.js";
import { previewReturnChecklistTool } from "../../mock-tools/preview-return-checklist.js";

export const registeredTools = [readReturnPolicyTool, previewReturnChecklistTool];
export const registeredSkills = [
  {
    "name": "policy-comparison",
    "path": "/fixtures/skills/policy-comparison/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const returnsGuideAgent = createMockAgent({
  id: "returns-guide",
  inputSchema: ReturnsGuideInputSchema,
  outputSchema: ReturnsGuideOutputSchema,
  loadInstruction: loadReturnsGuideInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/returns-guide/output.json",
});
