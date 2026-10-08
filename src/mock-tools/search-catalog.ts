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
export const searchCatalog = (input: unknown) => {
  const { reference } = ToolInputSchema.parse(input);
  return ToolOutputSchema.parse({ reference, fixtureOnly: true, records: [
  {
    "label": "NOTE-A5-DOT",
    "value": "A5 dotted notebook"
  },
  {
    "label": "PEN-BLK-02",
    "value": "black ink pen pair"
  }
] });
};

export const searchCatalogTool: MockTool = {
  name: "search_catalog",
  inputSchema: ToolInputSchema,
  outputSchema: ToolOutputSchema,
  execute: searchCatalog,
};
