import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseChatModelCallOptions, BindToolsInput } from "@langchain/core/language_models/chat_models";
import { AIMessageChunk } from "@langchain/core/messages";
import type { BaseMessage } from "@langchain/core/messages";
import type { ChatResult } from "@langchain/core/outputs";
import { HandoffFactsSchema, parseBoundary } from "../src/contracts.ts";

interface OfflineCallOptions extends BaseChatModelCallOptions {
  tools?: BindToolsInput[];
}

// Deliberately replaces only the external model boundary. Not a live AI model.
export class OfflineExampleModel extends BaseChatModel<OfflineCallOptions> {
  constructor() { super({}); }

  _llmType() { return "aster-offline-example"; }

  bindTools(tools: BindToolsInput[]) { return this.withConfig({ tools }); }

  async _generate(messages: BaseMessage[]): Promise<ChatResult> {
    const content = messages.at(-1)?.content;
    if (typeof content !== "string") throw new Error("The offline example expects a JSON input message.");
    const input = JSON.parse(content) as { facts?: unknown };
    const facts = parseBoundary(HandoffFactsSchema, input.facts, "example facts");
    const summaries = {
      "review-for-dispatch": "The supplied record reports sufficient stock. Staff must review and approve before any dispatch.",
      "do-not-dispatch": "The supplied observation reports unavailable or insufficient stock. Do not dispatch from this record; refer to staff.",
      "verify-inventory": "Stock cannot be established from the supplied evidence. Staff must verify the missing facts before approving any dispatch.",
    };
    const { recommendationAction, ...fields } = facts;
    const message = new AIMessageChunk({
      content: "",
      tool_calls: [{
        id: "offline-handoff",
        name: "staff_handoff",
        type: "tool_call",
        args: { ...fields, recommendation: { action: recommendationAction, summary: summaries[recommendationAction] } },
      }],
    });
    return { generations: [{ text: "", message }] };
  }
}
