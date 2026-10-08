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
export const readCaseSummary = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "case",
    "value": "PD-433"
  },
  {
    "label": "intent",
    "value": "shipment explanation"
  },
  {
    "label": "intervention",
    "value": "none recorded"
  }
] });
};

export const readCaseSummaryTool: MockTool = {
  name: "read_case_summary",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readCaseSummary,
};
