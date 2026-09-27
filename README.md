# Mesa Help

Mesa Help supports customer conversations and a separate staff follow-up workflow for a small home-goods shop. The customer-facing assistant should explain caller-supplied order and parcel facts in plain language, distinguish recorded scans from estimates, and leave refunds, replacements, and carrier changes to staff.

The fictional `MH-204` case in `records/` concerns a lamp shipped in two cartons. The base arrived, while the shade carton has a later estimate and no delivery scan in the available snapshot. The customer asks where the shade is and whether shipping can be refunded. The assistant can explain the known shipment state but cannot decide a refund.

The fictional `MH-205` case concerns staff follow-up after the shade's September 29 estimate has passed by the October 1 snapshot. The customer reports the shade missing and asks about a replacement or shipping refund. The staff-facing assistant prepares a routing note for review without approving either request.

The fictional `MH-206` case has a September 30 carrier delivery scan for the shade, but the customer still reports it missing on October 1 and asks for a replacement. The scan is not proof of customer receipt; the conflicting facts warrant staff case triage.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider execution, or application test suite. It does not send a message to a customer or alter an order.

## Project blueprint

- `moldea/project.md` records the project boundary; `moldea/agents/customer-conversation/instruction.md` is the canonical model instruction.
- `src/customer-conversation/types.ts` validates one caller-supplied order snapshot. `instructions.ts` imports the canonical Markdown text, and `customer-conversation.agent.ts` passes it with the snapshot and recent chat messages to Workers AI through `AIChatAgent`, `streamText`, and `workers-ai-provider`. The agent defines no order, refund, or carrier tools.
- `records/mh-204.md` is a fictional example, not a runtime data source. The caller must provide `orderSnapshot` in the chat request body, with `orderId`, `itemDescription`, `capturedAt`, and parcel records matching `OrderSnapshotSchema`.
- `records/mh-205.md` and `records/mh-206.md` are fictional staff cases. `src/staff-review/case-facts.ts` holds their small local fact catalog; `routing-policy.ts` produces a structured note with recorded scans, the customer report, unresolved questions, requests for staff, and a prototype queue recommendation. `tools.ts` exposes only a read-only `lookupRoutingNote` tool for those case IDs. `StaffReviewAgent` uses Think's chat loop, loads its own canonical instruction, and restricts model-visible tools to that lookup rather than computing a note before every turn. The tool result is the staff-reviewable note. The local policy recommends `parcel-investigation` when an estimate has passed without a delivery scan, `shipment-support` for other missing-parcel reports, or `case-triage` when a delivery scan conflicts with the report. These identifiers are not connected to real queues.
- `/docs` is reserved for concise, quickly scannable documentation of essential, durable project concepts and processes. Any future API or HTTP endpoint documentation belongs in its established location outside `/docs`.

This source is not a runnable Worker. There is no routing or Durable Object configuration, Workers AI binding, Markdown `Text` module rule, authenticated caller or staff session boundary, or client. The customer snapshot is unverified input, and the staff lookup contains only fictional cases; integration must establish order authorization, staff access, conversation isolation, actual queue mapping, and live verification of Think's tool restrictions before use. No provider call or application test suite has been run. `npm run typecheck` checks only the TypeScript source.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.
Installed skill: `v6.0.0` at `.agents/skills/moldea/`. Actor session: `01a0e425-7b70-7561-95ba-91cdd5b0dc66`.

Observed stopping point: the adopted project has an `AIChatAgent` customer conversation and a separate Think staff review with a read-only local routing lookup. MH-206 refined the staff route for a delivery-scan/customer-report conflict. Typechecking, focused local case checks, and Moldea validation passed; live tool restrictions, provider output, Worker integration, and staff access were not verified.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
