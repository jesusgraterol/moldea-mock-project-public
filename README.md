# Field Notes

Field Notes is a source-only assistant prototype for engineers who support Beacon, a fictional event-ingest platform. It helps staff find and summarize relevant internal operational notes. It does not inspect live systems, run commands, change configuration, restart workers, or trigger infrastructure operations.

The first case, `FN-101`, concerns late events in the staging `edge-events` stream after a planned schema rollout. The supplied notes describe checks and ownership, but they do not establish a cause. The assistant should point engineers to useful notes and distinguish observed facts from possible explanations.

No working service, deployment, credentials, live provider execution, or application test suite is required. Keep source small and plausible, with inspectable instruction loading and invocation paths. Record incomplete integration honestly.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.
