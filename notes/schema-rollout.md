# Event schema rollout note

The planned Beacon staging rollout adds optional `sourceRegion` to `edge-events`. Producers may omit it. Existing event IDs and timestamps retain their meaning.

When reviewing a late-event report near a rollout, record the event's schema version and whether `sourceRegion` is present. The timing overlap is context, not proof that the schema change caused late ingest. For parsing ownership and the ingest evidence checks, use the [shared ingest context](../moldea/context/ingest-lifecycle.md).

This note is for evidence gathering only. It does not authorize a rollback, deployment, or live configuration change.
