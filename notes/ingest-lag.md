# Event ingest lag note

Applies to Beacon's `edge-events` stream in staging and production. This note helps engineers distinguish source event time from ingest time when a dashboard shows late arrivals.

Record the stream name, sample event IDs, source timestamps, ingest timestamps, and the dashboard observation window. Compare these observations with the read-only queue-lag dashboard before attributing a cause. A delayed dashboard sample alone does not prove queue backlog or customer impact.

The ingest on-call team owns follow-up after evidence is gathered. This note provides no restart, deployment, or configuration procedure.
