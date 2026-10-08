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
export const readInventorySnapshot = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "CARD-THANKS-06",
    "value": "4 available units"
  },
  {
    "label": "threshold",
    "value": "12 units"
  }
] });
};

export const readInventorySnapshotTool: MockTool = {
  name: "read_inventory_snapshot",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readInventorySnapshot,
};
