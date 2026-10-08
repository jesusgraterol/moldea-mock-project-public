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
export const readDispatchState = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "dispatch",
    "value": "handed to carrier"
  },
  {
    "label": "edit feasibility",
    "value": "unknown"
  }
] });
};

export const readDispatchStateTool: MockTool = {
  name: "read_dispatch_state",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readDispatchState,
};
