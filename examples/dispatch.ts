import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { createDispatchAssistant } from "../src/assistant.ts";
import { RequestSchema, parseBoundary } from "../src/contracts.ts";
import { loadInventory } from "../src/inventory.ts";
import { OfflineExampleModel } from "./offline-model.ts";

async function main() {
  const { values } = parseArgs({ options: { request: { type: "string", default: "request-a" }, help: { type: "boolean" } } });
  if (values.help) {
    console.log("Usage: npm run example -- --request request-a|request-b|request-c\nRuns the real assistant with an offline model stand-in; no credentials or live dispatch.");
    return;
  }
  const text = await readFile(resolve(import.meta.dirname, "..", "data", "requests.json"), "utf8");
  const requests = parseBoundary(RequestSchema.array(), JSON.parse(text) as unknown, "example requests");
  const request = requests.find((candidate) => candidate.id === values.request);
  if (!request) throw new Error("Unknown example request. Choose request-a, request-b, or request-c.");
  const assistant = await createDispatchAssistant({ model: new OfflineExampleModel(), inventory: await loadInventory() });
  const handoff = await assistant.invoke(request);
  console.log(JSON.stringify({ schemaVersion: 1, modelMode: "offline-example", handoff }, null, 2));
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : "Equipment handoff example failed.");
  process.exitCode = 1;
}
