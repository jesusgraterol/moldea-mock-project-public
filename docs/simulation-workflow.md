# Developer project runs

Use realistic product conversations to inspect what the published skill does across a project. Start with one reviewed, replayed pilot, then choose complementary projects from what it reveals. This is an operating guide, not a fixed SDK matrix, turn quota or universal grading checklist.

## Prepare a project

Read the [evidence contract](../evidence/README.md) and copy the [scenario template](../evidence/scenarios/template.md). Keep the brief, future requests and audit material outside the actor worktree. Choose a distinct product title, scenario ID and branch before writing files; check existing branches, the gallery and evidence index for collisions.

Use `fixture_<foundation>_xs_<project_slug>_01` for a fresh family, lowercase ASCII within 64 characters. The foundation identifies the actual SDK or purpose, such as `langgraph`, `skill_only`, `foundation_only` or `context_only`. A fresh retry increments the final number and records its predecessor and reason. Product follow-ups and genuine conversation continuation remain in the existing attempt.

Create an isolated worktree from `c3ecda12e853b527a96c6ca81150083b0224643a`. Seed only ordinary product facts/conventions and the selected project-local distribution. Select immutable Skill, installer, exact CLI target, and requested actor settings from the approved run setup/scenario definitions; actual run prerequisites and observations belong in its manifest after a real session exists. Do not infer a new run's selection from this guide's historical examples.

Historical example: `run-20261013-01` selected Skill `v8.1.0`, resolving to `c2bb924653d5d27943feb5d2103e154ad8131079`, and CLI `11.0.2`. Its project-local installation command was:

```sh
env CODEX_HOME=<private-actor-home> npm exec --yes --package=skills -- skills add moldea-ai/skill#v8.1.0 --skill moldea --agent codex --yes
```

Verify the immutable release and installed distribution bytes, then make an exact-path signed driver seed checkpoint. Record the fixture base, seed SHA and method/content hash. Do not seed CLI/Core when the conversation is meant to establish fresh adoption; inspect root manifest, lockfile and installed package metadata inertly before the first request. Absence needs evidence, not inference from the resulting lockfile.

Use a dedicated private Codex home, explicit model/effort and deliberate permissions, approvals, network, personality, skills, MCP/hooks and instruction sources. A profile overlays personal configuration. Verify authentication in that same home before starting; the developer completes browser sign-in when needed. Keep authentication private. Inspect actual host-provided instruction/catalog inputs too: a separate home did not prevent bundled plugin catalogs from appearing or changing during the pilot. Configuration isolation is not filesystem isolation.

The `run-20261013-01` pilot used `gpt-6.1-sol`/`xhigh`, workspace-write with network, approvals never, personality none, no configured MCP/hooks and a disabled personal discovery helper. Its default npm cache was read-only; the actor recovered with a disposable writable cache. Later seeds can deliberately supply a private writable npm cache, recording that choice. Automatically captured host-version metadata is provenance; it has no target or readiness rule.

## Conduct and capture

Deliver only the current natural product request on stdin. Keep the native conversation and operational output private. For example:

```sh
env CODEX_HOME=<private-actor-home> codex exec --strict-config --cd <actor-worktree> --model gpt-6.1-sol -c 'model_reasoning_effort="xhigh"' --json -o <private-response-file> - < <private-request-file>
```

Record the emitted thread ID and locate that exact native JSONL. Capture after its first real turn, before dependent follow-ups, and reconcile requests, effective settings, tools and source references. Execution-event stdout is useful operational output but does not replace native history. Use fresh private capture names and preserve raw history when diagnosing a failure.

Resume the recorded session explicitly from its actor worktree:

```sh
env CODEX_HOME=<private-actor-home> codex exec resume --strict-config --model gpt-6.1-sol -c 'model_reasoning_effort="xhigh"' --json -o <private-response-file> <session-id> - < <private-request-file>
```

Respond to actual questions and results. Meaningful product corrections and unrelated ordinary requests help inspect maintenance and silence; they are not a required number or identical script. For real agent projects, separate source wiring, file/export validation, actual SDK execution with a controlled model boundary, and live provider behavior.

Before each request, observe actual skill/CLI/Core/adapters using inert metadata. Preserve one chronological observation at every native turn-context ordinal, including repeated contexts. An initial absent prefix is valid. The first fully installed composition establishes that project's baseline; after absence, its CLI must match the exact target. Later observations match that project's baseline. Different projects may resolve different Core versions; the independent reviewer assesses compatibility. An unadopted skill-only project can truthfully remain absent. Missing resulting observations remain limitations, without manufacturing another turn.

Preserve exact delivered wording, native request/settings locators, before/after SHAs, actual checks/input SHAs and clear per-turn results. Checkpoint actor changes by exact paths without repairing the result. Record host checkpoints separately from actor commits. Keep failures and any assistance in existing failure/intervention/limitation fields; diagnose before a fresh retry.

## Review, publish and replay

Follow the capture/redaction commands and strict records in the [evidence contract](../evidence/README.md). Review all proposed copies: source history including seeds, records/prose, decompressed session content, auxiliary logs and diagnostics. Keep raw sessions, sidecars, rules and credentials private. Preserve shareable instructions and record every redaction by locator without its removed value.

If the actor delegates a check, retain the actual call, lifecycle and returned message in the parent export. Keep separate child history private and describe the export's boundary. An encrypted native delegation prompt needs an explicit redaction and limitation. Do not turn an actor-reported informal check into an independently executed test claim.

Obtain independent source/skill-behavior review. Use real checks and precise request/event/commit anchors; do not assign package blame from a lone model mistake. Keep actor outcome, evidence completeness and review status independent. Repair confirmed defects within authorized scope, retain the original evidence, and review corrections until clean.

Publish reviewed source/small records in Git and sanitized full sessions/identity logs as Release assets. Use exact-path staging and commits, signed with sign-off; push the explicit branch without force or tag-following. Download proposed assets and verify sizes/hashes against the manifests. Preserve published assets; use distinct names for subsequent evidence instead of overwriting a recording.

Full replay uses a public immutable evidence snapshot and a private selection JSON; local-record preview omits recordings. In an isolated skill-repository checkout with the required reader support:

```sh
node website/scripts/generate-development.ts --project-runs-selection <private-selection-json>
npm exec --workspace website -- astro dev --host 127.0.0.1 --port <owned-port> --strictPort
```

The selection is `{ "run": { "commit": "<public-sha>", "runId": "<run-id>" }, "history": [] }`, adding intentional history when needed. Keep the one-session-per-attempt and 8 MiB metadata/compressed/expanded bounds. Measure actual sizes; do not trim meaningful work to meet a quota. The pilot required reader support for interleaved calls/results and inline web completions. An inline completion is one retained event. Check complete coverage, tool input/result text, key dialogs, summaries and exact source/recording/review links in the browser.

Stop owned previews before tests or regeneration replace the generated model. The installed Astro command used here starts a background server and reports its PID; stop that checkout's owned server with `npm exec --workspace website -- astro dev stop` and verify the result. Preserve unresolved private recovery material; remove only task-owned disposable output after it is no longer needed.

## Select and hand off

Expand only after assessing the pilot's source, independent review, privacy/integrity and full replay. Choose complementary briefs; retain skill-only, foundation-only and context-only purposes without treating them as agent runtimes. The pilot's controlled LangGraph tests do not qualify other SDKs or live providers.

Manually select successful attempts from their reviewed outcomes. Put a compact handoff in the existing run review: each project's purpose, exercised behavior and outcome; request/event/source anchors; actual checks/findings/limits; exact public snapshot/run/selected IDs and recording/source/review links. Retain the exact website rollback selection. A review need not name its own containing commit; finalize the chosen snapshot before requesting a refresh. Deployment and deployed selection remain separate work.
