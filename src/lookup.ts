import { readFile } from "node:fs/promises";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { AssistantError } from "./errors.js";
import { LookupInputSchema, LookupResultSchema, ToolRecordSchema, type LookupResult } from "./schemas.js";

const recordsUrl = new URL("../data/tools.json", import.meta.url);

export async function lookupTool(input: unknown): Promise<LookupResult> {
  const { query } = LookupInputSchema.parse(input);
  let records;
  try {
    records = z.array(ToolRecordSchema).min(1).parse(JSON.parse(await readFile(recordsUrl, "utf8")));
    if (new Set(records.map((record) => record.id)).size !== records.length) {
      throw new Error("Duplicate record IDs");
    }
  } catch {
    throw new AssistantError("RECORDS_UNAVAILABLE", "Fictional tool records could not be validated; ask staff to confirm manually.");
  }
  const normalized = query.trim().toLowerCase();
  const exact = records.filter((record) =>
    record.id.toLowerCase() === normalized || record.name.toLowerCase() === normalized);
  const matches = exact.length ? exact : records.filter((record) => record.name.toLowerCase().includes(normalized));
  return LookupResultSchema.parse({
    status: matches.length === 0 ? "not_found" : matches.length === 1 ? "found" : "ambiguous",
    records: matches.map((record) => ({ ...record, source: `data/tools.json#${record.id}` })),
    source: "data/tools.json",
  });
}

export function createLookupTool() {
  return tool(async (input) => JSON.stringify(await lookupTool(input)), {
    name: "lookup_tool",
    description: "Read fictional checked-in tool records by ID or name. Returns found, ambiguous, or not_found; unknown availability stays unknown. No reservations, loan changes, or safety assessment.",
    schema: LookupInputSchema,
  });
}
