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
export const readSupportMetrics = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "shipment review",
    "value": "18"
  },
  {
    "label": "return review",
    "value": "7"
  },
  {
    "label": "unknown intent",
    "value": "2"
  }
] });
};

export const readSupportMetricsTool: MockTool = {
  name: "read_support_metrics",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readSupportMetrics,
};
