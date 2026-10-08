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
export const readCarrierExceptions = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "exception",
    "value": "no exception supplied"
  },
  {
    "label": "carrier",
    "value": "Northline Parcel"
  }
] });
};

export const readCarrierExceptionsTool: MockTool = {
  name: "read_carrier_exceptions",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: readCarrierExceptions,
};
