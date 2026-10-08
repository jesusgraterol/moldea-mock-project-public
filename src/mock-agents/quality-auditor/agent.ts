import { createMockAgent } from "../../mock-runtime/agent.js";
import { QualityAuditorInputSchema, QualityAuditorOutputSchema } from "./schemas.js";
import { loadQualityAuditorInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readDraftEvidenceTool } from "../../mock-tools/read-draft-evidence.js";
import { readReviewRubricTool } from "../../mock-tools/read-review-rubric.js";

export const registeredTools = [readDraftEvidenceTool, readReviewRubricTool];
export const registeredSkills = [
  {
    "name": "risk-language",
    "path": "/fixtures/skills/risk-language/SKILL.md"
  },
  {
    "name": "policy-comparison",
    "path": "/fixtures/skills/policy-comparison/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const qualityAuditorAgent = createMockAgent({
  id: "quality-auditor",
  inputSchema: QualityAuditorInputSchema,
  outputSchema: QualityAuditorOutputSchema,
  loadInstruction: loadQualityAuditorInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/quality-auditor/output.json",
});
