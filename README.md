# Aster Dispatch

Aster Dispatch helps a fictional events team review equipment requests. One assistant looks up supplied inventory records and drafts a structured staff handoff. Staff approve every dispatch; the assistant cannot reserve equipment, change inventory, or promise that an item is safe.

## Product facts

Requests needed within 24 hours of the supplied reference timestamp are urgent, including the exact 24-hour boundary. Use supplied UTC timestamps rather than the computer clock. Inventory availability may be available, unavailable, or unknown. Unknown stock or missing observations must stay unknown. A staff handoff separates its recommendation, supporting record identifiers, missing facts, and required staff approval.

The files under data/ are fictional inputs. Treat their record identifiers and observations as evidence; do not invent a newer stock check or a missing item. The assistant has one read-only inventory lookup.

## Local development

Use npm, Node.js 24, and TypeScript. The selected runtime is @langchain/langgraph 1.5.1 with @langchain/core 1.2.20. Use Zod 4.6.5, TypeScript 6.0.3, and @types/node 24.12.0 when adding the corresponding dependencies. Keep exact declarations and the ordinary npm lockfile; disable dependency lifecycle scripts.

Use focused native tests and typechecking. Exercise real SDK and project code with only the external model boundary controlled. The examples require no provider credentials or live model calls, and no operational equipment system is connected.

## Run the small example

```text
npm ci --ignore-scripts
npm test
npm run typecheck
npm run --silent example -- --request request-a
```

Use `request-b` for unknown projector stock or `request-c` for unavailable microphones at exactly 24 hours. The command emits JSON with `schemaVersion: 1`, `modelMode: "offline-example"`, and the handoff. It uses an explicitly labelled offline model stand-in, not a live AI model; the LangGraph graph, SDK structured-output parser, inventory tool, and Zod schemas are real. `--help` describes the command. No credentials are needed, and neither requests nor inventory are written.

## Assistant contract

`createDispatchAssistant({ model, inventory })` in `src/assistant.ts` accepts a LangChain chat model supporting structured output and a supplied inventory snapshot. Call `await assistant.invoke(request)` to get a handoff. The CLI reads the fictional fixtures; callers may supply another validated snapshot without changing the files. No provider is selected or contacted by the example.

The fixed flow is **validate request → one read-only `lookup_inventory` → assess evidence and urgency → draft → validate handoff**. There are no autonomous loops, reservations, dispatch actions, persistent conversation state, or inventory writes. Each invocation has a 30-second deadline and accepts an optional caller `signal`.

The structured handoff has these fields:

| Field | Meaning |
| --- | --- |
| `requestId` | Supplied request identifier. |
| `recommendation.action` | `review-for-dispatch`, `do-not-dispatch`, or `verify-inventory`. |
| `recommendation.summary` | Model-drafted explanation for staff; never an authorization. |
| `supportingInventoryRecordIds` | The matched record ID, or an empty list when absent. |
| `missingFacts` | Explicit unknown or missing inventory evidence. |
| `urgency` | `urgent` when needed in 24 hours or less, including overdue requests; otherwise `routine`. |
| `requiresStaffApproval` | Always `true`; urgency never bypasses approval. |

Unknown availability, absent quantity, missing observation time, or an observation after the supplied reference time requires inventory verification. A missing record is not zero stock. An observed available record with insufficient quantity does not support dispatch. Recommendations describe only the supplied evidence; no freshness threshold or safety guarantee is inferred. Timestamps must be valid ISO UTC values ending in `Z`, and quantities must be positive safe integers. Duplicate inventory IDs and malformed input fail validation.

The model receives canonical instructions from `moldea/agents/equipment-handoff/instruction.md` and the executable handoff schema through the SDK. It drafts the summary and copies the computed facts. Schema violations, changed evidence IDs, omitted missing facts, wrong urgency, inconsistent actions, and approval bypasses fail closed rather than returning a fabricated handoff. Free-text wording remains a draft for human review. Provider failures are propagated; the graph adds no synthetic fallback or retry loop. Provider-level behavior remains caller-owned.

The native tests execute the real graph, lookup, and schemas. Only the external chat-model generation boundary is controlled. They cover the three fixture cases, the exact urgency boundary and adjacent milliseconds, missing and future observations, insufficient stock, absent records, malformed input, forged output, instruction/schema consumption, and a CLI run from another working directory.

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
