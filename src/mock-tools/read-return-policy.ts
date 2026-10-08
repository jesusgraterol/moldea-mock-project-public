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
export const readReturnPolicy = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "damaged item",
    "value": "staff review with condition evidence"
  },
  {
    "label": "personalized item",
    "value": "review fixture restrictions"
  }
] });
};

export const readReturnPolicyTool: MockTool = {
  name: "read_return_policy",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readReturnPolicy,
};
