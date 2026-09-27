# Incident Desk

Incident Desk helps on-call engineers interpret alert batches for a small appointment-booking platform. It should classify the supplied signals, keep observations separate from hypotheses, and prepare material for human incident review. Engineers decide paging, incident status, and production changes.

The fictional `ID-301` batch in `records/` includes elevated booking API errors and latency shortly after a deployment. The timing is relevant context, but it does not prove the deployment caused the alerts. `ID-302` contains two separate booking API latency readings: Pulse reports milliseconds and a second monitor reports seconds. Their agreement does not prove customer impact or cause. Classifications preserve the raw event IDs and explain why the signals warrant review.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider execution, or application test suite. It must not page anyone or alter production systems.

## Project blueprint

- `records/id-301.md` and `records/id-302.md` are the fictional source records.
- `src/alert-classification/types.ts` defines bounded raw input and review-result contracts. The two example files transcribe their batches and expose `classifyId301(model)` and `classifyId302(model)`.
- `src/alert-classification/alert-classification.graph.ts` uses LangGraph's Graph API for `normalizeAlerts` → `loadInstructions` → `recommendClassification`. The graph retains raw event IDs, converts recognized duration readings and thresholds to milliseconds without merging events, loads `classification-instructions.md` from the module directory, and requests a structured model recommendation.
- `src/alert-classification/index.ts` is the public source boundary. `moldea/` owns the project foundation and relationships.
- `src/alert-briefing/` is a separate Functional API workflow. It sorts source events into a timeline, renders separate normalized observations with raw IDs, carries forward unconfirmed classifier hypotheses and evidence gaps, loads `briefing-instructions.md`, and requests one short model synopsis. `draftAlertBrief(model, classification)` accepts an existing result; `draftId301Brief(model)` and `draftId302Brief(model)` invoke both capabilities.

`/docs` is reserved for concise, quickly scannable documentation of essential, durable project concepts and processes. If API or HTTP endpoint documentation is added later, keep it in its established location outside `/docs`.

## Source verification and integration status

Run `npm install` and `npm run typecheck` to check the TypeScript source. The input schema accepts 1 to 32 events per batch. A caller must supply a configured chat model supporting `withStructuredOutput` before invoking the classifier or briefing workflow; no provider adapter, credentials, executable service, or live model run is included. Both instruction Markdown files must remain alongside their owning source modules if this source is later packaged or emitted.

The classifier result retains the raw batch with original units and event IDs beside deterministic normalized signals and an unverified model recommendation. For ID-302, both latency observations render separately as 2800 ms against 1000 ms in the brief. The briefing workflow makes a second, structured model call for its synopsis; its returned Markdown and `modelOutputStatus` mark model content unverified. Deployment timing is presented as context only, and the engineer-decision section is left pending. Engineers must verify the draft and decide any paging, incident status, or production action themselves. There is no application test suite or deployment integration.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
