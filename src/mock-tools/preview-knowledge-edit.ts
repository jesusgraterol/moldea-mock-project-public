import { z } from "zod";
import type { MockTool } from "../mock-runtime/agent.js";

export const ToolInputSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
});

export const ToolOutputSchema = z.strictObject({
  reference: z.string(),
  fixtureOnly: z.literal(true),
  records: z.array(z.strictObject({ label: z.string(), value: z.string() })),
});

/** Returns invented fixture records; performs no external read or write. */
export const previewKnowledgeEdit = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "preview",
    "value": "clarify passed-estimate wording"
  },
  {
    "label": "write action",
    "value": "none"
  }
] });
};

export const previewKnowledgeEditTool: MockTool = {
  name: "preview_knowledge_edit",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: previewKnowledgeEdit,
};
