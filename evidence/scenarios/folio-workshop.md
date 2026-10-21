# Folio Workshop

## Driver brief

Prepared driver brief: a standalone editorial toolkit with two connected Agent Skills. One drafts exhibit labels from supplied source notes; the other reviews labels against those notes. They share one reference for terminology, attribution, uncertainty, and length rules, with worked examples for complete, incomplete, and conflicting inputs.

Initial product facts: labels may contain up to 60 words. Dates, provenance, and attribution must come from the supplied notes; unsupported facts must not be invented. Distinguish a grounded label, a request for missing information, and a review finding. A label can satisfy its word limit and still fail factual review.

The proposed seed contains a small product README, ordinary local-development conventions, and fictional source notes, not finished skills or expected answers. Examples should make the evidence visible: a supported attribution, an absent attribution, and two same-scope notes that disagree without identifying a governing source. Keep the workflow to the two skills, one shared reference, and worked examples. Add no third skill, model service, publishing pipeline, or helper framework.

This project is intended to remain unadopted. Independent skill artifacts are the deliverable; do not plan canonical project initialization or CLI/Core installation merely because moldea is available. The small unrelated contributor-list formatting request is ordinary repository work, not a third skill.

Run selection: `run-20261021-01`, scenario `folio-workshop`, initial attempt `folio-workshop-01`, branch `fixture_skill_only_xs_folio_workshop_01`, and fixture base `c3ecda12e853b527a96c6ca81150083b0224643a`. Use two independent host Agent Skills, without canonical adoption or a runtime agent. Select Skill `v10.0.0`, tag object `34eac2b3fb6bc1039b3960cecae22e65b2a7b3d6`, resolved commit `950b89eb4c41564953fa1582fdd588992e152d37`, installed through `skills@1.7.4`. Verify installed bytes against that release; content identity is SHA-256 of the compact UTF-8 JSON array of sorted relative `{path,sha256}` file records. Actual seed SHA and installed content hash are pending. No project run has started. Earlier operating-guide release pins are not this run's selection.

## Actor setup

Shared run configuration was checked before execution: reuse the authenticated dedicated private Codex home; request `gpt-6.1-sol` at `xhigh`, workspace-write with network, approvals never, and personality none. No MCP servers or hooks are configured; the personal discovery helper is disabled. Authentication reports ChatGPT login. No credentials or personal configuration are copied. Actual host catalogs/instruction sources and effective settings must be recorded from the native session; configuration isolation is not filesystem isolation.

Use Node 24 and npm, with a task-owned writable npm cache in an allowed temporary write root. Record actual base/seed SHAs, installed Skill ref/commit/content hash and method, SDK identities where applicable, and inert initial CLI/Core/adapter observations before the first request. The target CLI is `13.0.0`; actual installed tooling and per-project Core/adapter baselines remain observations, not copied targets. Evidenced absence is valid; unavailable evidence is unknown. Do not infer initial state from a resulting lockfile.

No project seed, installed distribution, actor inference, session, or application check exists yet. Keep this brief, future requests/corrections, and reviewer criteria outside the actor worktree. The [evidence contract](../README.md) governs actual capture, settings, checkpoints, checks, privacy, recovery, and publication. The [operating guide](../../docs/simulation-workflow.md) supplies the established procedure; its earlier batch's pins are historical.

## Prospective conversation

First proposed request:

> Create two reusable Agent Skills for Folio Workshop: one that drafts exhibit labels from supplied notes and another that reviews the labels against those notes. Share the terminology and attribution rules in one reference. Labels may contain up to 60 words. Start with a small design and worked examples, then build the toolkit.

Follow real questions and results. The following phases suggest roughly six to eight substantive requests, not a quota, fixed script, or batch prompt:

1. Design and create the bounded draft/review toolkit, one shared reference, and worked examples grounded in the supplied notes.
2. Exercise a complete source example through drafting and review. Inspect actual selected instructions and outputs rather than treating the written example as an executed result.
3. Introduce notes with missing attribution. Ask for useful editorial output that preserves uncertainty and requests information when needed.
4. Introduce conflicting same-scope source notes without a resolver. Ask the skills to identify the conflicting claims and missing authority rather than choose by recency, confidence, or convenience.
5. Give the approved correction: “Our labels now have a 40-word maximum instead of 60. Update the toolkit and examples to use it.” Keep grounding and uncertainty requirements intact.
6. Ask to reorganize the shared reference for clarity while preserving unique rules and keeping both skills' references and examples coherent. Do not add reference files just to enlarge the project.
7. Request a small unrelated contributor-list formatting improvement; keep it outside the skills' responsibilities.
8. Verify actual activation, drafting/review behavior, references, and worked examples at the reached state. Combine resolved phases and stop when the toolkit is useful instead of adding features for a request count.

Only the current natural request is delivered. Do not expose future source examples, corrections, gate expectations, or reviewer criteria early. The later attempt manifest owns exact wording, native locators, source SHAs, actual checks and outputs, and deviations. Proposed phases and authored examples are not evidence of execution.

## Reviewer guidance

Assess whether the selected moldea distribution uses the independent-artifact route without unnecessary canonical setup, CLI/Core installation, or canonical status reporting. Preserve any unexpected setup work as an observed result; do not rewrite the attempt to imply that it stayed unadopted. Ordinary contributor-list work is assessed against its actual topic and repository state, without requiring an invented moldea action.

Inspect both skills' instructions, the shared reference, and worked examples together. Check that terminology and the approved 40-word rule remain coherent after maintenance, unique grounding/uncertainty rules survive reorganization, and both skills can locate and use the shared material in the actual host layout. Make no independent packaging or distribution claim that was not exercised.

Proposed behavior checks should invoke each actual skill through the selected host using supplied notes: a grounded complete label; incomplete attribution that stays unknown; conflicting claims that remain unresolved without authority; a within-limit label containing an unsupported claim that the reviewer should flag; and maintained outputs after the length change. Settle counting details in the product discussion when needed. Record actual requests, selected instructions/references, source inputs, and observed outputs. A static word count cannot establish factual grounding, correct activation, or skill reliability.

Keep artifact/file checks, directly observed skill behavior, application correctness, and evidence completeness distinct. This project is not an in-app model integration or SDK qualification, and no live-provider quality claim follows from authored examples or structural checks.

The later independent evaluator handoff belongs in the existing run review under the evidence contract. Include purpose/outcome; delivered request IDs and native event locators; exact source checkpoints; actual checks and input commits; installation/identity observations; failures, interventions, assistance, attribution, and uncertainty. Preserve editorial corrections, original findings, and retry lineage rather than turning an assisted result into an unassisted success.

Before this complementary project runs, complete the pilot's first-turn capture, independent review, privacy/integrity, and full replay gate under the later execution plan. After review, manually select attempts and provide exact public snapshot/run/selected attempt IDs, source/recording/review links, findings, limitations, and rollback selection for any authorized publication/website handoff. These identities and results remain unassigned until established; no project run or verification is claimed here.
