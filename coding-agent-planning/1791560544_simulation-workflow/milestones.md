# Project-run milestones

## Basis and status

This sequence implements [plan.md](./plan.md), SHA-256 `92d352a606c487363ccba120e0bafca0aa95092e922e7d0429a7c809b5dc5a40`. All milestones are approved for autonomous execution. Milestone 1 is implemented with verification passed; scoped review and publication are pending. Milestones 2 and 3 have not started. The private actor home is authenticated using ChatGPT; no actor conversation has started.

The driver checkout and `../moldea-mock-project-public-workflow` are at `19c7bab`, on `main` and `docs/simulation-workflow` respectively. Use the preparation worktree for evidence-tooling implementation. Preserve its two draft script/test edits during planning and inspect them during Milestone 1. Actor worktrees start from `c3ecda12e853b527a96c6ca81150083b0224643a` during authorized execution.

Read this sequence and its revised plan from the driver checkout when implementing in the preparation worktree; these planning edits remain uncommitted here.

These checkpoints support an adaptable process. Product phases, follow-ups, artifacts, batch scope, and documentation detail follow actual results. No turn quota, fixed agent count, universal checklist, or comprehensive guide is required before the pilot. Within an authorized milestone, proceed with routine work without additional approval ceremonies. For each milestone, the developer requires scoped review/fix cycles until clean, followed by exact-path staging/commit and an explicit branch push, then continuation to the next milestone. Preserve unrelated shared work.

## Milestone 1 — Minimal evidence support and pilot preparation

**Objective:** Record truthful fresh adoption and run-declared actor settings; prepare enough guidance for one project.

**Scope:**

- Inspect the two drafts. Replace the global actor policy and run-ID exceptions with validation against each run's `expectedActor`. The batch selects `gpt-6.1-sol` at `xhigh`. Preserve requested/effective settings, deviations, published facts, and unknown evidence.
- Select Skill `v8.1.0` at commit `c2bb924653d5d27943feb5d2103e154ad8131079`. Verify its distribution before execution. Its CLI installation target is `11.0.2`; support ranges are CLI `^11.0.0` and Core `^7.0.0`. Observe the actual closure and skill hash. Upstream releases do not update the batch automatically.
- Author run prerequisites with only the selected skill and exact CLI target. Remove the mandatory Core prerequisite from both `verify` and `validateAttempt`, and remove run-wide Core equality checks. Published prerequisite facts remain intact; add no component-specific compatibility path.
- Keep automatically recorded `hostVersion` metadata and its capture/schema/website representation. Use no Codex version target, pinning, manual monitoring, upgrade check, or host-version drift/readiness rule. Remove the utility's standalone known-host-version completeness requirement. Retain normal native/source/asset integrity; preparation changes no website or sibling skill files.
- Change the installation schema directly for evidenced CLI/Core absence. Permit the initial absent prefix while purpose and adoption authority are established, then use existing per-turn observations, identity logs, checks/input commits, and request checkpoints to verify installation. Add no dedicated establishment record or special last-turn mechanism. Where available observations cannot establish the resulting composition, retain a limitation and incomplete evidence rather than fabricate facts or force an extra actor request.
- Use each attempt's first observation showing CLI/Core installed as its actual baseline. After earlier absence, require the CLI to equal the run's exact installation target; for tooling installed at the start, retain its observed baseline. Later CLI/Core versions/integrities, selected skill ref/hash, and adapter identities match that attempt's baseline exactly. Different Core versions across projects are allowed in one run. Independent review assesses compatibility from existing logs, metadata, and actual checks; add no new required check kind/description or compatibility engine. Permit truthful unadopted/failed absent outcomes without inventing successful adoption.
- Record unexpected repairs in existing failure/intervention/check/limitation fields. Defer the general repair system; do not weaken evidence integrity to classify every unexpected journey as complete.
- Update focused `evidence/README.md` sections with short naming, actor-configuration, observation, capture, and pilot guidance. Defer the full operating guide.
- Define private actor configuration/home and verify effective permissions, network access, approvals, tools/MCP, hooks, skills, personality, and instruction sources. A profile alone is an overlay. Keep personal instructions, driver/audit material, and authentication out of actor seeds and public records.
- Include authentication setup for that same actor home: check `codex login status` with the actor home supplied; if sign-in is needed, the developer runs `codex login` with that home and completes the browser flow. Verify status before the first actor request. Keep credentials private and record only the result or pending user action. Do not assume the separate home is authenticated.

**Likely files:** `scripts/evidence/types.mjs`, `scripts/evidence/evidence.mjs`, affected existing integration tests, and `evidence/README.md`. Capture and website-reader contracts remain intact. No package/dependency or sibling repository change is planned.

**Verification:** Use existing disposable fixtures for run-declared settings/deviations, unavailable native settings, skill/CLI-only run prerequisites, initial absence, installed-at-start observations, adoption after clarifications, first installed baseline, and exact CLI target after absence. Accept two attempts in one synthetic run with different Core versions; reject unexplained Core/CLI/integrity drift within an attempt. Retain automatic host metadata without a version policy or standalone completeness gate. Preserve terminal absence and incomplete status when resulting installation verification is unavailable. Retain source/request/asset/privacy integrity checks; add no compatibility-policy engine, general repair matrix, special last-turn support, or website tests. Run affected tests, then `npm test` and `git diff --check`. Evidence tests invoke no actor, provider, registry, website, or moldea executable.

**Completion checkpoint:** Minimal utility changes pass, project baselines are independent across the run, and automatic capture metadata remains intact. Short operating notes are usable; actor configuration, distribution facts, and authentication result or required developer sign-in are recorded or explicitly pending. Authentication must be verified before the pilot starts. This milestone starts no project conversation and publishes nothing.

## Milestone 2 — One project, independent review, and full replay

**Objective:** Learn from one realistic developer conversation before expanding.

**Dependency:** Minimal preparation is complete and the developer has instructed execution. Select concrete product, run/attempt, branch, and seed identities here.

**Scope:**

- Choose a distinct `xs` agent product built on a real supported SDK. Its scope should exercise activation, unrelated-work silence, maintenance after a meaningful fact/policy change, and canonical instruction loading. Verify actual SDK execution and instruction consumption with a controlled model boundary; distinguish that from live provider execution. Check collisions and use `fixture_<foundation>_xs_<project_slug>_01`. Write a short driver brief with facts, seed provenance, plausible phases, and evidence anchors. Keep future requests and audit criteria outside the actor worktree.
- Prepare the isolated fixture-base worktree and seed checkpoint. Install the pinned project-local skill and use dedicated actor configuration. Verify authentication in that home, completing any required developer browser sign-in before the first request. Observe starting tooling without executing an ineligible installed CLI.
- Start the real conversation with explicit model/effort. Capture after the first turn, reconcile the session ID, and check native requests/settings/tools before dependent follow-ups. Preserve raw history privately; diagnose actual failures without fabricating facts or adding speculative infrastructure.
- Respond to actual questions/results. For adopted projects, use suitable product changes and unrelated work to inspect maintenance and routing/silence. For agent projects, inspect instruction loading, tools/schemas, and file/export relationships using appropriate application checks. Distinguish source checks, controlled model tests, and live provider execution. Require no request quota or repair exercise.
- Preserve requests, source checkpoints, actual checks, observations, failures, interventions, and limitations. Measure compressed/expanded growth at useful checkpoints.
- Write plain-language `observedResult` summaries of each product result and observed moldea activity or abstention, grounded in the trace. Explain the skill's contribution in `observedSummary` and the review handoff too: the website displays per-turn results only when the recording is unavailable, while full replay uses the timeline. Assess whether that presentation is sufficient during pilot replay; further narrative/highlighting is a later focused website task.
- Capture and verify reached source and full conversation. Complete privacy and independent skill review. Establish cause before corrections/retries and preserve the pilot result.
- Include a compact handoff in the existing run review: project purpose, exercised skill behavior, observed outcome, request/event/source anchors, actual checks, findings, and limitations. Add the exact public evidence snapshot commit/run ID, selected attempt IDs, and recording/source/review links as publication and selection are established; keep pending facts explicit. Finalize the snapshot references before requesting a website refresh, without requiring the review to name its own containing commit.
- Under the actual publication/preview instructions, stage reviewed assets and evidence commit, then inspect full replay in an isolated website checkout. Keep the one-session and 8 MiB bounds. Metadata-only preview does not complete this checkpoint.

**Completion checkpoint:** Evidence verification, independent review with its compact handoff, and full replay are complete; findings and required corrections are assessed. The pilot's SDK execution/instruction-loading checks and public explanations have been inspected, with actual limits retained. Handoff publication/selection references are exact or explicitly pending, and finalized before a refresh request. Material unresolved skill/package/runner/publication problems hold expansion. Record a reasoned expansion decision without demanding flawless model behavior or automatically changing instructions.

Component fixes/publication, website source changes, deployed selection, and deployment follow their responsible scope. Preserve full evidence and coordinate focused support if the reader cannot render it.

## Milestone 3 — Document the learned procedure and expand

**Objective:** Make the working process repeatable and apply pilot findings to the remaining projects.

**Dependency:** The pilot supports expansion and the developer has instructed this phase. Adapt details to that evidence; no exhaustive batch or documentation structure is frozen here.

**Scope:**

- Write concise `docs/simulation-workflow.md` and `evidence/scenarios/template.md` from experience. Update README navigation and evidence-contract details. Keep naming in the guide unless a separate `docs/project-naming.md` is useful. Add no unused taxonomy, configurable process, general repair system, or publication service.
- Preserve reusable essentials: family naming/retries; private driver/audit material; actor configuration; actual request/source/check/installation evidence; capture/recovery; independent diagnosis; privacy/assets; full replay; manual attempt choice and website handoff.
- Adapt remaining briefs to complementary product needs, prioritizing actual activation, sustained silence, maintenance, and runtime instruction consumption where appropriate. Retain skill-only, foundation-only, and context-only purposes.
- Conduct authorized conversations with the pinned skill, exact CLI target, and declared actor, preserve evidence, and obtain independent review. Each project records its own Core baseline; a different Core resolution across projects does not require a new run. Component defects require the affected fix published and verified before a fresh retry. Changing selected skill, CLI target, or actor settings receives an explicit run identity. Retain findings and predecessor links.
- Manually select successful attempts from review and application results. Confirm supported website selection displays their IDs; hand unsupported mixtures to its maintainer. Deployment remains separate, and the exact selection needed for rollback is retained.
- Complete the compact handoff section in each publication's existing run review, covering every project's purpose/skill behavior/outcome, evidence anchors/checks/findings/limitations, and exact public snapshot/run/selected-attempt/recording/source references. Use the underlying manifests, Git history, and Release assets; add no handoff schema, registry, or separate file.

**Verification and completion:** Check documentation against actual pilot commands, file targets, and evidence; run `git diff --check`. Reuse passed utility tests unless executable inputs change. Inspect recordings, clear turn/project summaries, and growth at useful checkpoints. Verify the compact run-review handoff's exact public evidence snapshot commit, run ID, selected attempt IDs, review/source/recording links, and limitations before the website refresh request. Make no universal reliability or complete-runtime-coverage claim.

Stop owned previews and remove disposable verification output when finished. Keep unresolved recovery/private evidence until durable storage is confirmed. Preserve these planning files while work is pending; final authorized cleanup leaves durable guidance and removes only completed task planning files.
