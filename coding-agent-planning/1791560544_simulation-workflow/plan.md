# Developer project runs: prepare, learn from one project, then expand

## Objective and scope

Conduct realistic developer conversations using the published moldea skill, preserve what actually happens, obtain independent review, and hand selected results to the skill website maintainer. Establish a repeatable process from the first project's experience.

Prepare only the evidence support and operating facts needed to start one project. Complete its conversation, independent review, and full replay before expanding. Use those results to improve remaining briefs and write concise operating documentation. Conversation length, product phases, artifact needs, and batch scope adapt to the work; there are no turn quotas, mandatory agent counts, or identical coverage checklists.

The developer approved all milestones on 2026-10-13 and instructed autonomous execution. For each milestone, implement it, review only task-owned changes, fix findings and repeat review until clean, then stage and commit by exact paths and push the explicit branch destination. Preserve unrelated work. Existing authorized publication and replay steps proceed within their milestone; deployed website selection and deployment remain separate. Stop only for a genuine blocker or a decision changing agreed scope or requiring an unplanned destructive action.

Read these revised planning files from the driver checkout when implementing in the preparation worktree. They govern that work even while the planning edits remain uncommitted here.

## Preparation baseline

- The driver checkout is on `main` at `19c7bab`. The preparation worktree at `../moldea-mock-project-public-workflow` is on `docs/simulation-workflow` at the same commit. The driver checkout contains this task's uncommitted planning edits.
- The preparation worktree contains two uncommitted drafts: `scripts/evidence/evidence.mjs` and `scripts/evidence/evidence.test-integration.mjs`. Preserve them during planning; inspect and replace their assumptions during implementation. They contain a global actor requirement and run-ID exceptions that this approach removes.
- Fresh actor projects start from `c3ecda12e853b527a96c6ca81150083b0224643a`, with driver seed changes recorded before the first request. The evidence index and another application's result are not project seeds.
- `README.md` indexes projects. `evidence/README.md` owns capture, privacy, recovery, records, checks, and assets. The utility captures and verifies evidence; it launches no actor, repairs no tooling, and grades no skill behavior.
- The verifier currently requires an installed composition per turn, mandatory run-level Core prerequisites in both `verify` and `validateAttempt`, exact CLI/Core equality with those prerequisites, a globally selected actor, and known host-version metadata. The installation schema cannot represent evidenced absence. Preparation changes the actor policy, prerequisite/baseline checks, initial-absence handling, and standalone host-metadata completeness requirement.
- Capture automatically preserves native `hostVersion` metadata. Keeping its representation leaves the strict session-record schema and website reader usable without companion website work. The website displays per-request `observedResult` only when a recording is unavailable; with a recording it renders the session timeline. Project `observedSummary` remains visible alongside the conversation.
- Node 24 and the existing unit/integration scripts are available. Dependencies are present in the preparation worktree. No dependency, test framework, database, or service is needed.
- Stable [Skill v8.1.0](https://github.com/moldea-ai/skill/releases/tag/v8.1.0) was verified as published on 2026-10-13. Its tag resolves to commit `c2bb924653d5d27943feb5d2103e154ad8131079`. Its distributed entrypoint declares CLI repair target `11.0.2`, CLI support `^11.0.0`, Core support `^7.0.0`, and CLI JSON schema `7`.
- Published [CLI 11.0.2 metadata](https://registry.npmjs.org/@moldea.ai/cli/11.0.2) declares Core `^7.0.2`; [Core 7.0.3](https://registry.npmjs.org/@moldea.ai/core/7.0.3) was verified as published. Fresh projects can resolve different matching Core versions according to package availability and lockfile state. Core belongs in each project's actual observations, without a shared run-wide version pin.
- Scripted journeys cover adoption, policy maintenance, repair, unavailable tooling, and authority boundaries. Their documentation limits claims about separate-turn reliability and actual canonical-instruction consumption. Project runs should add evidence in those areas.
- The website accepts one session asset per attempt and limits each metadata file and compressed or expanded session to 8 MiB. The four session assets in `run-20260928-02` are approximately 40–82 KB compressed. Keep measurement proportionate to that evidence.

Published source, recordings, outcomes, and known gaps are factual material. Preserve them. The absence of platform database tables removes any need for data-migration work; it does not make published evidence disposable.

## Implementation approach

Change the installation schema, types, and verification directly for current requirements. Retain automatic capture metadata and the existing reader contracts. Add no compatibility shims, alternate format paths, deprecated aliases, data migrations, generic repair framework, configuration engine, extension points, or release-specific exceptions. Names and comments describe current responsibilities without version-history labels. Keep the evidence format identifier at `1`; introduce no second execution path.

Reuse request, check, failure, intervention, limitation, asset, recovery, and per-turn installation records. Add only the representation of initial absent CLI/Core. Use existing observations and checks to establish the installation result; add no dedicated adoption record. General transitions between damaged, incompatible, replaced, or repeatedly repaired installations are outside preparation.

## Release, actor, and configuration

Select Skill `v8.1.0` for this batch. Before execution, verify that exact published tag, distributed content, and project-local selected skill copy; record its ref and content hash. Derive tooling requirements from that distribution. Adoption installations use its exact CLI target `11.0.2`; resolve and observe actual Core rather than guessing its patch version.

For this run, `prerequisites` declares only the selected skill and exact CLI installation target, with their identities and evidence sources. Record the actor separately in `expectedActor`. Do not require or enforce a run-wide Core version in either run or attempt verification. Preserve published records and their factual prerequisite entries without creating special handling for them.

Each attempt's first observation showing CLI and Core installed establishes that project's actual tooling baseline, including recorded versions and integrities. If earlier observations showed tooling absent, the first installed CLI must match the run's exact CLI target. When tooling is installed at the start, retain its observed baseline; review its suitability against the selected skill's policy without forcing it to equal the installation target. Every subsequent installed observation in that attempt must match the baseline exactly, with stable selected skill ref/hash and adapter identities where present. Initial absence cannot excuse later disappearance or drift.

Core versions may differ across projects in the same run. Independent review assesses compatibility against the selected skill and CLI dependency requirements using the retained metadata, logs, and actual checks. The evidence verifier checks identities, links, order, bytes, and baseline consistency; it does not judge semantic-version compatibility or require a new named verification check. The actor and driver still follow the selected skill's tooling rules before invoking installed tooling.

Upstream publication can continue during the batch. Keep the selected skill, CLI target, actor settings, and each established attempt baseline fixed. Different Core resolutions between projects do not require a new run. A demonstrated defect requiring a published correction gets an explicit correction-and-retry decision; establish a new run identity if selected skill, CLI target, or actor settings change. Retain the original attempt and its facts.

The batch actor is `gpt-6.1-sol` at `xhigh`, recorded in the run's `expectedActor` and explicitly requested on initial and resumed turns. The verifier compares requested/effective settings and deviations with that record, without a universal model or named-run exception. Unknown settings remain unknown. Complete evidence requires observable requested/effective settings and can describe a failed or deviating attempt without certifying compliance.

Keep the `hostVersion` value automatically supplied by native history in captures and records as session provenance. Use no expected Codex version, pinning, manual version inspection, upgrade check, or host-version drift/readiness rule. A change in that metadata does not stop the batch. Remove the utility's standalone requirement for known host-version metadata before evidence can be complete, while retaining ordinary source and byte integrity checks. Keep the capture/schema representation and website reader intact. Session provenance can support investigation without establishing what caused a behavior change.

Use a dedicated actor configuration/home outside actor-visible seeds and public records. A `-p` profile overlays the personal base configuration; it does not establish isolation by itself. Verify effective permissions, approvals, network access, personality, MCP/tools, hooks, skills, and instruction sources. Record relevant sanitized settings and limitations. Broad access may be chosen deliberately when needed; do not inherit it unnoticed or change account-wide settings. Keep authentication private.

Verify authentication using that same actor home before any actor request; a separate home must not be assumed signed in. During authorized setup, use `env CODEX_HOME=<private-actor-home> codex login status`. If sign-in is required, the developer runs `env CODEX_HOME=<private-actor-home> codex login` and completes the browser flow, then status is checked again. Use the supported configured credential store and keep credentials outside source, recordings, and public logs. Record only the setup result or pending user action; do not request credentials in chat or inherit the personal configuration to bypass setup. Source: [authentication and credential storage](https://learn.chatgpt.com/docs/auth).

Verify the actually selected skill path and instruction sources, including repository instructions and user-discovered skills. A separate configuration home alone does not prove every external source was excluded. The developer's personal coding instructions, driver outlines, future requests, and audit criteria stay outside the actor worktree and prompts. Sources: [profiles](https://learn.chatgpt.com/docs/config-file/config-advanced#profiles) and [instruction discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

## Minimal evidence support before project 1

### Actor and native capture

Remove the global `requiredActor` policy and draft run-ID exception list. Validate native settings against each run's declared `expectedActor` using truthful deviation rules. Leave `historical-20260927`'s unknown expected settings and incomplete status untouched; `run-20260928-02` retains its declared facts without special verifier logic.

Retain automatic host metadata and the session format consumed by the website. Remove the standalone known-host-version completeness gate, without imposing a version target or cross-session comparison. Preserve session identity, native requests, turn ordering, effective settings, tool results, and source/asset integrity. Published recordings and manifests retain their factual content. Preparation changes no sibling skill or website files.

### Run prerequisites and project baselines

In `verify` and `validateAttempt`, require only the skill and CLI-target prerequisites, including their evidence sources/integrities. Remove the mandatory Core prerequisite and every comparison between an attempt's Core and a run-wide Core value. The existing prerequisite-entry shape already represents the two required components; add no new schema or compatibility path for this change.

Use the first fully installed per-turn composition as that attempt's baseline. After an initial absent prefix, enforce the exact run CLI target at that first installed observation. For tooling installed at the start, record its actual baseline. Compare subsequent CLI/Core versions and integrities, selected skill ref/hash, and any adapter identities with that same attempt's baseline. Baselines are independent across attempts, including attempts in one run. The independent reviewer assesses tooling compatibility from existing evidence; no new required check kind, description, or compatibility engine belongs in the verifier.

### Absent tooling and fresh adoption

Allow CLI and Core observations to use either the installed `{ version, integrity }` shape or `{ state: 'absent', reason }`. Absence needs inert, source-backed evidence. Inability to observe remains unknown and cannot be relabeled absent. Keep named adapter observations and selected skill ref/hash. Do not reconstruct starting installation from the result's lockfile.

Per-turn observations describe the state before the delivered request. Allow an initial prefix of absent observations while the developer and actor establish purpose and authorize adoption. Existing request records preserve authorization and clarifications. Installation must follow actual authority; independent review inspects that ordering.

Adoption normally happens early in the product conversation. Before the next dependent request, observe the installed composition and preserve its provenance through the existing installation source locator, identity log, applicable check/input commit, and request before/after SHAs. Record actual CLI/Core versions, integrities, and any adapters. This supplies the first installed baseline described above and the evidence for independent compatibility review. Use ordinary existing check records when checks actually run; add no required tooling-establishment check or inferred eligibility result to the evidence verifier.

Add no dedicated establishment record, completion window, or special last-turn mechanism. If adoption finishes at the end and the available observations/checks do not establish its resulting composition, record that limitation and keep evidence incomplete where verification is missing. Do not invent an observation, infer the starting state from the result, or add an actor request solely to satisfy a recording convention.

Skill-only or diagnostic conversations may conclude with tooling absent. Failed establishment may conclude with evidenced absence and linked failure. Do not invent installation for completeness, accept unknown as absence, or certify adoption without its verified result. Absence after established tooling is not fresh adoption. Record unexpected repair or drift through failures, interventions, checks, and limitations; retain incomplete status where this narrow verifier cannot establish completeness. Expand the schema only when actual work justifies it.

The utility checks recorded structure, links, order, identities, and bytes. It executes no project tooling and infers no authorization, compatibility, privacy, or correct skill behavior from arbitrary command text. Independent review inspects those claims against the conversation, distribution, and actual checks.

### Preparation verification

Use existing synthetic fixtures and teardown. Cover run-declared actor settings, deviations, unavailable required settings, and native integrity. Keep automatic host metadata and verify that its value supplies no version policy or standalone completeness gate. Cover a complete run requiring only skill/CLI prerequisites, initial absence, installed-at-start observations, adoption after clarifications, first installed baseline, and exact CLI target after absence. A two-attempt synthetic run with different observed Core versions must pass; unexplained Core/CLI/integrity drift within either attempt must fail. Preserve truthful terminal absence and incomplete records when resulting installation verification is unavailable. Retain source/request/asset/privacy integrity checks. Add no compatibility-policy test engine, general repair matrix, special last-turn support, website-reader tests, or prose tests.

Run affected focused tests during implementation, then `npm test` and `git diff --check` in the preparation checkout. Reinstall only if needed using the existing lockfile with lifecycle scripts disabled. Evidence tests invoke no actor, provider, registry, website, or moldea executable. This planning revision needs no automated tests.

## Product briefs and naming

Use `fixture_<foundation>_<size>_<project_slug>_<attempt>`, portable lowercase identifiers, and distinct public titles/domains. New families start at `01`. Keep branch and website route identifiers within 64 characters and attempt IDs unique across the index. Check collisions against branches, scenarios, attempts, and gallery titles.

The batch uses `xs`: a bounded product with substantive development and justified artifacts. Defer a complete size taxonomy. Existing unsized families keep their identities. Ordinary follow-ups and actual continuation stay in the same attempt; a reasoned fresh retry increments its suffix and links its predecessor. Scope growth does not rename a recorded family.

Prepare a short driver-owned brief for project 1: purpose, starting facts, seed provenance, plausible phases, and prospective evidence anchors. Deliver only the current product request and normal project conventions. Send requests separately and respond to actual questions/results. Proposed wording is not a delivered request.

Choose a small agent project built on a real supported SDK for the pilot. Its product need should justify agent behavior, canonical instruction loading, a meaningful mid-conversation fact/policy change, and unrelated ordinary work. Exercise actual SDK execution with a controlled model boundary and verify that maintained instructions reach that boundary. This establishes runtime wiring without requiring credentials or a live provider call; report any live execution separately. Select the concrete SDK and product at execution rather than freezing an unnecessary integration matrix now.

Prioritize what real development adds:

- Activation through managed AGENTS.md, the relevance gate, selected SKILL.md, and focused context in an actual coding-agent workflow.
- Sustained appropriate silence during unrelated work, alongside useful activation when relationships become relevant.
- Maintenance after a natural product change makes a recorded fact inaccurate, inspecting implementation and canonical knowledge together.
- For agent projects, actual instruction consumption, tools, schemas, and file/export relationships supported by application checks. A manifest or source-only provider call does not establish runtime behavior.

Use several plausible unrelated requests and a meaningful product change where suitable, without fixed counts or identical briefs. Skill-only, foundation-only, and context-only projects retain their purposes. Authorization and repair remain observable when they arise naturally, without mandatory demonstrations. Distinguish controlled model-boundary tests from live provider execution.

## Project 1 and its learning checkpoint

Start an isolated actor worktree from the fixture base, recording seed changes. Install the pinned project-local skill and consistently use the dedicated actor configuration. Confirm authentication in that actor home, including any developer-completed browser sign-in, before starting the conversation. Before the first request, record requested settings, selected skill identity, and inert starting CLI/Core observations.

Deliver messages through stdin. These command forms use the task's private actor home on every invocation:

```bash
env CODEX_HOME=<private-actor-home> codex exec --cd <actor-worktree> --model gpt-6.1-sol -c 'model_reasoning_effort="xhigh"' --json -
```

Resume from the same actor worktree with the recorded explicit session ID:

```bash
env CODEX_HOME=<private-actor-home> codex exec resume --model gpt-6.1-sol -c 'model_reasoning_effort="xhigh"' --json <session-id> -
```

Use persisted history; do not use `--ephemeral` or select with `--last`. Keep stdout execution events private; they do not substitute for native history. Sources: [non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode) and [command reference](https://learn.chatgpt.com/docs/developer-commands).

Record the emitted `thread_id`, locate that exact conversation's native history, and reconcile identity. Capture after its first real turn and check request wording, effective settings, tool activity, and source references before dependent follow-ups. Keep raw history private. Capture failure stops dependent turns for diagnosis; a small parser fix may suffice, but missing facts must not be fabricated. Add no speculative host tooling and inspect no unrelated private sessions.

Continue adaptive work while preserving delivered wording, turn locators, before/after SHAs, actor commits versus driver checkpoints, checks/input commits, composition observations, and interventions. Measure compressed and expanded session growth at useful existing checkpoints. Capture snapshots under fresh private names; retain the full final conversation.

Write each request's `observedResult` in plain language: the product result and observed moldea actions or abstention where relevant. Anchor the account in the trace, without assigning intent or presenting a driver summary as a captured actor reply. Make the project's `observedSummary` and compact review handoff explain the skill's contribution too. Per-turn summaries appear on the website when no recording is available; the full-recording view uses the timeline. Assess that presentation during pilot replay. Any need for activity highlighting or additional narrative becomes a focused website handoff after the pilot, outside preparation.

Before expanding, complete:

1. Capture and evidence verification of reached source and full conversation, with privacy review and actual limitations.
2. Independent review of routing/silence, context maintenance, runtime instruction consumption where applicable, actor settings, tooling establishment, application checks, and interventions.
3. Full website conversation replay, including tools/results and any compaction, with identity, hash, coverage, size, and source-reference checks.

Resolve material skill, package, runner, or publication problems before expansion. Review may identify an isolated model mistake or unresolved attribution; neither automatically justifies skill instructions or a component fix. Expansion follows an explicit assessment of the pilot, without requiring flawless behavior.

## Evidence, review, replay, and retries

Follow [the evidence contract](../../evidence/README.md) for capture, redaction, checkpoints, interruption/recovery, assets, and checks. Store source and small records in Git; put reviewed sanitized sessions, identity logs, and necessary recovery bytes in Release assets with exact names, sizes, hashes, media types, and session/event ranges. Keep raw sessions, sidecars, authentication, redaction rules, and staging private. Review every proposed persisted copy, including introduced source history. Preserve failures and recoverable unfinished work; never overwrite evidence to hide correction.

The driver preserves the application result and hands it to an independent skill reviewer. Application tests, structural checks, and rendering support different conclusions. Keep `actorOutcome`, `evidenceStatus`, and `reviewStatus` independent and truthful.

Make a compact publication handoff section in the existing run review an explicit deliverable for the pilot and each batch publication. It provides:

- Each project's purpose, the skill behavior exercised, and the observed outcome.
- Key request/event locators, source commits, actual checks and input commits, findings, and limitations.
- The exact public evidence snapshot commit and run ID, manually selected attempt IDs, and direct recording/source/review links needed for the website refresh.

Use the manifests, source history, and Release assets as the underlying records. Keep selection or publication identifiers explicitly pending until established, and finalize the handoff against a known published snapshot before requesting the website refresh. The snapshot identifier names that evidence snapshot; the review need not name its own containing commit. This section makes the evidence navigable without another schema, registry, or handoff file.

Establish cause before a fresh retry. Skill/package defects need the affected fix published and verified; runner defects need runner correction and verification. Record unresolved attribution and retry reasons. Retain numbered attempts, predecessor links, source, recordings, and findings. Normal product follow-ups remain in their actual conversation.

Full replay currently uses public-source development generation; local-record preview omits sessions. After authorized privacy-reviewed publication of the pilot evidence commit and assets, use a private selection JSON in an isolated skill-repository checkout:

```bash
node website/scripts/generate-development.ts --project-runs-selection <private-selection-json>
npm exec --workspace website -- astro dev --host 127.0.0.1
```

Inspect full replay in the browser. Keep the one-session and 8 MiB metadata/compressed/expanded bounds; measure actual output without conversation quotas. If a recording needs reader support, preserve complete evidence and coordinate focused website work. Do not trim meaningful work, fabricate combined native sessions, or label continuation as a fresh attempt. Publication and preview follow their actual authorized scope; resolve unavailable staging before batch expansion.

Manually choose successful attempts from review and application results, recording chosen IDs, reasons, and review anchors in scenario/review prose. The website favors its selected run and history order; it does not infer success. Confirm it displays the chosen IDs. Hand unsupported selection mixtures to its maintainer without inventing runs or rearranging evidence into a success claim. Website selection and deployment remain separate work. Rollback restores the exact evidence commit/run selection while retaining source and assets.

## Files and phased delivery

| Phase | Work and likely files |
| --- | --- |
| Minimal preparation | Inspect the drafts; update `scripts/evidence/types.mjs`, `scripts/evidence/evidence.mjs`, affected existing integration tests, and focused sections of `evidence/README.md`. Put short naming, actor-configuration, initial-absence, observation, and pilot notes there. Retain capture metadata and defer the full operating guide. |
| Project 1 | Select a small SDK-based agent product, write `evidence/scenarios/<project>.md`, prepare its isolated seed/worktree, conduct its conversation, preserve source and run/attempt records, and complete independent review and full replay. Write clear turn/project summaries and the compact run-review handoff; finalize publication and selection references when established. Select concrete identities at execution. |
| Consolidate and expand | Write concise `docs/simulation-workflow.md` and `evidence/scenarios/template.md` from the pilot. Update README navigation and the evidence contract. Keep naming in a guide section unless a separate `docs/project-naming.md` is useful. Adapt remaining briefs, conduct and review authorized runs, and complete each publication's compact run-review handoff. |

The accompanying [milestones](./milestones.md) describe pending checkpoints. Minimal preparation enables the pilot; comprehensive documentation is not a prerequisite. Continuation remains adjustable after learning from the pilot.

## Verification, boundaries, and cleanup

For this revision, check both planning files for agreement, links, and the milestone plan hash; run `git diff --check`; confirm only these two files changed. Run no actor, application test, preview, or publication to support a planning edit.

During implementation, preserve unrelated edits and published facts. No platform migration, database work, universal repair engine, adoption-tracking record, automatic launcher, grading registry, dependency, or sibling skill/website edit belongs in preparation. Component fixes, website presentation changes, deployed selection, and deployment follow their responsible owner's actual scope. Use pilot evidence to justify any focused website work.

Keep configuration and staging private and preserve unresolved recovery material. Stop task-owned servers and remove disposable verification output when finished. Retain these planning files while work is pending. Final authorized cleanup leaves durable guidance in the repository and removes only completed task planning files and empty task directories. Do not sweep other worktrees, evidence, instructions, or planning folders.
