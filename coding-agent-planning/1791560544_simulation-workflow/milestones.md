# Simulation workflow preparation milestones

## Basis and boundaries

This sequence implements [plan.md](./plan.md), SHA-256 `48e7cc18ddaa8c283a51e7ce7dcb3441a2a9e230b4fa08addcda1b2c513d891e`. All three milestones are pending; the plan and sequence still require approval.

Use the existing `../moldea-mock-project-public-workflow` worktree on `docs/simulation-workflow`, based on main commit `3f6a75b9e7372635c745d1b8048224aefd2266e5`. Preserve the clean original fixture checkout and unrelated work. The two existing edits in `scripts/evidence/evidence.mjs` and `scripts/evidence/evidence.test-integration.mjs` are untested drafts to inspect and correct, not completed work.

The complete implementation scope comprises eight files: `README.md`, new `docs/simulation-workflow.md`, new `docs/project-naming.md`, new `evidence/scenarios/template.md`, `evidence/README.md`, `scripts/evidence/types.mjs`, `scripts/evidence/evidence.mjs`, and `scripts/evidence/evidence.test-integration.mjs`. Shared files are revisited only for the behavior owned by that milestone.

Concrete project selection, seeds, actor branches or conversations, skill evaluation, component fixes or releases, Git publication, asset publication, actual project previews, website edits, selection updates, and deployment remain subsequent work. Keep existing records, original scenarios, fixture refs, package manifests, lockfiles, protected instruction files, and the sibling skill repository unchanged. Do not copy the developer's personal coding instructions into operating documentation or actor materials.

## Milestone 1 — Actor policy and historical compatibility

**Objective:** Require `gpt-6.1-sol` at `xhigh` for new runs while preserving the actual historical contracts and truthful deviation evidence.

**Dependencies:** Approval of this sequence and explicit authorization to implement Milestone 1. No version-7 release or actor session is required to complete this preparation slice.

**Scope and implementation:**

- Recheck both worktrees and the main baseline before implementation. Inspect the two existing draft edits against the plan.
- At this first implementation checkpoint, consult official release sources for the latest published stable skill satisfying `^7.0.0`. Report the actual observation and exact identity if available. If unavailable, continue preparation and leave actor execution pending. Do not install a guessed version, prerelease, development checkout, or version-6 fallback.
- In `scripts/evidence/evidence.mjs`, finish the required actor policy in `requiredActor` and `validateAttempt`. Keep the known old-model exception only for `run-20260928-02`.
- In `scripts/evidence/evidence.test-integration.mjs`, finish the actor-policy fixtures and remove the invented complete fixture and inferred model exception for `historical-20260927`. Preserve that run's actual unknown expected-actor shape and incomplete distinction.
- Update the directly affected actor, history, and prerequisite prose in `evidence/README.md`. Require the new model for every future turn, follow-up, and resumption; distinguish requested settings from native effective settings and deviations. Replace obsolete universal September-version requirements with stable version-7 discovery and pinning procedures, without asserting an unreleased composition.

**Verification:**

- Cover new-model success, old-model rejection for new runs, the single known historical exception, historical unknown/incomplete records, rejection of unknown required settings in complete evidence, incorrect effort, native settings integrity, and truthful deviation accounting.
- Run `npm run test:integration`, then `npm test`, using Node 24 or later and existing dependencies. Reinstall only if required, preserving the lockfile and disabling lifecycle scripts.
- Run `git diff --check` and inspect the scoped diff. Use disposable synthetic repositories and assets with existing teardown; invoke no actors or moldea executable.

**Acceptance:** New-run actor requirements and historical behavior agree with the unchanged records. Complete evidence can truthfully describe deviations without certifying compliance. Required checks pass, and the actual release-discovery result is reported without claiming actor readiness.

**Review checkpoint:** Inspect the narrow historical exception, original unknown settings, requested/effective/deviation behavior, and removal of unsupported draft assumptions before continuing.

## Milestone 2 — Authorized tooling-repair evidence

**Objective:** Preserve complete evidence of authorized tooling journeys, including missing or broken starting states, healthy no-op preservation, mixed repairs, and terminal failures, without weakening ordinary checks.

**Dependencies:** Milestone 1 completed and reviewed; explicit authorization to implement Milestone 2. Tests use inert synthetic identities and do not depend on an available skill release.

**Scope and implementation:**

- In `scripts/evidence/types.mjs`, factor a private shared composition shape and extend component observations additively. Retain legacy CLI/Core and named adapter records; add absent, unknown, and ineligible states with reasons and known-or-unknown facts. Distinguish an empty known adapter inventory from an unknown inventory. Keep mandatory released-skill identity, existing exports, and format version 1.
- Add optional closed `AttemptSchema.toolingRepairs` records with authorization request, reason, unique component scope, first/last turn locators, completion request, outcome, `cliAction`, and a final observation with source and input commit. Preserve explicit pending/unknown states; reuse the initial per-turn observation rather than duplicating it.
- In `scripts/evidence/evidence.mjs`, add one private repair-validation path within `validateAttempt`. Reuse existing request, source, check, asset, and turn validation. Expose only necessary verified native ordering and boundary facts from `verifyAsset`; retain the existing parser and capture output.
- Bind authorization and completion to actual native requests and turns. Validate chronology, unique authorization references, nonoverlapping windows, component scope, and initial/per-turn/final provenance. Ambiguous binding or later retrospective authorization cannot justify complete repair evidence.
- Preserve ordinary prerequisite matching until the validated repair window. Within it, allow only authorized component changes or unavailable states; preserve unrelated identities, selected skill ref/hash, and actor settings/deviation checks. Source-backed compatible unchanged dependencies may differ from default run versions.
- Require a matching `tooling repair verification` check, final input commit bound to the completion request's after-commit, and evidence of the CLI action and actual compatible Core/adapter closure. A positive outcome requires known eligible final tooling and passed verification. Compatibility is evidenced against the selected release, not inferred from a newer version number.
- Enforce the exact selected skill CLI target and artifact identity when installing or replacing. Accept actual healthy compatible versions when preserving the CLI, including an overall repair that changes only authorized Core/adapters. An unchanged outcome must preserve relevant installed identities and source state.
- Use the verified final actual composition as the baseline for subsequent observations. Reject later unexplained identity changes even if another version is compatible. Preserve terminal failed repairs with linked failure and actual final states; complete evidence must not allow dependent ordinary work to resume on an unverified composition.
- Synchronize `evidence/README.md` with the schema, prerequisites versus observations, repair checks, completeness/failure semantics, inert eligibility observations, and review boundary. Document that old records need no migration, while new repair records require the associated updated utility revision. The utility records and verifies evidence; it never executes installed tooling, repairs packages, or grades skill behavior.

**Verification:**

- Extend `scripts/evidence/evidence.test-integration.mjs` using existing disposable repositories, real capture/verifier paths, and teardown. Keep capture unit tests unchanged.
- Cover legacy ordinary records and mismatch rejection; absent/unknown/ineligible component and inventory states; multi-turn and last-turn repair completion; exact CLI replacement target acceptance and wrong-target rejection.
- Cover the synthetic healthy newer-compatible no-op (target `10.0.0`, actual `10.0.1`), different verified Core/adapter closure, and mixed repairs preserving the CLI. Reject missing or failed compatibility verification and inconsistent CLI actions.
- Cover subsequent unauthorized CLI/Core/adapter drift, terminal failed versus incomplete/successful outcomes, missing/wrong endpoints and authorization, reversed/overlapping windows, ambiguous native binding, unrelated changes, missing/tampered observations, check/commit/asset mismatches, unverified identities, and attempted bypass of skill/model/native-deviation checks.
- Keep fixtures inert; verify an ineligible executable sentinel remains uninvoked. No registry, provider, actor, moldea execution, or website invocation belongs in these tests.
- Run `npm run test:integration`, then `npm test`, and `git diff --check`. Review the complete milestone diff and confirm historical records and ordinary validation remain intact.

**Acceptance:** Both exact installation/replacement and compatible preservation work with truthful observations and verified final baselines. Failed and incomplete journeys remain distinct. No repair exception permits unrelated drift or changed skill/model pins. Required tests pass without a new framework, dependency, compatibility engine, launcher, or asset-format change.

**Review checkpoint:** Inspect authorization/native binding, observation-state semantics, preserved versus replaced CLI rules, dependency-closure evidence, final baseline enforcement, and the distinction between structural verification and independent compatibility review.

## Milestone 3 — Reusable operating, naming, and website handoff documentation

**Objective:** Make future simulations repeatable from repository documentation, with realistic developer conversations, complete assets, independent review and retries, and an early publication-compatibility gate.

**Dependencies:** Milestones 1 and 2 completed and reviewed; explicit authorization to implement Milestone 3. Actual project selection, native-export preflight execution, public staging, and full replay remain later authorized activities.

**Scope and implementation:**

- Update `README.md` with navigation, repository purpose, driver/actor/auditor responsibilities, and website use; retain the original 14-project index and facts.
- Add `docs/project-naming.md`: `fixture_<foundation>_<size>_<project_slug>_<attempt>`, distinct products, qualitative `xs/s/m/l/xl` sizes, unsized baseline treatment, stable family identity, portable names within existing limits, and run/scenario/attempt/branch/asset distinctions. New families start at `01`; justified fresh retries increment the suffix, retain predecessors and evidence, and keep foundation, size, and slug. Ordinary follow-ups stay in the same attempt. Naming examples do not select concrete projects.
- Add `docs/simulation-workflow.md` and a clearly unexecuted `evidence/scenarios/template.md`. Keep private driver/audit material outside actor-visible seeds. Document meaningful working artifacts, seed provenance, clean fixture-base preparation, project-local released skill installation, adaptive product phases, actual developer wording and checkpoints, actor checks, interventions, failures, recovery, and limitations.
- Include the short driver-only coverage outline: runtime instruction consumption, context discovery/maintenance, relevance/silence, authorization, and repair including healthy no-change inspection. Use plausible product triggers across suitable projects, without mandatory per-project quotas, grading, or coaching expected moldea operations.
- Document the independent review/cause/correction/retry cycle. Skill/package defects require the affected correction to be published and verified before a fresh attempt; runner defects require runner fixes. Isolated model mistakes do not automatically justify skill instructions. Preserve earlier attempts and unresolved attribution.
- Document release selection and immutable run pins, repeat discovery before later actor execution when no run identity is frozen, and inert tooling eligibility observations. Include the plan's explicit-model/stdin initial and explicit-session-ID resume command forms. Distinguish stdout execution events from native capture history. Require a supported native-history procedure and parser compatibility before starting, then reconcile the first actual session ID before follow-up. Mark currently unestablished export capabilities pending; do not invent commands or run a probe.
- Preserve existing capture, redaction, private staging, sidecar, recovery, source-checkpoint, Git, and Release-asset procedures. Explain reviewed sanitized bytes, exact tags/names/hashes/sizes/media/event ranges, commit/tag distinctions, no overwrites, restoration verification, publication authorization, and retention until durable storage is verified.
- Document manual successful-attempt choice from independent review, pending/chosen IDs and references in existing handoff prose, and reconciliation with the website's actual run/history selection. Retain earlier evidence; use a separate handoff when selections cannot express the choices. Add no registry, automatic pass inference, invented runs, or visitor selector.
- Require first-completed-project capture and local full replay before batch expansion, plus compressed/expanded growth and session-count checks at existing checkpoints. Retain one session asset per attempt and existing 8 MiB bounds. Preserve full conversations; never trim meaningful work or disguise continuations as attempts.
- Document the existing public-source development preview, after separately authorized privacy-reviewed staging, using a private selection file and isolated sibling checkout. Include the plan's generation and local Astro commands; explain that local-record preview omits replay. Keep website source and deployed selection untouched, coordinate with its maintainer, stop task-owned servers, and block batch expansion if full replay or authorized staging is unavailable.
- Complete workflow/review/publication cross-links in `evidence/README.md`, keeping it authoritative for schemas and capture rather than duplicating those contracts.

**Verification:**

- Inspect Markdown links and documented host/preview interfaces. Walk through ordinary work, inert ineligible starting states, authorized repair, healthy no-op, terminal failure, published-fix retry, explicit-ID continuation, capture/recovery, asset publication, manual choice, and full replay gates on paper.
- Check that driver-only material stays outside actor-visible content and every future action is either executable through the documented existing interfaces or explicitly pending/blocked. Do not create a project, session, release, public selection, or preview.
- Run `git diff --check` and review the complete eight-file result against the recorded main base. Confirm unchanged evidence index/run records, original scenarios and fixture refs, manifests/lockfiles, protected instructions, and sibling skill files. Review required cleanup and retained resources.
- Reuse Milestone 2's passed automated checks when executable inputs remain unchanged; rerun affected checks only if new changes or concerns justify it. Do not add prose tests or formatting tools. Report checks actually performed and limitations; do not claim real historical assets were downloaded and reverified.
- Preserve this plan and milestone file through unfinished work. Stop task-owned resources and remove disposable verification output while retaining unresolved evidence. Only at final authorized workflow cleanup remove this task's completed planning files and empty directory; do not sweep other work or alter ignore rules.

**Acceptance:** A maintainer can follow the documentation to prepare distinct XS products, conduct realistic conversations, record ordinary and repair journeys, preserve failures and assets, obtain independent review, create justified numbered retries, and hand manually chosen attempts to the website maintainer. Naming, release/model pins, driver coverage, asset ownership, early full replay, and growth constraints are explicit. Preparation is not represented as executed actor, release, review, or website work.

**Review checkpoint:** Inspect the full maintainer journey, documentation ownership and cross-links, actor-visible separation, causal retry rules, public/private asset boundaries, and feasibility or explicit blockers of capture and website handoff. Review the finished scoped diff and verification report before any publication workflow.

## Approval required

Approve the current plan and this complete three-milestone sequence: actor/history policy, authorized tooling-repair evidence, and reusable operating/naming/publication documentation.

Under the external planning workflow requested for this work, sequence approval alone does not authorize implementation. Each milestone needs explicit authorization identifying it; approval may be combined with authorization for one specific milestone. After implementing and verifying that milestone, stop for its review and the next authorization. No approval is inferred from this breakdown, and the excluded actor, skill/package, publication, and website activities remain outside scope.
