# Lantern Loans

A small staff-facing TypeScript and LangGraph assistant for a community tool library.

Use npm and Node.js 24 or newer. Keep the product local, with fictional checked-in records and no provider credentials. Staff make every loan decision.

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->

## Local first slice

One model-coordinated TypeScript/LangGraph workflow answers staff questions
using four fictional records in `data/tools.json`, including a ladder whose
availability is unknown. It has exactly one read-only capability, `lookup_tool`.
No database, UI, reservations, loan writes, approval action, persistent memory,
provider credentials, or live-provider integration is included.

The model selects a lookup and returns structured facts. The application
validates those facts against the actual lookup result, preserves unknown and
ambiguous information, and renders staff explanations from verified fields.
The standard loan period is fourteen days; staff approve every loan.
Availability is never presented as a safety assurance.

### Build and verify

Use Node.js 24 or newer and npm:

```sh
npm ci --ignore-scripts
npm test
```

`npm test` builds the application and invokes the real compiled LangGraph in
Node's test runner. It replaces only the model boundary: instruction loading,
tool registration and schema attachment, ToolNode execution, disk-backed
records, and output validation all use the actual application path. The tests
assert that both model requests receive the exact maintained instruction and
that the model receives the executable lookup and response schemas. They also
verify unknown availability, ambiguity, fabricated-fact rejection, prohibited
actions, model failures, request isolation, and unchanged records. No API key
is needed and no provider is called.

### Application entry point

```ts
import { createStaffAssistant } from "./dist/assistant.js";
import { formatStaffResponse } from "./dist/response.js";

// Supply a model implementing StaffModel's bindTools / withStructuredOutput
// contract. There is no default provider or hidden credential discovery.
const graph = createStaffAssistant(model);
const { response } = await graph.invoke({ question: "Is the Step Ladder available?" });
console.log(formatStaffResponse(response));
```

`model` is an explicitly supplied boundary, not a shipped global. The controlled
implementation used for local verification lives only in the tests. The API
returns `{ response }` with request type, recorded tool facts and sources,
lookup status, missing-fact flags, the fourteen-day period, and fixed authority
fields. Raw model messages are not returned. Invalid or ungrounded model
output rejects the invocation; callers must not replace it with guessed facts.

The [maintained instruction](moldea/agents/staff-assistant/instruction.md) is
loaded from disk for each question. See the
[runtime connection](moldea/runtimes/langgraph.md) for the exact path and the
limits of controlled-model verification. Keep `data/` and `moldea/` alongside
the compiled `dist/` directory when running this local application.
