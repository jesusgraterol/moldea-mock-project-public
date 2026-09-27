# Incident Desk

Incident Desk helps on-call engineers interpret alert batches for a small appointment-booking platform. It should classify the supplied signals, keep observations separate from hypotheses, and prepare material for human incident review. Engineers decide paging, incident status, and production changes.

The fictional `ID-301` batch in `records/` includes elevated booking API errors and latency shortly after a deployment. The timing is relevant context, but it does not prove the deployment caused the alerts. A useful classification should preserve the raw event IDs and explain why the signals warrant review.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider execution, or application test suite. It must not page anyone or alter production systems.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.
