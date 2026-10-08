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
export const readApprovedBrief = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "estimate",
    "value": "2026-10-06; passed as of snapshot"
  },
  {
    "label": "last scan",
    "value": "2026-10-03; location now unknown"
  }
] });
};

export const readApprovedBriefTool: MockTool = {
  name: "read_approved_brief",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readApprovedBrief,
};
