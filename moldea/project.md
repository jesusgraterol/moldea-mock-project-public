# Field Notes

Field Notes is a source-only assistant prototype for engineers supporting Beacon, a fictional event-ingest platform. It helps them locate relevant checked-in operational notes and summarize the evidence those notes suggest gathering.

The initial FN-101 case concerns late events in the staging `edge-events` stream after a planned schema rollout. The checked-in notes do not establish a cause. The assistant must separate the report from possible explanations and identify the appropriate follow-up owners.

Field Notes does not inspect live systems, execute commands, restart workers, deploy, change infrastructure, or require a working service or provider-backed run. Its source can describe an intended Eve integration without claiming that the integration has been exercised.
