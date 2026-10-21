# Equipment-handoff LangGraph connection

`createDispatchAssistant` in `src/assistant.ts` defines the single assistant with `@langchain/langgraph` 1.5.1 and `@langchain/core` 1.2.20. It compiles a fixed lookup → draft-handoff → validate graph, without a checkpointer or operational dispatch capability.

`loadDispatchInstruction` reads the canonical instruction file directly, relative to the module rather than the caller's working directory. Each model invocation uses that exact text as its system message. The description documents the general responsibility; it is not routing-facing metadata. No transfer router or handoff-description asset is needed.

The graph invokes the real `lookup_inventory` structured tool once, deterministically, before the model. The tool is not an optional model-selected operation. Its validated snapshot is read-only, and returned records are isolated copies. `assessRequest` derives the handoff facts from the supplied timestamps and record.

The injected LangChain chat model receives `HandoffSchema` through `withStructuredOutput`. With the base SDK implementation this is a `staff_handoff` response-format function, not a second operational capability. The model drafts the summary and reproduces the supplied facts. The graph then validates the actual response with Zod and checks evidence, missing facts, action, request ID, and urgency against the deterministic assessment.

The CLI's `OfflineExampleModel` and the tests replace only external model generation. Focused tests exercise the real SDK binding and parser, graph, tool, schemas, and canonical loader, and inspect the instruction and schema reaching that boundary. No live-provider behavior is asserted or required for the offline example. An injected live chat model must support structured output; its provider configuration remains caller-owned.
