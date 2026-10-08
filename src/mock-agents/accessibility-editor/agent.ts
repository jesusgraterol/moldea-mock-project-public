import { createMockAgent } from "../../mock-runtime/agent.js";
import { AccessibilityEditorInputSchema, AccessibilityEditorOutputSchema } from "./schemas.js";
import { loadAccessibilityEditorInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readReadabilityRubricTool } from "../../mock-tools/read-readability-rubric.js";

export const registeredTools = [readReadabilityRubricTool];
export const registeredSkills = [
  {
    "name": "plain-language",
    "path": "/fixtures/skills/plain-language/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const accessibilityEditorAgent = createMockAgent({
  id: "accessibility-editor",
  inputSchema: AccessibilityEditorInputSchema,
  outputSchema: AccessibilityEditorOutputSchema,
  loadInstruction: loadAccessibilityEditorInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/accessibility-editor/output.json",
});
