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
export const readTrackingHistory = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "2026-10-02",
    "value": "carrier accepted parcel"
  },
  {
    "label": "2026-10-03",
    "value": "regional hub scan"
  },
  {
    "label": "2026-10-08",
    "value": "snapshot; no newer scan"
  }
] });
};

export const readTrackingHistoryTool: MockTool = {
  name: "read_tracking_history",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readTrackingHistory,
};
