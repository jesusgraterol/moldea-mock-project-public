# Incident Desk

Incident Desk helps on-call engineers interpret alert batches for a fictional appointment-booking platform. The prototype should classify supplied signals and prepare material for human incident review. Engineers decide paging, incident status, and production changes.

The checked-in records describe `ID-301`, a booking API error and latency batch shortly after a deployment, and `ID-302`, two latency readings from different monitors. Deployment timing is context, not a confirmed cause. Keep raw event IDs and observations available for inspection.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider call, or operational action.

The classifier is in `src/alert-classifier.ts`. It exports `alertClassifierGraph` and `classifyAlertBatch(batch, reviewModel)`. Pass a model with `withStructuredOutput(schema).invoke(messages)` to the wrapper; `fixtures/id-301.json` is a sample batch. The graph returns raw events, threshold observations, event IDs selected for engineer review, and explicitly unverified hypothesis questions. Run `npm test` for the local fixture checks; no provider is called.

The separate `src/handoff-brief.ts` workflow exports `handoffBriefGraph` and `draftHandoffBrief(classification, synopsisModel)`. Pass the classifier result and another structured model. Its brief keeps the timestamped source timeline, observations, evidence gaps, and classification apart from the model-drafted synopsis. The brief requires human review and performs no operational action.

For `ID-302`, `fixtures/id-302.json` retains both monitor events. The classifier adds comparable millisecond durations to each observation while retaining the original values, units, thresholds, and event IDs in `rawEvents`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
