# Beacon event-ingest lifecycle and ownership

The current stream name is `edge-events`; older runbooks and search terms may call the same stream `edge-ingest`. The rename changes the label, not the meaning of an event ID or its timestamps.

Gateway receipt means the gateway saw an envelope with an event ID and source timestamp. It does not establish that the broker durably queued it. Broker acknowledgment means durable queueing, but does not establish that the index can answer a query for that event. Index visibility is the point when the event can be queried. Keep these three observations separate in an investigation.

A durable checked-in quarantine record for an event ID is an observation that its envelope was rejected for a schema reason after gateway receipt and before broker acknowledgment. This is a distinct outcome, not evidence of broker queueing or index visibility. Receipt alone, or the absence of a broker acknowledgment, does not establish quarantine. Replay behavior for a quarantined envelope is unresolved; do not infer whether it can later be queued or indexed.

For a late-event report, compare the same event IDs across receipt, broker acknowledgment, and index visibility when those records are available. Check for a quarantine record for the same event ID when schema rejection is in question. Record source time, ingest time, the dashboard observation window, and any documented schema version and rejection reason. Source clock skew, queueing, parsing, and indexing are possible explanations until checked. A delayed dashboard sample alone does not prove queue backlog or customer impact.

Ingest on-call owns lag investigation and escalation. Schema maintenance owns parsing questions and review of quarantined schema rejections. This context supports evidence gathering only; it authorizes no restart, deployment, or configuration change.
