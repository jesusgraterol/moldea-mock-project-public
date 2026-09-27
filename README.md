# Store Guide

Store Guide is a source-only assistant prototype for a fictional commuter-bag shop. Shoppers ask which bag fits their carry and weather needs; staff want recommendations grounded in the product catalog rather than invented features or availability.

The first request is `SG-101`: a shopper cycles to work with a 16-inch laptop and sometimes rides in rain. Product facts live in `records/catalog.md`; the shopper note is in `records/sg-101.md`. The guide should help the shopper narrow the options, while staff remain responsible for sales and product claims. It must not add items to a cart or place or change an order.

This is a source-only prototype. No working service, deployment, credentials, live provider execution, or application test suite is required. Keep source small and plausible, with inspectable instruction loading and invocation paths. Record incomplete integration honestly.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

## Project blueprint

- `records/` owns the SG-101 shopper note and the shop's local catalog snapshot.
- `moldea/` owns project context, the Store Guide instruction, and runtime relationships.
- `src/store-guide/catalog.ts` reads the catalog and selects rows whose listed sleeve supports a 16-inch laptop; `store-guide.agent.ts` loads the canonical instruction and registers the read-only lookup with a Vercel AI SDK `ToolLoopAgent`; `sg-101.ts` shows the intended invocation.
- `package.json` pins direct dependencies and exposes `npm run typecheck`. There is no application test suite, service, or run script.

`/docs` is reserved for concise, quickly scannable documentation of essential, durable project concepts and processes. API and HTTP endpoint documentation, if introduced later, belongs in its established location outside `/docs`.

This source has no host, configured model credentials, or live provider verification. `runSg101` is an exported example boundary, not a runnable shopper service. The source-relative file URLs assume this repository layout; packaging or deployment would require an explicit asset-loading decision. The catalog is a small local fixture, not a stock or pricing feed.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
