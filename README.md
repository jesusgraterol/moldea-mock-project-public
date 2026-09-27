# Mesa Help

Mesa Help supports customer conversations for a small home-goods shop. A chat assistant should explain caller-supplied order and parcel facts in plain language, distinguish recorded scans from estimates, and leave refunds, replacements, and carrier changes to staff.

The fictional `MH-204` case in `records/` concerns a lamp shipped in two cartons. The base arrived, while the shade carton has a later estimate and no delivery scan in the available snapshot. The customer asks where the shade is and whether shipping can be refunded. The assistant can explain the known shipment state but cannot decide a refund.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider execution, or application test suite. It does not send a message to a customer or alter an order.

## Project blueprint

- `moldea/project.md` records the project boundary; `moldea/agents/customer-conversation/instruction.md` is the canonical model instruction.
- `src/customer-conversation/types.ts` validates one caller-supplied order snapshot. `instructions.ts` imports the canonical Markdown text, and `customer-conversation.agent.ts` passes it with the snapshot and recent chat messages to Workers AI through `AIChatAgent`, `streamText`, and `workers-ai-provider`. The agent defines no order, refund, or carrier tools.
- `records/mh-204.md` is a fictional example, not a runtime data source. The caller must provide `orderSnapshot` in the chat request body, with `orderId`, `itemDescription`, `capturedAt`, and parcel records matching `OrderSnapshotSchema`.
- `/docs` is reserved for concise, quickly scannable documentation of essential, durable project concepts and processes. Any future API or HTTP endpoint documentation belongs in its established location outside `/docs`.

This source is not a runnable Worker. There is no routing or Durable Object configuration, Workers AI binding, Markdown `Text` module rule, authenticated caller/session boundary, or client. The snapshot is unverified caller input, so integration must establish order authorization and conversation isolation before customer use. No provider call or application test suite has been run. `npm run typecheck` checks only the TypeScript source.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
