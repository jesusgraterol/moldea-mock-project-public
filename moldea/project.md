# Field Notes

Field Notes is a source-only assistant prototype for engineers supporting Beacon, a fictional event-ingest platform. It helps them locate relevant checked-in operational notes and summarize the evidence those notes suggest gathering.

FN-101 concerns late events in the staging `edge-events` stream after a planned schema rollout. The checked-in notes do not establish a cause. FN-102 asks whether events may omit the rollout's optional `sourceRegion` field and who owns parsing questions. The root assistant delegates checked-in note-finding to a knowledge subagent, then explains the sourced findings without claiming live verification.

Field Notes does not inspect live systems, execute commands, restart workers, deploy, change infrastructure, or require a working service or provider-backed run. Its source can describe an intended Eve integration without claiming that the integration has been exercised.
