# Lantern Loans LangGraph connection

## Invocation and maintained instruction

`createStaffAssistant` in `src/assistant.ts` returns a real compiled
`@langchain/langgraph` StateGraph. Each invocation takes `{ question }` and
returns only `{ response }`; internal model messages are not part of its output.
The fixed flow is prepare, model selection, an optional lookup, and structured
model response with deterministic grounding. There are two model invocations,
at most one lookup, no agent loop, and no checkpointer or persistent memory.

`loadStaffInstruction` reads `moldea/agents/staff-assistant/instruction.md` at
the start of every question. The unchanged file becomes a SystemMessage in
both model requests. The HumanMessage contains the current staff question;
there is no separately maintained inline policy or instruction mirror.
Source and compiled modules resolve assets relative to their module URLs,
not the working directory. The current `src/` to `dist/` build layout keeps
those paths valid; the canonical instruction and data must remain alongside
the compiled application in this local repository.

## Model and schema boundary

`StaffModel` in `src/model.ts` is the sole injected boundary. It exposes the
LangChain chat-model attachment methods `bindTools` and `withStructuredOutput`
and their invocation contracts. No provider implementation, credentials, or
live model call is included. The defining runtime is LangGraph, not the
transport used by a future model implementation.

Selection binds the actual `createLookupTool()` result, including its
executable `LookupInputSchema`. A real ToolNode invokes that same registered
tool and transports its validated JSON result as a ToolMessage with the call
ID. Unknown tool names, malformed arguments, and multiple calls fail before
the node runs. Tool failures stop the graph rather than becoming invented
inventory evidence.

The second model invocation attaches the actual `ModelResponseSchema` through
`withStructuredOutput`. The application parses the returned value again and
compares every record field, source, and lookup status with the real tool
evidence. Unknown availability and ambiguous or absent matches require their
missing-fact flags. Other supported flags identify unsupplied due dates or
policy details. Fixed literals enforce seven days, staff approval, information
only, and no safety assessment. Extra fields and unrestricted prose fail
validation. `formatStaffResponse` renders explanations from those verified
fields, not raw model prose.

The tool's runtime description is model-facing selection guidance: it explains
when and how to look up a tool. The canonical agent description is general
responsibility documentation, not a routing prompt. There is no handoff or
separate routing-description consumer.

## Data, permissions, and failure

`data/tools.json` owns the fictional record facts. Lookup reads this fixed path,
validates records and unique IDs, matches exact IDs or names before name
substrings, and preserves ambiguous or unknown results. A query is never a
filesystem path. No database, reservation, loan writer, safety assessment,
external lookup, or loan-approval operation is available, even after staff
approval. All loan decisions and operations stay outside the assistant.

Invalid requests, unavailable instructions or records, invalid model calls,
schema or grounding failures, and model failures reject the invocation without
an answer. Model-failure messages omit provider error details. Callers should
ask staff to confirm manually rather than inventing a fallback fact.

## Connection evidence and limits

`test/assistant.test.mjs`, run by `npm test`, imports the built application and
invokes the compiled graph. Only a controlled model implementation is
substituted. Tests capture both model requests, compare their system content
with the maintained instruction file, inspect the actual bound lookup and
output schemas, and verify real ToolNode results from disk. They also exercise
unknown availability, ambiguity, missing records, authority violations,
fabricated facts, failures, request isolation, and loading from another cwd.

This establishes the application connection under the controlled model
boundary. It does not establish live-provider compatibility, natural-language
classification quality, or production readiness; those are outside this slice.
