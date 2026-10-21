# Quarry Handover

Quarry Handover drafts facilities shift handovers from fictional local records. One filesystem-defined Eve assistant will use one read-only record lookup and one on-demand handover procedure. It only drafts: supervisors review decisions, and it cannot close incidents, assign staff or execute operational actions.

Unresolved reports aged at least 12 elapsed hours require supervisor review. Use supplied report and reference timestamps rather than the machine clock; missing timestamps remain unknown. Retain conflicting same-scope reports with both claims and identifiers until a supervisor resolves them. Do not choose an authority by recency or confidence.

A handover separates observations, unresolved reports, missing facts and supervisor-review items. Keep one root assistant, no subagents, schedules, memory service, external channels, model judge, UI or cloud deployment. Deterministic local checks may use a loopback runtime and a controlled model boundary.

Use Node 24, npm and the exact package versions declared in package.json. Source records and sample requests are fictional and read-only.

## Local use and checks

Install the locked dependencies with `npm ci --ignore-scripts`.

| Command | Purpose |
| --- | --- |
| `npm test` | Deterministic application checks for elapsed-time boundaries, unknown times, conflicting claims, resolved reports and read-only lookup behavior. |
| `npm run typecheck` | Type-check application, agent definitions, evals and scripts. |
| `npm run build` | Build the real Eve application without sandbox prewarming; no sandbox capabilities are exposed. |
| `npm run test:runtime` | Check installed CLI options, discover and build the agent, start the built output on `127.0.0.1`, run installed `eve eval --strict --url …`, then stop its owned process tree and verify the process and listener are gone. |

The root assistant deliberately uses Eve 0.82.0's documented `mockModel` fixture contract. No live provider, model judge, tool stubs or external service is configured. This proves the actual Eve connection and deterministic policy, not the behavior of an untested live model. The fixture accepts a JSON message with `mode` set to `handover` or `lookup`, for example:

```json
{
  "mode": "handover",
  "recordIds": ["QH-101", "QH-102", "QH-103", "QH-104"],
  "referenceAt": "2026-10-20T12:00:00.000Z"
}
```

Use null or omit `referenceAt` when it is unknown. Supplied timestamps must include a timezone. `lookup` reads records without loading the handover procedure; `handover` loads it on demand before the lookup. Missing identifiers are listed, never invented. Differing unresolved same-scope observations are retained as potential conflicts, not automatically reconciled. Future-dated reports retain unknown age and a visible chronology issue.

For the sample above, QH-101 requires review at exactly 12 hours; QH-102 is 11 hours old and remains visible alongside its conflicting claim. QH-103 has unknown age and review eligibility. QH-104 retains its resolved source status and is not an unresolved age-based escalation.

Evals and their configuration live under `evals/`, outside `agent/`. Assertions at the fixture-model boundary inspect the complete canonical system instruction, the actual selected procedure text returned by `eve__skill`, the available tool schema and real lookup results. Eval assertions also inspect the lookup's actual inputs/results and exercise greetings, unrelated requests and prohibited operations. Reports are written by Eve under ignored `.eve/evals/`.

The only HTTP entry point is Eve's standard local protocol. Its fixture channel explicitly permits anonymous requests; supported checks bind it only to loopback, retain process ownership and clean up in `finally`, including after an eval failure. No deployment or externally accessible service is configured. Runtime checks were exercised on Linux; Windows and macOS execution has not been verified.

### Local eval authentication environment

Eve 0.82.0 treats every `eval --url` as a remote target, including a loopback URL. Its [installed target-authentication contract](node_modules/eve/docs/evals/targets.mdx#authentication) documents `EVE_EVAL_AUTH_TOKEN` as an explicit bearer override. The local runtime check sets it to the fixed, **non-secret fixture value** `quarry-handover-local-fixture-not-a-secret` in its child-process environment, overriding any inherited value without using or printing that value. The override applies only to this owned local runtime check; it does not change the parent environment or general build-command defaults.

The pinned client takes the explicit-token branch before ambient Vercel project/deployment discovery, so the check needs no Vercel CLI, credentials, project link, configuration or new service. The token is a test-environment choice, not a credential or a change to the anonymous local channel's access policy. Credential-bearing client requests do not follow redirects. The check only constructs the target from its reserved `127.0.0.1` port and never accepts a remote target URL.

This is a review-assisted correction to the original launcher. Earlier passing runtime runs predated this explicit override and could enter ambient Vercel discovery; actual external access in those runs is **not established**. Their runtime/eval history is retained, not reclassified as proven isolated runs. The correction does not alter the handover policy, source claims or capabilities.

### Same-session continuation: second review-assisted correction

The original fixture selected the first lookup and procedure results by name from the whole retained model history. In one real session, `lookup` of QH-101 at `2026-10-20T12:00:00.000Z` followed by `lookup` of QH-103 with `referenceAt: null` reused the old result and failed before the second lookup. The pre-fix regression reproduced `step.failed` and `turn.failed` with `MODEL_CALL_FAILED`, even though the returned status was `waiting`. Its evidence remains in this workspace under `.eve/evals/2026-10-21T23-35-49/`, with session `wrun_01M5GD4BBE7524SANJWSF0W5WJ`. That failed run is retained alongside the earlier auth-repair history, not replaced by later passing runs.

The correction uses the pinned `eve/evals` model contract: `userMessageCount` identifies the current authored request, explicit `toolCalls[].id` values identify calls emitted for it, and `toolResults[].id` correlates their results. A new request must execute a fresh lookup even when its input exactly repeats an earlier request. Prior procedure text may remain in conversation history, but a handover request's current procedure-load result is checked independently; a later simple lookup does not load the procedure again. No SDK code, tool implementation, source claims or policy were changed.

`evals/continuation.eval.ts` exercises actual `session.send(...)` follow-ups with different selections, changed and null timestamps, exact repeats, lookup-to-handover, repeated handovers, handover-to-lookup, and no-tool replies after tool-using turns. It checks current lookup inputs/results and selected procedure consumption, plus explicit absence of `step.failed`, `turn.failed`, `session.failed` and cancellation events, successful `turn.completed`, and the returned open-session status. A `waiting` status alone is not evidence that a turn succeeded. The first review's non-secret auth override and owned loopback-process cleanup remain in force for these checks.

## Implementation map

- `agent/agent.ts`: one filesystem-defined root; optional default tools and root-copy delegation are disabled.
- `agent/instructions.ts`: imports the [canonical instruction](moldea/agents/quarry-handover/instruction.md) directly at compilation; no instruction mirror.
- `agent/tools/lookup_records.ts`: the only executable tool, registered by filename; `src/records.ts` owns deterministic timestamp calculations and reads the bundled fictional dataset.
- `agent/skills/handover.md`: the single on-demand procedure; its description is a routing hint, not an always-loaded procedure body.
- `evals/fixture-model.ts`: only the external model boundary is controlled; discovery, build, runtime sessions, procedure loading and lookup execution are real.
- `evals/continuation.eval.ts`: real same-session regression for current-request result correlation and explicit turn/step failure detection.

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
