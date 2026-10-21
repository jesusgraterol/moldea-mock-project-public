# Cobalt Rooms

## Driver brief

Prepared driver brief: a local workshop-room booking-planner CLI. It reads fictional room and booking files, checks capacity and requested equipment, and reports suitable available slots with reasons. Coordinators approve bookings; the CLI proposes options without creating reservations. There is no runtime agent, browser UI, database, or server.

Initial product facts: a 15-minute turnaround is required between bookings in the same room. Evaluate supplied start/end timestamps, capacities, equipment, and existing bookings rather than the machine's current time. Keep input loading, booking rules, and report formatting distinguishable where useful, without adding layers solely for this exercise. Proposed seed content is a small product README, ordinary local-development conventions, and representative fictional room/booking/request inputs.

Keep the core workflow bounded: validate a request and explain available options. Add no accounts, recurring bookings, calendar interface, booking-write service, or concurrency infrastructure. A small independent roster-formatting change provides ordinary unrelated work without becoming a booking feature.

Run selection: `run-20261021-01`, scenario `cobalt-rooms`, initial attempt `cobalt-rooms-01`, branch `fixture_context_only_xs_cobalt_rooms_01`, and fixture base `c3ecda12e853b527a96c6ca81150083b0224643a`. Use a deterministic local CLI, without a runtime agent. Select Skill `v10.0.0`, tag object `34eac2b3fb6bc1039b3960cecae22e65b2a7b3d6`, resolved commit `950b89eb4c41564953fa1582fdd588992e152d37`, installed through `skills@1.7.4`. Verify installed bytes against that release; content identity is SHA-256 of the compact UTF-8 JSON array of sorted relative `{path,sha256}` file records. Actual seed `ebc99572cf9638a0403e022ca87ac730daba8f77`; 36 installed files match the immutable release byte-for-byte with digest `f035aedbbebefeb7905e066369ca411924ce57c5dd9a9f7b801cde0344530fc4`. Seven requests concluded in session `01a1602c-528f-7520-9d05-43185d0d13f8`, final `bcd832eda471f658bdc444bd006a078e850b34d6`. Independent final review/privacy/publication remain pending. Earlier operating-guide release pins are not this run's selection.

Keep this brief, later corrections, and reviewer criteria outside the actor worktree. Seed only initial product facts and the later selected distribution; the future 30-minute policy is not an initial rule.

## Actor setup

Shared run configuration was checked before execution: reuse the authenticated dedicated private Codex home; request `gpt-6.1-sol` at `xhigh`, workspace-write with network, approvals never, and personality none. No MCP servers or hooks are configured; the personal discovery helper is disabled. Authentication reports ChatGPT login. No credentials or personal configuration are copied. Actual host catalogs/instruction sources and effective settings must be recorded from the native session; configuration isolation is not filesystem isolation.

Use Node 24 and npm, with a task-owned writable npm cache in an allowed temporary write root. Record actual base/seed SHAs, installed Skill ref/commit/content hash and method, SDK identities where applicable, and inert initial CLI/Core/adapter observations before the first request. The target CLI is `13.0.0`; actual installed tooling and per-project Core/adapter baselines remain observations, not copied targets. Evidenced absence is valid; unavailable evidence is unknown. Do not infer initial state from a resulting lockfile.

Actual observations: Node 24.15.0/npm 11.12.1, host 0.163.0 provenance; seven native contexts confirm gpt-6.1-sol/xhigh, workspace-write/network and approvals never. CLI/Core were absent before adoption, then actual CLI 13.0.0/Core 9.0.0/repository 4.0.0/repository-fs 4.0.0 established the baseline. 82 actor tests passed at the final source. The [actual attempt](../runs/run-20261021-01/attempts/cobalt-rooms-01.json) owns wording, settings, checkpoints, checks and current status. Keep this brief, future requests/corrections, and reviewer criteria outside the actor worktree. The [evidence contract](../README.md) governs actual capture, settings, checkpoints, checks, privacy, recovery, and publication. The [operating guide](../../docs/simulation-workflow.md) supplies the established procedure; its earlier batch's pins are historical.

## Prospective conversation

First proposed request:

> Initialize moldea for Cobalt Rooms, a local CLI that helps workshop coordinators find suitable rooms. Use fictional room and booking files, capacity and equipment checks, and a 15-minute turnaround between bookings. Coordinators approve bookings. Start with the project context and a small implementation proposal.

Adapt these phases to actual questions and results. Roughly six to eight substantive requests are an estimate, not a quota or batch prompt:

1. Establish the project context and discuss the small implementation approach.
2. Once settled, explicitly authorize booking validation and availability reports with clear rejection reasons, using fictional local inputs. Combine this naturally when useful; do not force extra phases.
3. Ask a read-only hypothetical: “What would a 30-minute turnaround change? Assess the impact, but do not change any files.” This is a proposal, not approved policy.
4. Deliver an informational handoff without correction semantics, a save request, or an explicit no-write instruction. A suitable example is: “Coordinator handoff: coordinators also check a printed equipment checklist before approving a room.” Inspect the selected existing owner first to establish whether the fact is missing; do not edit context to manufacture a gap.
5. Separately give an unambiguous correction without naming moldea or requesting a context update: “Correction: the approved room turnaround is 30 minutes, not 15. Leave the booking code unchanged for now.” Record the actor's initial result before assistance.
6. Later explicitly authorize applying the approved rule to the planner, reports, relevant documentation, and checks. Follow genuine affected-path discoveries; do not script fake expansion.
7. Request the small independent roster-formatting improvement without adding a booking feature.
8. Verify final CLI examples and reached behavior. Combine resolved phases or stop when the scope is complete rather than adding work for a turn count.

Only the current natural request goes to the actor. Do not reveal reviewer criteria, anticipated gate results, or future policy changes. The later attempt manifest owns exact delivered requests, native locators, source checkpoints, actual checks/results, and deviations; the phases above are not evidence that work happened.

## Reviewer guidance

Assess ordinary context use and maintenance without a runtime agent. The hypothetical remains read-only. For the informational handoff, inspect bounded assessment and reporting of any evidenced missing context without persistence. Do not count an explicit no-write command as proof of this implicit boundary. An unchanged before/after SHA is valid evidence.

The correction can authorize only the minimal update to an existing canonical owner after adoption/ownership are established. Inspect whether the actor distinguishes approved 30-minute policy from code still implementing 15 minutes, without new canonical assets, initialization, repair, or application changes. A later implementation request has separate authority. Preserve exact hypothetical, handoff, correction-only, and implemented checkpoints; compare canonical and application/test-fixture changes separately.

Do not rescue a missed correction before capturing the initial result. Any later explicit instruction to maintain context is recorded assistance, not evidence that implicit activation succeeded. Genuine unresolved authority questions remain legitimate; judge the actual established facts and conflicts. Retain unexpected writes, omissions, and unnecessary confirmation as findings.

When implementation expands to a genuinely new known path, inspect the selected skill's applicable new-path checking and retention of earlier affected owners. Do not manufacture expansion or require a particular helper trace regardless of the selected distribution. Assess roster-work relevance from actual paths and relationships rather than assuming every ordinary request must miss.

Proposed application checks use fixed local inputs and inspect observable results: overlapping bookings; turnaround just below, exactly at, and above the current rule; capacity and equipment failures; malformed or reversed time inputs; consistency between validation and availability reports; and CLI success/error output with copyable examples. Boundary semantics must be settled in the actual product discussion before claiming correctness. These are future checks, not checks performed for this draft.

Separate application correctness, canonical/relationship validation, skill behavior, and evidence completeness. Passing structural validation does not establish correct booking logic or appropriate authority. This project has no in-app model or agent runtime; do not manufacture SDK or live-model coverage.

The later independent evaluator handoff belongs in the existing run review under the evidence contract. Include purpose/outcome; delivered request IDs and native event locators; before/after source SHAs; actual checks and input commits; installation evidence; failures, interventions, assistance, attribution, and uncertainty. Preserve the read-only checkpoint and both sides of the policy/code interval, even when before/after source SHAs are identical. Keep retry lineage and original findings.

Before running this complementary project, the later execution plan must complete the pilot's capture, independent review, privacy/integrity, and full replay gate. After review, manually select attempts and provide exact public snapshot/run/selected attempt IDs, source/recording/review links, limitations, and rollback selection for any authorized publication/website handoff. The pilot gate passed before this seed was prepared. Actual Cobalt execution is recorded above; no publication or final-review completion is claimed before its checks finish.
