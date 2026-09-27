# Incident Desk

Incident Desk helps on-call engineers interpret alert batches for a small appointment-booking platform. It should classify the supplied signals, keep observations separate from hypotheses, and prepare material for human incident review. Engineers decide paging, incident status, and production changes.

The fictional `ID-301` batch in `records/` includes elevated booking API errors and latency shortly after a deployment. The timing is relevant context, but it does not prove the deployment caused the alerts. A useful classification should preserve the raw event IDs and explain why the signals warrant review.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider execution, or application test suite. It must not page anyone or alter production systems.

## Project blueprint

- `records/id-301.md` is the source record for the fictional alert batch.
- `src/alert-classification/types.ts` defines bounded raw input and review-result contracts. `id-301-example.ts` transcribes the batch and calls the classifier through `classifyId301(model)`.
- `src/alert-classification/alert-classification.graph.ts` uses LangGraph's Graph API for `normalizeAlerts` → `loadInstructions` → `recommendClassification`. The graph copies raw event IDs from input, derives threshold observations deterministically, loads `classification-instructions.md` from the module directory, and requests a structured model recommendation.
- `src/alert-classification/index.ts` is the public source boundary. `moldea/` owns the project foundation and relationships.

`/docs` is reserved for concise, quickly scannable documentation of essential, durable project concepts and processes. If API or HTTP endpoint documentation is added later, keep it in its established location outside `/docs`.

## Source verification and integration status

Run `npm install` and `npm run typecheck` to check the TypeScript source. The input schema accepts 1 to 32 events per batch. A caller must supply a configured chat model supporting `withStructuredOutput` before invoking `classifyAlertBatch(model, batch)` or `classifyId301(model)`; no provider adapter, credentials, executable service, or live model run is included. The instruction Markdown file must remain alongside the graph module if this source is later packaged or emitted.

The result retains the raw batch and event IDs beside deterministic normalized signals and an unverified model recommendation. Deployment timing is passed as context only. Engineers must verify the recommendation and decide any paging, incident status, or production action themselves. There is no application test suite or deployment integration.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
