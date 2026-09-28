# Event schema rollout note

The planned Beacon staging rollout adds optional `sourceRegion` to `edge-events`. Producers may omit it. Existing event IDs and timestamps retain their meaning.

When reviewing a late-event report near a rollout, record the event's schema version and whether `sourceRegion` is present. Its absence alone is not evidence of schema rejection or quarantine. A checked-in quarantine record for the same event ID would establish a schema rejection; the [shared ingest context](../moldea/context/ingest-lifecycle.md) defines that outcome's place in the lifecycle and its review owner. The timing overlap is context, not proof that the schema change caused late ingest.

This note is for evidence gathering only. It does not authorize a rollback, deployment, or live configuration change.
