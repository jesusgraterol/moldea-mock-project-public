# Beacon event-ingest lifecycle

The current stream name is `edge-events`; older runbooks and search terms may call the same stream `edge-ingest`. The rename changes the label, not the meaning of an event ID or its timestamps.

Gateway receipt means the gateway saw an envelope with an event ID and source timestamp. It does not establish that the broker durably queued it. Broker acknowledgment means durable queueing, but does not establish that the index can answer a query for that event. Index visibility is the point when the event can be queried. Keep these three observations separate in an investigation.

For a late-event report, compare the same event IDs across receipt, broker acknowledgment, and index visibility when those records are available. Record source time, ingest time, and the dashboard observation window. Source clock skew, queueing, parsing, and indexing are possible explanations until checked. A delayed dashboard sample alone does not prove queue backlog or customer impact.

Ingest on-call owns lag investigation and escalation. Schema maintenance owns parsing questions. This note supports evidence gathering only; it authorizes no restart, deployment, or configuration change.
