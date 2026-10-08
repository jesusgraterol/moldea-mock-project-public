import { createMockAgent } from "../../mock-runtime/agent.js";
import { KnowledgeCuratorInputSchema, KnowledgeCuratorOutputSchema } from "./schemas.js";
import { loadKnowledgeCuratorInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readKnowledgeSourceTool } from "../../mock-tools/read-knowledge-source.js";
import { previewKnowledgeEditTool } from "../../mock-tools/preview-knowledge-edit.js";

export const registeredTools = [readKnowledgeSourceTool, previewKnowledgeEditTool];
export const registeredSkills = [
  {
    "name": "evidence-summary",
    "path": "/fixtures/skills/evidence-summary/SKILL.md"
  },
  {
    "name": "plain-language",
    "path": "/fixtures/skills/plain-language/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const knowledgeCuratorAgent = createMockAgent({
  id: "knowledge-curator",
  inputSchema: KnowledgeCuratorInputSchema,
  outputSchema: KnowledgeCuratorOutputSchema,
  loadInstruction: loadKnowledgeCuratorInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/knowledge-curator/output.json",
});
