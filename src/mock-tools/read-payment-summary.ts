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
export const readPaymentSummary = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "currency",
    "value": "USD"
  },
  {
    "label": "paid minor units",
    "value": "1890"
  },
  {
    "label": "refund",
    "value": "none recorded"
  }
] });
};

export const readPaymentSummaryTool: MockTool = {
  name: "read_payment_summary",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readPaymentSummary,
};
