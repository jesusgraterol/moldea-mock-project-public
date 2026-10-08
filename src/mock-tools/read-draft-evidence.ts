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
export const readDraftEvidence = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "claim",
    "value": "definite arrival tomorrow"
  },
  {
    "label": "supporting evidence",
    "value": "none supplied"
  }
] });
};

export const readDraftEvidenceTool: MockTool = {
  name: "read_draft_evidence",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readDraftEvidence,
};
