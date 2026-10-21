import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseChatModelCallOptions, BindToolsInput } from "@langchain/core/language_models/chat_models";
import { AIMessageChunk } from "@langchain/core/messages";
import type { BaseMessage } from "@langchain/core/messages";
import type { ChatResult } from "@langchain/core/outputs";
import { z } from "zod";
import { createDispatchAssistant } from "../src/assistant.ts";
import { HandoffSchema, InventoryLookupOutputSchema, RequestSchema, parseBoundary } from "../src/contracts.ts";
import { createInventoryLookupTool, loadInventory } from "../src/inventory.ts";

interface BoundaryCallOptions extends BaseChatModelCallOptions { tools?: BindToolsInput[] }
type BoundaryReply = (messages: BaseMessage[]) => Record<string, unknown>;

// Only _generate (the provider boundary) is controlled. SDK invocation, binding,
// structured-output parsing, graph execution, tools and schemas are all real.
class BoundaryModel extends BaseChatModel<BoundaryCallOptions> {
  readonly calls: { messages: BaseMessage[]; options: BoundaryCallOptions }[] = [];
  private reply: BoundaryReply;

  constructor(reply: BoundaryReply) { super({}); this.reply = reply; }
  _llmType() { return "test-external-boundary"; }
  bindTools(tools: BindToolsInput[]) { return this.withConfig({ tools }); }

  async _generate(messages: BaseMessage[], options: BoundaryCallOptions): Promise<ChatResult> {
    this.calls.push({ messages, options });
    const message = new AIMessageChunk({
      content: "",
      tool_calls: [{ id: "test-handoff", name: "staff_handoff", type: "tool_call", args: this.reply(messages) }],
    });
    return { generations: [{ text: "", message }] };
  }
}

function modelInput(messages: BaseMessage[]) {
  const text = messages.at(-1)?.content;
  assert.equal(typeof text, "string");
  return JSON.parse(text as string) as {
    request: { itemId: string };
    inventoryRecord: { id: string; observedAt: string | null } | null;
    facts: {
      requestId: string; recommendationAction: string; supportingInventoryRecordIds: string[];
      missingFacts: string[]; urgency: string; requiresStaffApproval: true;
    };
  };
}

// A fixed response independent of the prompt's computed facts, so incorrect
// graph assessment cannot make the model and assertion agree accidentally.
function reply(action: string, ids: string[], missingFacts: string[], urgency: string, requestId = "test-request") {
  return {
    requestId,
    recommendation: { action, summary: "Draft for staff review based only on the supplied evidence; staff approval is required." },
    supportingInventoryRecordIds: ids,
    missingFacts,
    urgency,
    requiresStaffApproval: true,
  };
}

const inventory = await loadInventory();
const exampleRequests = parseBoundary(RequestSchema.array(), JSON.parse(await readFile(resolve(import.meta.dirname, "..", "data", "requests.json"), "utf8")) as unknown, "test requests");
const baseRequest = { id: "test-request", itemId: "ad-light-01", quantity: 1, referenceAt: "2026-11-03T12:00:00Z", neededAt: "2026-11-05T12:00:00Z" };

for (const scenario of [
  { id: "request-a", action: "review-for-dispatch", record: "ad-light-01", missing: [], urgency: "urgent" },
  { id: "request-b", action: "verify-inventory", record: "ad-projector-03", missing: ["Inventory availability is unknown.", "Available quantity has not been observed.", "Inventory observation timestamp is missing."], urgency: "urgent" },
  { id: "request-c", action: "do-not-dispatch", record: "ad-mic-02", missing: [], urgency: "urgent" },
]) {
  test(`real graph: ${scenario.id} produces a grounded handoff`, async () => {
    const model = new BoundaryModel(() => reply(scenario.action, [scenario.record], scenario.missing, scenario.urgency, scenario.id));
    const assistant = await createDispatchAssistant({ model, inventory });
    const handoff = await assistant.invoke(exampleRequests.find((request) => request.id === scenario.id));
    assert.equal(handoff.recommendation.action, scenario.action);
    assert.deepEqual(handoff.supportingInventoryRecordIds, [scenario.record]);
    assert.deepEqual(handoff.missingFacts, scenario.missing);
    assert.equal(handoff.urgency, scenario.urgency);
    assert.equal(handoff.requiresStaffApproval, true);
    assert.equal(model.calls.length, 1);
    const input = modelInput(model.calls[0]!.messages);
    assert.equal(input.inventoryRecord?.id, scenario.record);
    assert.equal(input.facts.recommendationAction, scenario.action);
    assert.deepEqual(HandoffSchema.safeParse(handoff).success, true);
  });
}

for (const [neededAt, urgency] of [
  ["2026-11-04T12:00:00.001Z", "urgent"],
  ["2026-11-05T11:59:59.999Z", "urgent"],
  ["2026-11-05T12:00:00Z", "urgent"],
  ["2026-11-05T12:00:00.001Z", "routine"],
  ["2026-11-05T12:00:00.0001Z", "routine"],
  ["2026-11-03T11:00:00Z", "urgent"],
] as const) {
  test(`supplied timestamps: ${neededAt} is ${urgency}`, async () => {
    const model = new BoundaryModel(() => reply("review-for-dispatch", ["ad-light-01"], [], urgency));
    const assistant = await createDispatchAssistant({ model, inventory });
    const handoff = await assistant.invoke({ ...baseRequest, neededAt });
    assert.equal(handoff.urgency, urgency);
    assert.equal(handoff.requiresStaffApproval, true);
    assert.equal(modelInput(model.calls[0]!.messages).facts.urgency, urgency);
  });
}

test("fractional reference timestamps are compared without truncation", async () => {
  const model = new BoundaryModel(() => reply("review-for-dispatch", ["ad-light-01"], [], "urgent"));
  const assistant = await createDispatchAssistant({ model, inventory });
  const handoff = await assistant.invoke({ ...baseRequest, referenceAt: "2026-11-03T12:00:00.0002Z", neededAt: "2026-11-05T12:00:00.0001Z" });
  assert.equal(handoff.urgency, "urgent");
});

test("unknown stock stays unknown just beyond 48 hours, with staff approval still required", async () => {
  const missing = ["Inventory availability is unknown.", "Available quantity has not been observed.", "Inventory observation timestamp is missing."];
  const model = new BoundaryModel(() => reply("verify-inventory", ["ad-projector-03"], missing, "routine"));
  const assistant = await createDispatchAssistant({ model, inventory });
  const handoff = await assistant.invoke({ ...baseRequest, itemId: "ad-projector-03", neededAt: "2026-11-05T12:00:00.001Z" });
  assert.equal(handoff.recommendation.action, "verify-inventory");
  assert.deepEqual(handoff.supportingInventoryRecordIds, ["ad-projector-03"]);
  assert.deepEqual(handoff.missingFacts, missing);
  assert.equal(handoff.urgency, "routine");
  assert.equal(handoff.requiresStaffApproval, true);
});

test("model cannot mark a request just beyond 48 hours as urgent", async () => {
  const model = new BoundaryModel(() => reply("review-for-dispatch", ["ad-light-01"], [], "urgent"));
  const assistant = await createDispatchAssistant({ model, inventory });
  await assert.rejects(assistant.invoke({ ...baseRequest, neededAt: "2026-11-05T12:00:00.001Z" }), /contradicts/);
});

test("absent item stays unknown, not unavailable, and has no invented evidence ID", async () => {
  const missing = ["No supplied inventory record matches item absent-item."];
  const model = new BoundaryModel(() => reply("verify-inventory", [], missing, "urgent"));
  const assistant = await createDispatchAssistant({ model, inventory });
  const handoff = await assistant.invoke({ ...baseRequest, itemId: "absent-item" });
  assert.deepEqual(handoff.missingFacts, missing);
  assert.deepEqual(handoff.supportingInventoryRecordIds, []);
  assert.equal(modelInput(model.calls[0]!.messages).inventoryRecord, null);
});

for (const availability of ["available", "unavailable"] as const) {
  test(`${availability} without an observation timestamp is not a stock claim`, async () => {
    const missing = ["Inventory observation timestamp is missing."];
    const model = new BoundaryModel(() => reply("verify-inventory", ["ad-light-01"], missing, "urgent"));
    const records = [{ id: "ad-light-01", name: "Light", availability, quantityAvailable: availability === "available" ? 2 : 0 }];
    const assistant = await createDispatchAssistant({ model, inventory: records });
    const handoff = await assistant.invoke(baseRequest);
    assert.equal(handoff.recommendation.action, "verify-inventory");
    assert.deepEqual(handoff.missingFacts, missing);
    assert.equal(modelInput(model.calls[0]!.messages).inventoryRecord?.observedAt, null);
  });
}

test("missing quantity stays unknown even with an available label and timestamp", async () => {
  const missing = ["Available quantity has not been observed."];
  const model = new BoundaryModel(() => reply("verify-inventory", ["ad-light-01"], missing, "urgent"));
  const assistant = await createDispatchAssistant({ model, inventory: [{ ...inventory[0]!, quantityAvailable: null }] });
  assert.deepEqual((await assistant.invoke(baseRequest)).missingFacts, missing);
});

test("future observation cannot establish stock at the supplied reference time", async () => {
  const missing = ["Inventory observation is after the supplied reference timestamp."];
  const model = new BoundaryModel(() => reply("verify-inventory", ["ad-light-01"], missing, "urgent"));
  const assistant = await createDispatchAssistant({ model, inventory: [{ ...inventory[0]!, observedAt: "2026-11-03T12:00:00.001Z" }] });
  assert.equal((await assistant.invoke(baseRequest)).recommendation.action, "verify-inventory");
});

test("recorded available stock below the requested quantity does not permit dispatch", async () => {
  const model = new BoundaryModel(() => reply("do-not-dispatch", ["ad-light-01"], [], "urgent"));
  const assistant = await createDispatchAssistant({ model, inventory });
  assert.equal((await assistant.invoke({ ...baseRequest, quantity: 3 })).recommendation.action, "do-not-dispatch");
});

test("maintained 48-hour instruction and executable output schema reach the SDK boundary", async () => {
  const model = new BoundaryModel(() => reply("review-for-dispatch", ["ad-light-01"], [], "urgent"));
  const assistant = await createDispatchAssistant({ model, inventory });
  await assistant.invoke(baseRequest);
  const call = model.calls[0]!;
  const canonical = await readFile(resolve(import.meta.dirname, "..", "moldea", "agents", "equipment-handoff", "instruction.md"), "utf8");
  const systemInstruction = call.messages[0]?.content;
  assert.equal(systemInstruction, canonical);
  assert.equal(typeof systemInstruction, "string");
  assert.match(systemInstruction as string, /exactly 48 hours is urgent/);
  assert.match(systemInstruction as string, /more than 48 hours is routine/);
  assert.doesNotMatch(systemInstruction as string, /\b24[ -]hours?\b/);
  assert.equal(call.messages[0]?.getType(), "system");
  const format = call.options.tools?.[0] as { function?: { name: string; parameters: Record<string, unknown> } };
  assert.equal(call.options.tools?.length, 1);
  assert.equal(format.function?.name, "staff_handoff");
  const expected = z.toJSONSchema(HandoffSchema);
  assert.deepEqual(format.function?.parameters.properties, expected.properties);
  assert.deepEqual(format.function?.parameters.required, expected.required);
  assert.equal(format.function?.parameters.additionalProperties, false);
  assert.ok(call.options.signal instanceof AbortSignal);
});

test("real lookup tool is exact-match, validated, isolated, and read-only", async () => {
  const before = await readFile(resolve(import.meta.dirname, "..", "data", "inventory.json"), "utf8");
  const records = structuredClone(inventory);
  const lookup = createInventoryLookupTool(records);
  assert.equal(lookup.name, "lookup_inventory");
  records[0]!.quantityAvailable = 999;
  const found = parseBoundary(InventoryLookupOutputSchema, await lookup.invoke({ itemId: "ad-light-01" }), "test lookup");
  assert.equal(found?.quantityAvailable, 2);
  found!.quantityAvailable = 444;
  const again = parseBoundary(InventoryLookupOutputSchema, await lookup.invoke({ itemId: "ad-light-01" }), "test lookup");
  assert.equal(again?.quantityAvailable, 2);
  assert.equal(await lookup.invoke({ itemId: "AD-LIGHT-01" }), null);
  await assert.rejects(lookup.invoke({ itemId: "ad-light-01", reserve: true } as never));
  assert.equal(await readFile(resolve(import.meta.dirname, "..", "data", "inventory.json"), "utf8"), before);
});

for (const patch of [
  { quantity: 0 }, { quantity: 1.5 }, { referenceAt: "not-a-date" },
  { referenceAt: "2026-11-03T12:00:00+01:00" }, { neededAt: "2026-11-04T12:00:00" },
  { neededAt: "2026-02-30T12:00:00Z" }, { reserve: true },
  { itemId: " ad-light-01" },
]) {
  test(`invalid request is rejected before the model: ${JSON.stringify(patch)}`, async () => {
    const model = new BoundaryModel(() => { throw new Error("Model must not run."); });
    const assistant = await createDispatchAssistant({ model, inventory });
    await assert.rejects(assistant.invoke({ ...baseRequest, ...patch }), /Invalid equipment request/);
    assert.equal(model.calls.length, 0);
  });
}

test("malformed and duplicate inventory fail at the data boundary", () => {
  assert.throws(() => createInventoryLookupTool([inventory[0], inventory[0]]), /Duplicate inventory record ID/);
  assert.throws(() => createInventoryLookupTool([{ ...inventory[0], quantityAvailable: -1 }]), /Invalid inventory/);
  assert.throws(() => createInventoryLookupTool([{ ...inventory[0], observedAt: "2026-11-03" }]), /Invalid inventory/);
});

for (const [name, patch] of [
  ["approval bypass", { requiresStaffApproval: false }],
  ["forged citation", { supportingInventoryRecordIds: ["invented"] }],
  ["omitted citation", { supportingInventoryRecordIds: [] }],
  ["wrong urgency", { urgency: "routine" }],
  ["wrong request", { requestId: "other-request" }],
  ["invented missing fact", { missingFacts: ["There is no stock."] }],
  ["wrong stock action", { recommendation: { action: "do-not-dispatch", summary: "No stock." } }],
  ["unsupported operation", { dispatch: true }],
  ["empty summary", { recommendation: { action: "review-for-dispatch", summary: "" } }],
] as const) {
  test(`invalid model draft fails closed: ${name}`, async () => {
    const model = new BoundaryModel(() => ({ ...reply("review-for-dispatch", ["ad-light-01"], [], "urgent"), ...patch }));
    const assistant = await createDispatchAssistant({ model, inventory });
    await assert.rejects(assistant.invoke(baseRequest), /Invalid staff handoff|contradicts/);
  });
}

test("model cannot erase unknown-stock missing facts", async () => {
  const model = new BoundaryModel(() => reply("verify-inventory", ["ad-projector-03"], [], "urgent"));
  const assistant = await createDispatchAssistant({ model, inventory });
  await assert.rejects(assistant.invoke({ ...baseRequest, itemId: "ad-projector-03" }), /contradicts/);
});

test("external model failure is propagated, never replaced with a fabricated handoff", async () => {
  const model = new BoundaryModel(() => { throw new Error("Provider unavailable."); });
  const assistant = await createDispatchAssistant({ model, inventory });
  await assert.rejects(assistant.invoke(baseRequest), /Provider unavailable/);
});

test("CLI runs from another working directory without credentials or inventory changes", async () => {
  const file = resolve(import.meta.dirname, "..", "data", "inventory.json");
  const before = await readFile(file, "utf8");
  const { stdout, stderr } = await promisify(execFile)(process.execPath, [resolve(import.meta.dirname, "..", "examples", "dispatch.ts"), "--request", "request-c"], {
    cwd: tmpdir(), timeout: 10_000, signal: AbortSignal.timeout(10_000), maxBuffer: 1024 * 1024,
  });
  assert.equal(stderr, "");
  const result = JSON.parse(stdout) as { schemaVersion: number; modelMode: string; handoff: unknown };
  assert.equal(result.schemaVersion, 1);
  assert.equal(result.modelMode, "offline-example");
  const handoff = parseBoundary(HandoffSchema, result.handoff, "CLI handoff");
  assert.equal(handoff.urgency, "urgent");
  assert.equal(handoff.recommendation.action, "do-not-dispatch");
  assert.equal(handoff.requiresStaffApproval, true);
  assert.equal(await readFile(file, "utf8"), before);
});
