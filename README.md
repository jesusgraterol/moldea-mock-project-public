# Case Router

Case Router helps support staff at a small appointment-scheduling company decide which queue should review a customer request. Staff currently use account access, billing review, privacy review, and product help queues. A recommendation should name the queue and explain the evidence from the supplied request without deciding a billing dispute or approving deletion.

The fictional `CR-118` request in `records/` concerns two renewal receipts for one organization subscription. The customer asks whether they were charged twice. Support needs a short routing recommendation, while billing staff verify the ledger and decide any correction.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider calls, or application test suite. No ticket is routed automatically by this repository.

## Project blueprint

- `src/case-router/` owns the caller-facing `recommendQueue` function, input and output schemas, the LangChain `createAgent` configuration, and the canonical instruction loader.
- `moldea/` owns the project context and queue-recommender instruction. The source loader reads that instruction from the checkout before the agent is invoked.
- `records/cr-118.md` is the fictional billing example, not a verified payment record or a default input.
- `/docs` is reserved for concise, scannable documentation of essential, durable concepts and processes. API and HTTP endpoint documentation belongs in its established location outside `/docs`.

Run `npm run typecheck` to check the TypeScript source. This prototype has no service, ticket integration, application test suite, credentials, deployment, or live provider verification. A later integration would need to supply provider credentials, exercise the invocation path, and keep staff responsible for billing and deletion decisions.

The selected OpenAI model would receive the supplied request during a live invocation, so real customer-data use also requires a privacy review.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
