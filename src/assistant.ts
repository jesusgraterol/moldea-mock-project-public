import { AIMessage, HumanMessage, SystemMessage, ToolMessage, type BaseMessage } from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";
import { Annotation, END, START, StateGraph, messagesStateReducer } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AssistantError } from "./errors.js";
import { loadStaffInstruction } from "./instructions.js";
import { createLookupTool } from "./lookup.js";
import type { StaffModel } from "./model.js";
import { groundResponse } from "./response.js";
import { LookupInputSchema, LookupResultSchema, ModelResponseSchema, QuestionSchema, type StaffResponse } from "./schemas.js";

const Input = Annotation.Root({ question: Annotation<string>() });
const Output = Annotation.Root({ response: Annotation<StaffResponse>() });
const State = Annotation.Root({
  ...Input.spec,
  ...Output.spec,
  messages: Annotation<BaseMessage[]>({ reducer: messagesStateReducer, default: () => [] }),
});

export function createStaffAssistant(model: StaffModel) {
  const lookupTool = createLookupTool();
  const selectingModel = model.bindTools([lookupTool]);
  const answeringModel = model.withStructuredOutput(ModelResponseSchema);

  const prepare = async (state: typeof State.State) => {
    const { question } = QuestionSchema.parse({ question: state.question });
    return { messages: [new SystemMessage(await loadStaffInstruction()), new HumanMessage(question)] };
  };

  const select = async (state: typeof State.State, config: RunnableConfig) => {
    let message: AIMessage;
    try {
      message = await selectingModel.invoke(state.messages, config);
    } catch {
      throw new AssistantError("MODEL_UNAVAILABLE", "Model selection failed; no answer was generated.");
    }
    if (!(message instanceof AIMessage) || message.invalid_tool_calls?.length) {
      throw new AssistantError("INVALID_TOOL_CALL", "Model returned an invalid lookup request; no tool was executed.");
    }
    const calls = message.tool_calls ?? [];
    if (calls.length > 1 || calls.some((call) => call.name !== lookupTool.name || !call.id || !LookupInputSchema.safeParse(call.args).success)) {
      throw new AssistantError("INVALID_TOOL_CALL", "Only one schema-valid read-only lookup is permitted; no tool was executed.");
    }
    // Model-authored selection prose is not propagated or rendered as an answer.
    return { messages: [new AIMessage({ content: "", tool_calls: calls })] };
  };

  const answer = async (state: typeof State.State, config: RunnableConfig) => {
    const resultMessage = state.messages.find((message) => message instanceof ToolMessage);
    const lookup = resultMessage instanceof ToolMessage
      ? LookupResultSchema.parse(JSON.parse(String(resultMessage.content))) : null;
    let value: unknown;
    try {
      value = await answeringModel.invoke(state.messages, config);
    } catch {
      throw new AssistantError("MODEL_UNAVAILABLE", "Structured model response failed; no answer was generated.");
    }
    return { response: groundResponse(value, lookup) };
  };

  return new StateGraph({ stateSchema: State, input: Input, output: Output })
    .addNode("prepare", prepare)
    .addNode("select", select)
    .addNode("lookup", new ToolNode([lookupTool], { handleToolErrors: false }))
    .addNode("answer", answer)
    .addEdge(START, "prepare")
    .addEdge("prepare", "select")
    .addConditionalEdges("select", (state) => {
      const last = state.messages.at(-1);
      return last instanceof AIMessage && last.tool_calls?.length ? "lookup" : "answer";
    }, { lookup: "lookup", answer: "answer" })
    .addEdge("lookup", "answer")
    .addEdge("answer", END)
    .compile();
}
