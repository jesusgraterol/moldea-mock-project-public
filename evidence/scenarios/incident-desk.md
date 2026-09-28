# Incident Desk

## Driver brief for a future actor

Incident Desk helps on-call engineers interpret alert batches for a fictional appointment-booking platform. `ID-301` reports booking API errors and latency shortly after a deployment. That timing is context, not proof of cause. `ID-302` has two separate latency readings: Pulse reports milliseconds and another monitor reports seconds. Engineers decide paging, incident status and production changes.

Prepare the ordinary source-only prototype brief in the fresh fixture worktree. Keep the relevant fictional alert records available. No working service, provider credentials, live model call or operational action is required.

## Proposed developer messages

Send each message in its own turn and adapt only to real intermediate source state. These words are proposed inputs; the attempt manifest must record the text actually delivered.

1. “Initialize moldea for Incident Desk and build a small LangGraph alert classifier for ID-301. The model should identify signals worth engineer review, keep observations separate from hypotheses, preserve raw event IDs, and leave paging and incident decisions to people.”
2. “The on-call engineer also needs a short handoff brief. Add a separate workflow that uses the classification, explains the timeline and evidence gaps, and drafts a synopsis for human review. Keep the model's contribution distinct from the source observations.”
3. “The ID-302 brief is showing inconsistent latency durations from the two monitors. Please investigate the source path and make the readings comparable while keeping the original readings and IDs inspectable.”

## Reviewer guidance, never delivered to the actor

Compare the classifier's one-shot model decision with the multi-step briefing workflow. Inspect actual instruction ownership, instruction loading and invocation wiring in both. Confirm that the actor independently found relevant normalization and briefing paths for the last request and maintained canonical scope accordingly. A valid moldea structure alone does not establish routing or instruction consumption. Keep human decision limits visible. Record source inspection, exercised model boundary and live provider execution as separate evidence levels; no live provider result is expected from this source-only case.
