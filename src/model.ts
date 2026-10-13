import type { AIMessage, BaseMessage } from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";
import type { createLookupTool } from "./lookup.js";
import type { ModelResponseSchema } from "./schemas.js";

interface ModelInvoker<T> {
  invoke(messages: BaseMessage[], config?: RunnableConfig): Promise<T>;
}

// The only injected boundary. These are the LangChain chat-model attachment
// methods; no provider, credentials, internal loader, or tool is substituted.
export interface StaffModel {
  bindTools(tools: ReturnType<typeof createLookupTool>[]): ModelInvoker<AIMessage>;
  withStructuredOutput(schema: typeof ModelResponseSchema): ModelInvoker<unknown>;
}
