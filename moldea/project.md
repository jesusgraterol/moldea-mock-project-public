# Field Notes

Field Notes is a source-only assistant prototype for engineers who support Beacon, a fictional event-ingest platform. It helps them find and summarize relevant checked-in operational notes for the local FN-101 and FN-102 records.

The assistant works from repository files. It does not inspect live systems, run infrastructure commands, change configuration, or restart workers. No service, deployment, credentials, or live provider call is required for this prototype.

The [shared ingest context](context/ingest-lifecycle.md) owns the event lifecycle, evidence checks, and team ownership guidance. The [schema rollout note](../notes/schema-rollout.md) owns the optional `sourceRegion` rollout facts. The [local records](../records/) describe the questions to answer.
