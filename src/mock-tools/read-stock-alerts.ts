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
export const readStockAlerts = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "low stock SKU count",
    "value": "1"
  },
  {
    "label": "restock dates",
    "value": "not supplied"
  }
] });
};

export const readStockAlertsTool: MockTool = {
  name: "read_stock_alerts",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readStockAlerts,
};
