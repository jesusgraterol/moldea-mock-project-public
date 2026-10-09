# Repeatable developer simulations and publication workflow

## Objective and scope

Make this repository sufficient for a future maintainer or coding agent to prepare and conduct realistic developer conversations, preserve their evidence, and hand the results to an independent auditor and the skill website maintainer without requiring the developer to explain the process again.

This implementation establishes the repository documentation, a reusable scenario template, the actor-model requirement, and the smallest evidence-schema and verifier extension needed for authorized tooling-repair journeys. It also documents the independent review/correction/retry cycle and an early full-conversation rendering gate. Selecting and writing the concrete next project batch, starting coding-agent conversations, evaluating or fixing the skill or packages, publishing assets, rendering an actual project, and changing the website remain subsequent work. Their procedures and prerequisites belong in the documentation; this plan does not authorize performing them.

The next project batch will contain new product identities and domains, use the `xs` size, and begin each new family at attempt `01`. Its skill release is not known. No exact future skill, CLI, Core, adapter, or SDK version will be invented during preparation.

## Current state and evidence

The original checkout is on `fixture_openai_personalqa_01_editor` at `5e839d44647d64c37308ebb0bc79ee5dbfbf0209`. It is clean. Its existing fixture content must remain untouched.

An existing preparation worktree at `../moldea-mock-project-public-workflow` is on `docs/simulation-workflow`, based on `main` commit `3f6a75b9e7372635c745d1b8048224aefd2266e5`. Use that worktree for the approved implementation. Recheck its state before implementation; do not switch, merge, or modify an existing fixture branch to prepare these changes.

Two premature, uncommitted, untested edits already exist in that worktree: `scripts/evidence/evidence.mjs` and `scripts/evidence/evidence.test-integration.mjs`. They change the default actor and introduce historical exceptions and synthetic coverage. They are a draft to inspect against this plan, not approved or verified implementation. Dependencies were installed there with `npm ci --ignore-scripts`; no dependency-manifest or lockfile change was observed. This planning command does not modify or revert those edits.

The inspected repository establishes these responsibilities:

| Evidence | Current behavior |
| --- | --- |
| `main:README.md` | Indexes the original 14 projects, distinguishes fixture branches from cross-run records, and identifies the fresh fixture base as `c3ecda12e853b527a96c6ca81150083b0224643a`. |
| `main:evidence/README.md` | Owns format-version 1 records, capture, redaction, identity observations, checks, recovery, Release assets, review, and public export. Its general run instructions still name the September release and the previous actor model. |
| `main:evidence/scenarios/*.md` | Separates developer messages from driver and reviewer guidance, but provides no reusable template or complete operating guide for future simulations. |
| `scripts/evidence/evidence.mjs` | Captures and verifies evidence. Published main requires `gpt-6-sol` at `xhigh` for complete attempts. `validateAttempt` also requires each turn's CLI/Core versions to match the run prerequisites, preventing complete evidence of an intentional ineligible starting state. It does not launch actors, grade the skill, change Git state, or publish assets. |
| `scripts/evidence/types.mjs` | Defines closed format-version 1 records. `InstallationSchema` requires CLI/Core version strings and known adapter records; an unknown installation list cannot represent an evidenced missing component while satisfying complete-attempt checks. |
| `scripts/evidence/evidence.test-integration.mjs` | Exercises capture and verification through real disposable Git repositories and session assets. |
| `package.json` | Requires Node 24 or later; `npm test` runs the unit and integration suites. There is no configured lint, formatting, or build script. |
| Sibling `skill/website/README.md` and `website/src/lib/project-runs/` | The website reads metadata at an exact selected public commit, verifies session sizes and hashes, and groups attempts by branch family. Its partial record schemas ignore installation fields. It accepts one session asset per attempt and limits metadata and compressed or expanded sessions to 8 MiB. Public-source development generation loads transcripts; `--project-runs-root` local-record preview omits them. Selection order favors a record without determining whether it passed. |

The original historical records remain incomplete where their request mappings, composition observations, or review are unavailable. In particular, `historical-20260927` records its run-wide expected actor as unknown; it must remain unknown and must not receive an inferred model requirement. Only `run-20260928-02` establishes the known historical requirement of `gpt-6-sol` at `xhigh`. Documenting the future workflow does not change those facts.

This revision retains the developer's tooling-repair, review/retry, coverage, and early-publication amendments and corrects the independent review finding about healthy compatible tooling. Installation/replacement uses the selected skill's exact CLI repair target; preservation records the actual verified compatible composition, which becomes the baseline for subsequent observations. Earlier read-only Codex CLI `0.161.0` and website-reader findings remain applicable. Native export compatibility remains unestablished. No actor conversation or website preview was started. The previous challenge applies to the superseded plan; there is no existing milestone breakdown to invalidate.

## Agreed operating rules

### Roles and realism

The driver acts as a developer in a dedicated coding-agent conversation. The actor has the released moldea skill installed, receives ordinary product requests, asks questions, implements the application, and runs appropriate application checks. The driver responds to actual intermediate results and introduces coherent follow-up requirements, bug reports, corrections, and maintenance.

Prepare product needs that justify more working artifacts and more back-and-forth than the initial projects. For agent-based projects, those artifacts can include distinct agent responsibilities, implemented tools, schemas, instruction loaders, shared context, and reusable skills. A manifest entry, empty function, canned transcript, or completed source tree without its real development conversation does not substitute for this process.

Use several meaningful development phases, rather than a rigid turn quota or mandatory agent count. Foundation-only, skill-only, and context-only scenarios retain their purpose; richer scenarios do not require inventing runtime agents for deterministic work. Distinguish application checks from live provider execution and record what actually ran.

The driver preserves and reports evidence and hands it to another agent for skill evaluation. Actor application checks and evidence-utility verification remain legitimate parts of the workflow; neither becomes a skill verdict. Do not silently repair actor work or coach it through expected moldea internals. Preserve any necessary intervention and its original result.

The developer's personal coding instructions stay external. They guide our repository-maintenance session and its plan, challenge, breakdown, implementation, and review process. Do not copy, link, or inject them into repository operating documentation, actor fixtures, seed materials, or actor prompts. Driver outlines and independent audit criteria also stay outside actor-visible materials.

### Naming and project identity

Use `fixture_<foundation>_<size>_<project_slug>_<attempt>` for new branches. An illustrative name is `fixture_openai_xs_archive_room_01`; it is a naming example, not a selected project or evidence of execution.

The foundation identifies the runtime or adoption scenario. Size describes intended product scope. The product slug distinguishes unrelated products using the same foundation and size. The final numeric suffix identifies a fresh attempt of that same family.

New families start at `01`; fresh retries increment the suffix while retaining the earlier branch, attempt record, and predecessor link. Ordinary follow-up turns remain in the same attempt. Actual session continuation is recorded as continuation; do not relabel it as a fresh attempt merely to bypass publication constraints.

All existing unsized branches remain baseline and keep their names and history. Baseline is a historical classification, not a claim that an original project is larger or smaller than a new `xs` project.

Define a qualitative rubric for `xs`, `s`, `m`, `l`, and `xl` using product workflows, responsibilities, integrations, state, and ownership boundaries. The current batch uses `xs`: a bounded product with substantive development and multiple justified artifacts. Avoid agent-count, token, cost, or reliability thresholds. Keep the family identifier stable after its first recorded attempt; record actual scope growth without renaming published history.

Document the separate identities for run, scenario, attempt, branch, and assets. Keep branch and route identifiers within the website's 64-character bound, use portable lowercase names, and respect the evidence utility's path and sidecar-name limits. Attempt IDs must be unique across selected and historical runs. New project briefs need distinct public titles and domains.

The website's family key removes only the final numeric suffix. The foundation, size, and product slug therefore distinguish new products from baseline projects and from one another. A retry remains in the same family. Maintainers manually choose its successful attempt when preparing website evidence; the reader's selection order is not a passing decision. Size changes alone must not be used to disguise a retry as a new product.

### Release and actor prerequisites

At the beginning of approved implementation, check the official `moldea-ai/skill` release sources for the latest published stable release satisfying `^7.0.0`. Do not use a development checkout, an unpinned `main` installation, a prerelease, or a version guessed from a planning document as proof of a published stable release.

This check is deferred until implementation. If no qualifying release exists, report that observation; documentation and evidence-tooling preparation can proceed, while actor runs remain pending. If no run identity has been frozen when actor execution is later authorized, repeat release discovery then. Never silently fall back to version 6.

Before an actor run, verify the chosen immutable tag and official distributed content and consult that release's actual repair and compatibility requirements. Record the pinned skill, exact CLI installation/replacement target, and default ordinary-run composition in the run prerequisites. Separately observe the actual starting installation, which may be healthy and compatible or intentionally absent, older, broken, or unobservable in an authorized repair journey. Preserve healthy compatible tooling when the released policy calls for preservation; record its actual resolved Core/adapter dependency closure and relevant SDK identities. Do not copy target versions into observed fields or force healthy tooling to match a default version. Recheck composition for every turn. The selected skill stays pinned; authorized tooling journeys follow the bounded repair record below, while unrelated drift stops dependent work.

New runs require `gpt-6.1-sol` at `xhigh` for every actor turn, follow-up, and resumption. Preserve requested and effective settings and truthful deviation records; stop dependent actor work when settings drift. Complete evidence can describe a failed or deviating attempt and does not certify that the requested actor settings were obeyed.

### Conversation host and native evidence preflight

Document Codex CLI as the concrete host path, with its installed version and verified capabilities. Local `codex --version`, `codex exec --help`, and `codex exec resume --help` establish the current command surface. Recheck that surface before actor execution. The guide must include these command forms, replacing the worktree path and session ID with the selected attempt's values:

```bash
codex exec --cd <actor-worktree> --model gpt-6.1-sol -c 'model_reasoning_effort="xhigh"' --json -
```

Run the continuation from that same actor worktree, using the recorded session ID:

```bash
codex exec resume --model gpt-6.1-sol -c 'model_reasoning_effort="xhigh"' --json <session-id> -
```

Supply each actual developer message through stdin, preserve its exact wording privately until reviewed, and wait for the actor's result before deciding the next message. Use the explicit ID rather than `--last`; retain normal project trust, sandbox, and approval controls. Do not use `--ephemeral`, which prevents persisted session history. These forms use the documented model override, resume, and stdin interfaces; the reasoning configuration key is `model_reasoning_effort`. Sources: [CLI command reference](https://learn.chatgpt.com/docs/developer-commands?surface=cli) and [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference).

Record the `thread_id` from the documented `thread.started` output event and reconcile it with native session metadata before capture. The `--json` stream contains execution events; it is not automatically the native session JSONL accepted by the existing capture parser. Preserve it as private operational output, not as a substituted native transcript. Source: [non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode).

Before sending the first authorized product request, establish the installed host's supported native-history location or export procedure, its lookup by explicit session ID, and its compatibility with the existing parser's required metadata, developer requests, response items, and effective turn settings. Use documented behavior or an already authorized sample; do not start a probe conversation in this implementation. After the first actual actor turn creates an ID, locate and check that session's native records before any dependent follow-up. Document the exact supported procedure and relevant version, rather than directing maintainers to search all private sessions. Local CLI help also exposes migration to paginated thread history; it does not establish a compatible native JSONL export for new conversations. If the available storage/export cannot supply the required native records, mark actor execution blocked before starting. Do not invent an export command, treat stdout JSONL as an equivalent format, migrate unrelated histories, fabricate missing events, or add an exporter or launcher within this scope. A needed compatibility implementation requires its own reviewed scope.

Before each turn, record the requested model and effort and observe the installed skill and CLI/Core/adapter composition. Establish eligibility from inert evidence before using any installed tooling executable: inspect manifests, lockfiles, installation paths and file hashes, and the selected release's compatibility requirements. Do not execute an unsupported or broken CLI merely to obtain its version or resolve Core. Record absence, ineligibility, or inability to observe with reasons and evidence; unknown does not mean absent. Use the release's documented read-only executable mechanisms only after eligibility is established. Record observation time and source locators in the private identity log, then bind observations and native effective settings to that request's session and turn. Flags establish requested settings; native evidence establishes effective settings. Missing native settings, missing skill identity, or unsupported observation provenance block dependent work. An evidenced ineligible tooling state can enter the authorized repair path; accidental drift cannot.

The operator guide must provide concrete inert observation steps and, after the actual release is selected, supported commands for eligible tooling. An evidenced unavailable component is a legitimate repair starting state; inability to preserve the observations or required native evidence is a preflight blocker. This revision cannot establish unreleased command names. Preparation can finish while release-dependent or native-export capabilities remain pending, but it must not claim actor readiness or a successful export preflight. Later actor authorization includes confirming those capabilities; this implementation does not start a probe conversation.

### Driver-only situation coverage

Add a short coverage outline to the reusable template, kept outside actor-visible seed material. Across suitable projects, use ordinary product needs to exercise:

- Runtime instruction consumption: an actual agent behavior depends on project-owned instructions that the implementation must load and use.
- Context discovery and maintenance: existing project facts matter to a request, then a legitimate product correction or change requires maintaining those facts.
- Relevance and silence: some requests relate to adopted project knowledge while other ordinary work should proceed without unnecessary moldea actions.
- Authorization: a realistic task has a meaningful permission boundary, with the actual request and any follow-up approval preserved.
- Repair: a real configuration or tooling problem needs diagnosis and authorized correction; a healthy configuration may need inspection and no changes.

The outline records proposed situations, plausible product triggers, and prospective evidence anchors, not grades, pass criteria, turn quotas, or a checklist for every project. Select suitable coverage across the later batch rather than forcing every situation into each project. Let actual actor questions and results shape follow-ups. Do not expose the outline or prescribe expected moldea operations to the actor. Proposed triggers remain proposals until their exact delivered requests are recorded. A healthy project-level repair with no tooling transition uses ordinary requests and checks; it does not require a tooling-repair exception.

### Independent review, correction, and retry

The driver simulates the developer and preserves the actor's work. The skill agent independently inspects conversations, source, project context, actual checks, tooling observations, and limitations. Application checks, evidence completeness, and website rendering do not replace that review or establish a passing attempt.

After a finding, retain its request/event locators, source and check SHAs, actual component identities, and original outcome. Establish the cause before changing anything or rerunning: distinguish a skill defect, package defect, runner/capture/environment problem, and an isolated model mistake. An unresolved attribution remains unresolved; do not add instructions merely because one actor turn failed.

When independent review demonstrates a skill or package defect, the responsible owner fixes and publishes the affected component through its separate workflow. Verify the published correction before starting a fresh attempt of that project. Runner defects require runner fixes and verification. An isolated model mistake does not automatically justify changing the skill; any retry needs a recorded reason supported by the review and the applicable authorization.

A fresh retry increments `_01` to `_02` while retaining foundation, size, product slug, earlier branches, records, assets, and predecessor linkage. A new run records the newly selected published composition; never rewrite the original run's pins or observations. Normal adaptive follow-ups and an authorized tooling repair inside a conversation remain within that attempt. A separate correction-and-retry cycle starts a fresh attempt; it does not conceal an earlier failure.

When preparing website evidence, the developer or maintainer manually chooses the successful attempt for each project using the independent review and actual project results. Keep a pending/chosen attempt ID, decision reason, and review reference in the existing scenario/review handoff prose, without creating a new selection registry or automated grading system. Preserve earlier attempts for investigation. The website does not infer success or need a visitor-facing selector.

The current reader favors the selected run, then the supplied history order, and cannot express every possible mixture of per-project winners. Confirm that the prepared public records and supported selection actually display the manually chosen IDs. If they cannot, report a separate website-maintainer handoff; do not reorder evidence to imply a passing verdict, duplicate attempts into invented runs, mutate earlier records, or introduce a selector in this repository change.

### Early capture and publication compatibility

Retain the native-history preflight before actor execution. During later authorized execution, capture and verify the first completed project's full conversation and source checkpoints, then require a local full replay before expanding to the rest of the batch. Independent review may still be pending; retain its actual status. The gate checks publication compatibility, not skill correctness.

At existing request/source or development-phase checkpoints, measure compressed and expanded sanitized transcript bytes and check actual session count. Use new private capture output names or directories because capture refuses overwrites. Keep intermediate snapshots private and preserve the full final session; snapshots are not extra attempts or fabricated native sessions. Recheck growth before final capture and handoff, without imposing a new turn quota or cutting meaningful development work.

The existing reader requires one session asset per attempt, at most 8 MiB of expanded session content, and the same 8 MiB bound for compressed sessions and metadata. Check hashes, identities, event coverage, rendering of messages/tools/results/compaction, and the availability of pinned scenario/source references. If support is insufficient, retain complete conversations and pause batch expansion for a separate website handoff. Do not trim work, concatenate native sessions into a fake export, or disguise continuation as a new attempt.

The website's `--project-runs-root` local-record preview deliberately omits session replay, so it cannot satisfy this gate. Document its existing public-source development preview instead: after the first reviewed-for-privacy evidence snapshot and assets are publicly available under separate publication authorization, supply a private temporary selection JSON containing that exact commit and run ID, then run from an isolated skill-repository checkout:

```bash
node website/scripts/generate-development.ts --project-runs-selection <private-selection-json>
npm exec --workspace website -- astro dev --host 127.0.0.1
```

This preview uses existing reader behavior and generated development output; it does not edit `website/project-runs.json`, website source, or the deployed selection. Coordinate it with the website maintainer, preserve unrelated work and previews, and stop task-owned servers afterward. Inspect the full project replay in the browser rather than treating successful metadata generation as sufficient.

If authorized public staging or full replay support is unavailable, mark this gate blocked and resolve that separate handoff before expanding the batch. Do not claim a local-record preview tested the conversation, publish without authorization, or add a local-asset renderer within this scope. No preview or publication is performed during this preparation implementation.

## Tooling-repair evidence design

### Observation states and backward compatibility

Keep format version 1 and all existing records unchanged. Factor the current private composition shape in `types.mjs` so per-turn installations and post-repair observations share the same skill/component definitions. Preserve existing public schema exports.

For CLI and Core, accept the existing `{ version, integrity }` record unchanged, plus explicit `{ state: 'absent', reason }`, the existing `UnknownSchema`, and an ineligible record containing `state: 'ineligible'`, a reason, and known-or-unknown version and integrity. Ineligibility covers known older, unsupported, or broken tooling; absence and inability to observe remain distinct. Never use a target version, empty string, or a fabricated version as an observation.

Apply the same named component states to adapter entries, preserving existing `{ name, version, integrity }` entries. Permit an unknown adapter inventory with a reason. An empty known inventory means no observed adapters, not an unknown inventory. Skill observations remain the existing mandatory released ref and content hash; this extension does not authorize missing or changing the selected skill.

Each per-turn or final observation retains an exact log-asset source locator backing its component states, with the inert observation method, relevant paths or hashes, observation time, and limitations in that reviewed log. Eligibility is established before executable discovery or inspection. The utility accepts recorded observations; it does not execute any installed CLI, discover packages, install a repair, or infer a version from the target prerequisites.

### Bounded repair records

Add optional `toolingRepairs` to `AttemptSchema`; omission or an empty list means the ordinary-run path. Each closed record contains:

- `authorizationRequestId`, identifying the actual developer request authorizing the repair, and `reason`.
- `components`, a nonempty unique subset of `cli`, `core`, and `adapters`, identifying the tooling scope authorized to differ.
- `firstTurn` and `lastTurn`, explicit existing session/event-ordinal turn locators bounding that transition. `lastTurn` may be null while the attempt is incomplete.
- `completionRequestId`, identifying the request whose result concludes the repair; it may be null while pending.
- `outcome`: `pending`, `repaired`, `unchanged`, or `failed`.
- `cliAction`: `installed`, `replaced`, or `preserved`, backed by the actual repair evidence; use an explicit unknown-with-reason value while the action cannot be established. This distinguishes CLI preservation from installation when Core or adapters were repaired and the overall outcome is `repaired`.
- `finalObservation`, a shared composition plus evidence source and `inputCommit`, observed after the completion request. Use an explicit unknown-with-reason value while it is unavailable.

Do not duplicate the starting composition: `firstTurn` references its existing per-turn installation observation. The separate final observation is necessary because a repair can finish during the last actor turn, with no later turn available to demonstrate its result. Bind its `inputCommit` to the completion request's actual `afterCommit`; record timing and native end-of-turn evidence in its log locator.

Require a matching existing check with description `tooling repair verification`, the same input commit and log asset, and covered repair/component evidence. It is passed for a verified repaired or healthy unchanged outcome. Its source records the actual CLI action, the selected release's applicable compatibility requirements, the observed resolved Core/adapter dependency closure, and the package identities/integrities establishing the result. Compatibility requires that evidence; a newer version number alone is insufficient. A failed repair records its actual failed or blocked verification and a linked failure. These checks describe tooling verification, not a skill verdict.

Keep the selected skill's exact CLI installation/replacement target and the default ordinary-run composition in run prerequisites as immutable reference identities. Relevant `adapter:<name>` entries describe that default composition, not an obligation to replace healthy compatible dependencies. A repair's final observation records the actual verified composition and its integrity evidence. Core and adapters must reflect the compatible dependency closure resolved for the installed or preserved CLI, rather than unnecessary equality with run-wide default versions. Do not rewrite prerequisites to normalize observations. Keep the released skill and expected actor unchanged. No compatibility engine, extra run registry, or state-management layer is needed.

### Verifier invariants

Extend `validateAttempt` with one private repair-validation path, reusing existing request, source, check, asset, and turn validation. Let `verifyAsset` expose only the verified native ordering/boundary facts needed to bind those references; do not add a second transcript parser or change capture output.

Validate unique authorization references, component scopes, existing turn locators, native request/turn association, chronological start/completion order, and nonoverlapping repair windows. Use the retained native turn/task boundaries and ordered requests rather than trusting an arbitrary session ordinal from a manifest. Ambiguous or unavailable binding cannot support complete repair evidence. A starting observation may precede its same-turn authorization message; it records a condition and does not authorize action before the request. An initial diagnosis may precede later approval only with the original starting-state provenance and observations preserved. Authorization must precede repair actions, and a later declaration must not retrospectively relabel accidental drift as an intentional starting condition. Auditors inspect the actual wording, timing, and actions as well as the claimed scope.

For ordinary attempts without repair records, retain the existing prerequisite matching and completeness checks. In a repair journey, use those defaults until the validated repair window; after a successful or healthy unchanged outcome, use its verified final composition as the baseline for subsequent observations. Require known eligible tooling and unchanged actual identities against that baseline until another separately authorized, nonoverlapping repair. Within a window, only declared components may change or have unavailable states. Unchanged components may retain versions differing from the run defaults when the verification evidence establishes their health and compatibility as part of the actual dependency closure. Preserve scope, skill identity, and native settings/deviation checks; this is not a blanket drift waiver.

For complete repair evidence, require nonpending outcome, both request endpoints, source-backed initial/per-turn/final observations, and the matching verification check. A successful `repaired` or `unchanged` result also requires an established `cliAction` consistent with the observations and actual repair evidence.

When the CLI was `installed` or `replaced`, require the selected released skill's exact CLI repair target and verified artifact identity. An `unchanged` result cannot claim installation or replacement. When the CLI was `preserved`, require a source-backed healthy compatible installation and unchanged CLI identity; accept its actual version even when it differs from the run's installation target. A `repaired` journey may preserve its healthy CLI while repairing other explicitly authorized components.

For both successful paths, verify the actual eligible Core/adapter dependency closure and its integrity evidence under the selected release's applicable requirements. Do not require Core or adapter identities to equal the run-wide defaults solely because those defaults were recorded. An `unchanged` result must preserve relevant installed identities and source state; a repair request does not justify unnecessary edits. Its final observation still records the real resolved composition.

After either successful outcome, compare subsequent observations with that exact verified final composition, not the installation target. Reject an unexplained later CLI, Core, or adapter identity change even when another version would also be compatible. A further intentional transition needs its own authorization and bounded repair record.

A `failed` repair preserves its actual final unavailable or ineligible states and linked failure without inventing a healthy result. Complete evidence may describe that terminal failed journey when all required evidence is present; it must not resume ordinary product work using an unverified composition. Missing endpoint, authorization, observation provenance, native binding, or verification remains an evidence gap and cannot be promoted to complete.

For every repair turn and final observation, keep the selected skill ref and content hash stable and tied to the initially verified released distribution. Retain the actor requirement and all native model/effort/deviation checks without a repair exception. Stop dependent work on unexpected skill or actor drift and preserve the result.

Historical records without repair fields follow their existing validation path. Preserve the original run's unknown settings/incomplete status and the single known historical old-model exception. Do not retrofit repair authorizations or claimed versions into published evidence. Structural verification establishes references, bytes, ordering, exact replacement-target identity, baseline consistency, and outcome/check declarations. It does not infer compatibility from version ordering or parse arbitrary command text into a compatibility policy. Independent review checks compatibility evidence against the selected release and resolved dependency closure, as well as diagnosis, authorization, repair, and application behavior.

## File ownership and final changes

| File | Planned change |
| --- | --- |
| `README.md` | Add the durable entry points for simulation and naming, explain the driver/actor/auditor responsibilities and website use, and keep the historical index and original attempt facts intact. |
| `docs/simulation-workflow.md` | Add the end-to-end operator guide, including inert eligibility observations, authorized tooling repair, realistic adaptive conversations, independent review/cause/correction/retry, manual successful-attempt selection, and first-project full replay plus checkpoint growth checks. Preserve capture, recovery, assets, and website handoff procedures; link the evidence contract rather than duplicating its schema. |
| `docs/project-naming.md` | Add the agreed branch grammar, qualitative sizes, baseline treatment, attempt lifecycle, portable identifiers, website grouping implications, and collision examples. Explain `_01` to `_02` after a cause-backed correction and published component fix, retaining the same family and all earlier evidence. |
| `evidence/scenarios/template.md` | Add a clearly labeled, unexecuted template with product identity, separate driver-only and actor-visible material, seed provenance, adaptive phases, a short coverage outline, optional repair starting conditions, evidence anchors, independent review/correction/retry handoff, and a pending manual website-attempt choice. Keep driver coverage and audit guidance outside actor-visible content. |
| `evidence/README.md` | Own the backward-compatible component states and bounded repair record, prerequisite-versus-observation distinction, and completeness/failure semantics. Document actor/history policy, independent review and correction, manual publication choice, and early replay constraints. Preserve capture, privacy, recovery, and storage rules. |
| `scripts/evidence/types.mjs` | Extend installation component observations and add optional bounded `toolingRepairs` records, including the evidence-backed CLI action and verified final composition. Reuse private composition/source/turn-locator schemas, preserve existing exports and records, and retain format version 1. |
| `scripts/evidence/evidence.mjs` | Add narrow repair validation and CLI installation-versus-preservation checks to `validateAttempt`, using verified session facts from `verifyAsset`. Keep ordinary-run checks; use the verified final compatible composition as the subsequent repair-journey baseline. Apply the new actor policy, retain the old-model exception only for `run-20260928-02`, and preserve the original incomplete unknown-settings run. The utility executes no installed tooling or repairs. |
| `scripts/evidence/evidence.test-integration.mjs` | Retain actor/history and native-integrity regressions. Cover exact CLI installation/replacement, healthy newer-compatible preservation, actual compatible Core/adapter closure, mixed repairs, subsequent baseline drift, failures, bounded authorization/order, final verification, and skill/actor pins. Reuse existing disposable repositories, assets, and teardown. |

Keep format version 1, package manifests, lockfiles, existing run records, original scenario definitions, fixture branches, and the sibling skill repository unchanged. The schema extension is additive for the updated utility and the website's existing partial reader; old records need no migration. Earlier strict verifiers will not understand new repair records, so use the evidence-utility revision accompanying those records. Add no framework, registry, dependency, actor launcher, package fixer, or publication service.

## Required documentation coverage

The operating guide and template must make the following procedure executable by a future maintainer.

1. Identify a genuinely new product and its foundation, size, and stable slug. Check existing branches, public project titles, scenario IDs, and attempt IDs before choosing names. Record intended product outcomes, starting facts, meaningful artifact needs, and plausible development phases without prescribing the actor's moldea file layout.
2. Keep preparation and evidence records in the main-based driver checkout. Start an authorized project attempt from the documented clean fixture base, not from the evidence index or an earlier application's result. Record any driver seed changes and their checkpoint before the first actor request. Keep the complete driver template and audit notes outside the actor's worktree. Install the released skill through its documented project-local installation path and verify the actual selected copy.
3. Follow the procedure under Conversation host and native evidence preflight. Record the installed host version, explicit session ID, requested settings, native evidence source, and any preflight blocker. The evidence scripts do not launch conversations. Make product requirements and normal project conventions visible to the actor; do not supply private audit expectations or the developer's personal coding instructions.
4. Deliver developer requests separately and respond to the actor's actual questions and implementation. Preserve exact delivered wording, turn/session locators, before/after source SHAs, actor commits versus driver checkpoints, actual checks and their input commits, and installed-composition observations. Do not treat proposed template messages as delivered requests.
5. Preserve failures, authorized repair transitions, retries, corrections, and interventions without overwriting original observations or outcomes. Apply the bounded repair contract rather than rewriting run prerequisites to match an accidental change. For interruptions, follow the existing checkpoint or recovery-asset procedure and verify restoration before claiming recoverability.
6. Capture the explicitly selected native session with the existing utility. Keep raw sessions, redaction rules, sidecars, downloads, and staging material private. Review every proposed persisted copy, including introduced Git history, source, instructions, manifests, decompressed sessions, identity logs, and recovery material. Use explicit redactions, preserve useful shareable context, and record evidence limitations.
7. Store source history and small index/run/attempt/scenario/review records in Git. Store reviewed sanitized session, identity-log, and necessary recovery bytes as GitHub Release assets. Each asset has an exact tag/name, downloadable-byte SHA-256, size, media type, and applicable session/event range. Preserve the current path rules and exclude dependency trees and reproducible build output. Never publish raw native sessions or silently replace an existing asset.
8. Bind the run-specific Release tag to a recorded repository commit. Verify records and local asset bytes, prepare a draft release only when authorized, upload reviewed bytes without clobbering, download and verify them, and publish only under the applicable authorization. Retain private recovery material until durable storage has been confirmed.
9. Hand conversations, source, context, checks, exact identities, limitations, and interventions to the skill agent for independent review. Keep review pending until that inspection completes. Establish the cause before changing any component or creating a fresh attempt: skill/package defects require their affected fix to be published and verified; runner defects require runner fixes; isolated model mistakes do not automatically justify skill instructions. Follow the Independent review, correction, and retry procedure.
10. Manually choose the successful attempt for each project using the independent review and actual project results. Record that choice and its evidence anchors, then hand the public evidence commit, chosen attempt IDs, run/history IDs, scenario revisions, and source/Release links to the website maintainer. The reader consumes the same format-version 1 records; it does not choose passing attempts. Reconcile the manual choices with its actual selection behavior before any separately authorized selection update or deployment.
11. Check publication compatibility early: capture, verify, and locally render the first completed project's full conversation before expanding the batch, then check transcript growth at existing checkpoints. Retain the one-session-per-attempt and 8 MiB metadata/compressed/expanded bounds, identity and hash checks, and public-reference checks. Preserve complete evidence and report a blocker when reader support is insufficient; do not trim meaningful work, fabricate a combined native session, or split continuations into fake attempts. Website support changes remain a separate handoff.
12. Explain how to roll back a website selection to its previous exact commit and run IDs without deleting source branches or assets. Retention and destructive cleanup remain explicit decisions. Temporary resources are released after capture and handoff, while required evidence and unresolved recovery material are preserved.

The guide must distinguish the shareable final evidence from private intermediate capture material and distinguish source commits, scenario-definition commits, evidence-selection commits, and Release tags. It must preserve the separation among actor outcome, evidence completeness, and independent review status.

## Implementation sequence and review checkpoints

1. At authorized implementation start, recheck both worktrees and the current main baseline, perform the stable version-7 release check, and inspect the two existing draft edits. Record whether actor prerequisites are available. Preserve unrelated changes and keep the original checkout untouched.
2. Write the operating and naming guides and reusable template, including driver coverage, independent cause/correction/retry, manual attempt choice, inert observations, and the first-project replay gate. Update README navigation and evidence documentation coherently. Ground host and preview commands in their existing interfaces; clearly identify pending native-export or publication prerequisites. Keep schema and capture rules authoritative in the evidence contract.
3. Implement the additive observation and repair schemas and narrow verifier branches, then finish actor-policy integration coverage. Distinguish exact CLI installation/replacement from compatible preservation, and use the verified final dependency closure for subsequent baseline checks. Ordinary records retain their existing path; only explicit validated repair records authorize bounded transitions or preservation. Remove the draft's unsupported `historical-20260927` model exception and invented complete fixture. Preserve its unknown settings and incomplete status, and retain the old-model requirement only for `run-20260928-02`. Remove superseded universal old-model prose without removing justified historical compatibility.
4. Review the template and cross-links against the utility, fixture base, and website reader. Walk through an ordinary journey, an ineligible starting state with authorized repair, healthy no-op repair, a failed repair, and a cause-backed `_02` retry on paper. Confirm the first-project preview procedure loads full session bytes and manual winner choices are expressible or explicitly blocked. Do not claim execution, release availability, review, or publication that has not happened.
5. Run the required checks, inspect the complete scoped diff, and report the finished documentation, model-policy behavior, verification results, release availability, and retained resources. Stop for the developer's review and publication workflow. Do not commit, push, launch actors, or update the website selection as part of this implementation scope.

These are strategic steps, not an authorized milestone sequence. A later `breakdown` command can establish useful milestones from the approved scope.

## Verification and acceptance

During implementation, use the existing Node 24 environment and repository scripts. Dependencies are already present in the preparation worktree; reinstall only if the actual environment requires it, with the established lockfile and lifecycle scripts disabled.

Run `npm run test:integration` after the schema/verifier changes, then `npm test` for the full evidence-utility regression boundary. Use the existing integration file for focused schema acceptance/rejection and real verifier fixtures; capture unit tests remain unchanged.

Retain current-model success, old-model rejection for new runs, the `run-20260928-02` exception, the original historical unknown-settings/incomplete distinction, rejection of unknown required settings in a complete attempt, incorrect effort, native-settings integrity, and truthful deviation accounting.

Add focused coverage for:

- Legacy ordinary records without repair fields, unchanged ordinary mismatch rejection, and parsing of absent, unknown, older/ineligible, and adapter-inventory states without invented versions.
- A complete multi-turn repair from an inert ineligible starting observation to a verified final composition, including last-turn completion. Successful CLI installation/replacement must use the exact selected skill repair target; a different CLI must not be reported as a successful replacement.
- A healthy newer-compatible no-op: hypothetical run target CLI `10.0.0`, actual healthy compatible CLI `10.0.1`, and its verified Core/adapter closure. Accept unchanged preservation and subsequent observations of that actual composition even when dependency versions differ from run defaults. These are synthetic identities, not claimed published releases.
- A mixed successful repair that preserves the compatible CLI while repairing authorized Core/adapters, and rejection of a positive outcome with missing/failed compatibility evidence or inconsistent CLI action.
- Subsequent unauthorized CLI/Core/adapter identity changes rejected against the verified final baseline, even when the changed version is also compatible.
- A terminal failed repair whose full evidence remains distinct from a successful repair or an incomplete record.
- Missing or wrong authorization/completion references, reversed or overlapping windows, ambiguous native turn binding, unrelated component changes, and drift outside the authorized scope.
- Missing/tampered initial or final evidence, absent/mismatched verification checks or input commits, unverified final identities or replacement targets, and an incomplete repair incorrectly claiming complete evidence.
- Changed skill ref/hash, changed actor settings, and native deviation records, demonstrating that repair cannot bypass their checks.

Use inert fixture files and fake identities; invoke no moldea executable, registry, provider, actor, or website. An ineligible executable sentinel should remain uninvoked during verification. Keep temporary repositories and assets under the existing teardown hooks.

Run `git diff --check`. Inspect Markdown links and host/preview commands against actual targets and options. Walk through naming, explicit-ID continuation, inert observation, repair authorization and final verification, review/cause/published-fix/retry, capture, manual attempt choice, and the first-project full replay gate using illustrative names. Do not create a real run, actor session, public selection, or website preview. Distinguish interface inspection from executed preflight, and identify unresolved capabilities. No prose tests or formatter installation are required.

Compare the scoped diff against the recorded main base and confirm that `evidence/index.json`, `evidence/runs/**`, original scenario files, package manifests, lockfiles, protected instruction files, and original fixture refs were not changed. Synthetic tests establish the verifier compatibility change; do not claim that real historical Release assets were downloaded and reverified unless that check is separately performed.

The change is acceptable when a maintainer can follow the README to name a distinct project, prepare an adaptive developer conversation, truthfully record an ordinary or authorized repair journey, preserve failures and recovery, obtain independent review, correct the responsible component, create a properly numbered retry, and manually hand chosen attempts to the website maintainer. It must document the short driver-only coverage outline, first-project full replay gate, checkpoint growth checks, naming, pinned actor settings, stable version-7 discovery, and asset constraints. Healthy compatible preservation and its resolved dependency closure must pass without a forced downgrade; successful installation/replacement must obey the exact CLI repair target. Subsequent observations must remain at the verified final composition. Ordinary-run and historical compatibility must remain intact, and all required evidence-utility tests must pass.

## Boundaries, risks, and cleanup

The latest stable version-7 release is an execution-time fact, not a planning prerequisite or current assertion. Its availability and compatibility may change; verify them at the specified checkpoints. Release identity freezes when a run is established, and later drift is reported rather than normalized away.

Website grouping depends on the stable full family prefix. Names that differ only in the attempt number describe retries and will not produce independent gallery projects. The explicit product slug is required for unrelated products of the same foundation and size.

Longer realistic sessions may exceed current replay limits. The first completed project's full replay and checkpoint measurements expose that risk before a whole batch accumulates. Metadata-only local preview does not establish transcript compatibility. Preserve complete evidence and pause batch expansion for the separate website handoff when support or authorized publication is missing; do not shorten the developer journey to fit the reader.

The single known historical model exception preserves `run-20260928-02`'s contract; the original run retains unknown settings and incomplete evidence. The installation schema grows additively while the asset format and existing records remain unchanged. Repair records cannot authorize a skill/model change or excuse unrelated installation drift. Compatibility follows the actual selected release and evidenced dependency closure, while subsequent identity consistency follows the verified final observation. Do not replace healthy compatible tooling just to match a default pin. This implementation creates no automatic external writes, actor orchestration, component updater, infrastructure, or deployment change.

No concrete project briefs, seed files, actor branches, transcripts, independent audit findings, component fixes, evidence releases, or rendered project previews are created by this scope. No sibling skill or website files, personal coding instructions, or installed fixture skills are edited. No tests, actor runs, website generation, or external release checks have been performed by this revision.

During planning, preserve the isolated draft edits and the preparation worktree. During approved implementation, stop task-owned runtime resources and remove disposable verification output when no longer needed; keep unresolved evidence. Preserve this plan through challenge, revision, breakdown, and unfinished implementation. At final authorized cleanup, retain durable rules in the repository documentation and remove only this task's completed planning files and empty planning directory under the external workflow. Do not alter ignore rules or sweep other planning directories.

## Approval required

Approve implementation of the eight-file documentation, template, model-policy, and bounded tooling-repair evidence scope described above in the existing main-based preparation worktree, including the initial stable version-7 release check and required evidence-utility verification. This includes exact CLI installation/replacement versus compatible preservation, subsequent verified-composition checks, independent review/correction/retry, driver-only coverage, manual successful-attempt choice, and early full replay with growth checks. The two existing draft edits must be reviewed and completed against this plan rather than accepted automatically.

Approval does not authorize concrete project creation, actor conversations, independent skill evaluation, skill/package fixes or publication, Git or Release publication, website edits, actual project previews, selection changes, or deployment. Follow the requested challenge and, if useful, breakdown process before authorizing implementation.
