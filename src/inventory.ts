import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tool } from "@langchain/core/tools";
import { InventoryLookupInputSchema, InventoryLookupOutputSchema, InventorySchema, parseBoundary } from "./contracts.ts";

export async function loadInventory() {
  const text = await readFile(resolve(import.meta.dirname, "..", "data", "inventory.json"), "utf8");
  return parseBoundary(InventorySchema, JSON.parse(text) as unknown, "inventory");
}

export function lookupInventory(records: unknown, input: unknown) {
  const inventory = parseBoundary(InventorySchema, records, "inventory");
  const { itemId } = parseBoundary(InventoryLookupInputSchema, input, "inventory lookup");
  return inventory.find((record) => record.id === itemId) ?? null;
}

export function createInventoryLookupTool(records: unknown) {
  // Zod creates an isolated snapshot; neither callers nor returned records can mutate it.
  const snapshot = parseBoundary(InventorySchema, records, "inventory");
  return tool(
    (input) => parseBoundary(InventoryLookupOutputSchema, lookupInventory(snapshot, input), "lookup result"),
    {
      name: "lookup_inventory",
      description: "Read a supplied fictional inventory record by exact item ID; return null if absent. No reservations or writes.",
      schema: InventoryLookupInputSchema,
    },
  );
}
