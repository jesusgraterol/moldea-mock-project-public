import { createMockAgent } from "../../mock-runtime/agent.js";
import { ReplyComposerInputSchema, ReplyComposerOutputSchema } from "./schemas.js";
import { loadReplyComposerInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { readApprovedBriefTool } from "../../mock-tools/read-approved-brief.js";

export const registeredTools = [readApprovedBriefTool];
export const registeredSkills = [
  {
    "name": "plain-language",
    "path": "/fixtures/skills/plain-language/SKILL.md"
  },
  {
    "name": "evidence-summary",
    "path": "/fixtures/skills/evidence-summary/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const replyComposerAgent = createMockAgent({
  id: "reply-composer",
  inputSchema: ReplyComposerInputSchema,
  outputSchema: ReplyComposerOutputSchema,
  loadInstruction: loadReplyComposerInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/reply-composer/output.json",
});
