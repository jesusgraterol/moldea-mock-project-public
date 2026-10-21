# Aster Dispatch

## Driver brief

Prepared driver brief: one equipment-request assistant for a fictional events team. It looks up supplied inventory records and drafts a staff handoff. It has one read-only lookup capability and structured output; staff approve every dispatch. It cannot reserve equipment, change inventory, or promise that an item is safe.

Initial product facts: requests needed within 24 hours are urgent. Inventory records can establish availability, unavailability, or leave availability unknown. The result separates the recommendation, supporting record identifiers, missing facts, and required staff approval. Use supplied request/reference timestamps rather than the machine's current time. Unknown availability must not become a promise.

Proposed seed content is a small product README, ordinary local-development conventions, and fictional inventory/request examples covering those availability states. The later actor builds one assistant using the selected real LangGraph SDK. Add no second agent, UI, approval service, extra lookup tool, credentials, or live operational integration. The independent contact-list exporter is small unrelated work, not another assistant capability.

Run selection: `run-20261021-01`, scenario `aster-dispatch`, initial attempt `aster-dispatch-01`, branch `fixture_langgraph_xs_aster_dispatch_01`, and fixture base `c3ecda12e853b527a96c6ca81150083b0224643a`. Use LangGraph 1.5.1 with @langchain/core 1.2.20. Select Skill `v10.0.0`, tag object `34eac2b3fb6bc1039b3960cecae22e65b2a7b3d6`, resolved commit `950b89eb4c41564953fa1582fdd588992e152d37`, installed through `skills@1.7.4`. Verify installed bytes against that release; content identity is SHA-256 of the compact UTF-8 JSON array of sorted relative `{path,sha256}` file records. Actual seed: `066ef7578ec935fe9f3532bcd59759eb6a91f7cf`; the 36 installed files match the immutable release byte-for-byte, with content hash `f035aedbbebefeb7905e066369ca411924ce57c5dd9a9f7b801cde0344530fc4`. Six requests concluded in session `01a15fe7-8015-7f12-a6a5-4c02617ad9a9`, reaching `beb77a2ce6c7f2377a3d4dcd2966bc0217ab79b1`. Independent source/skill-behavior review passed; published asset integrity passed; full functional replay and the pilot expansion gate passed, with the inherited moderate viewer landmark-naming finding retained. Earlier operating-guide release pins are not this run's selection.

Keep this brief, future requests, and reviewer criteria outside the actor worktree. Seed only initial product facts and the later selected distribution; do not reveal the future urgency correction or anticipated review findings.

## Actor setup

Shared run configuration was checked before execution: reuse the authenticated dedicated private Codex home; request `gpt-6.1-sol` at `xhigh`, workspace-write with network, approvals never, and personality none. No MCP servers or hooks are configured; the personal discovery helper is disabled. Authentication reports ChatGPT login. No credentials or personal configuration are copied. Actual host catalogs/instruction sources and effective settings must be recorded from the native session; configuration isolation is not filesystem isolation.

Use Node 24 and npm, with a task-owned writable npm cache in an allowed temporary write root. Record actual base/seed SHAs, installed Skill ref/commit/content hash and method, SDK identities where applicable, and inert initial CLI/Core/adapter observations before the first request. The target CLI is `13.0.0`; actual installed tooling and per-project Core/adapter baselines remain observations, not copied targets. Evidenced absence is valid; unavailable evidence is unknown. Do not infer initial state from a resulting lockfile.

Actual observations: Node 24.15.0, npm 11.12.1, host 0.163.0 as provenance, and six native contexts confirming the requested model/effort and permissions. CLI/Core were absent before adoption; afterward CLI 13.0.0, Core 9.0.0 and repository/repository-fs 4.0.0 established this attempt's baseline. The actor used project-local moldea instructions plus the host catalog and selected jg-node, jg-zod and jg-bash guidance. The dedicated home does not isolate filesystem reads. All 41 final assistant tests, 54 final exporter tests and typechecking passed in actor execution; independent reruns passed at the final source. Exact requests, observations and checkpoints belong to [the actual attempt](../runs/run-20261021-01/attempts/aster-dispatch-01.json). Keep this brief, future requests/corrections, and reviewer criteria outside the actor worktree. The [evidence contract](../README.md) governs actual capture, settings, checkpoints, checks, privacy, recovery, and publication. The [operating guide](../../docs/simulation-workflow.md) supplies the established procedure; its earlier batch's pins are historical.

## Prospective conversation

First proposed request:

> Initialize moldea for Aster Dispatch, a small equipment-request assistant for an events team. It should look up fictional inventory records and draft a handoff for staff. Requests needed within 24 hours are urgent. Staff approve every dispatch. Propose a small approach first; hold off on implementing the assistant.

Continue from actual questions and results. These phases suggest roughly six to eight substantive requests, not a quota, fixed script, or batch prompt:

1. Establish context and discuss the smallest single-assistant approach, without implementing the assistant yet.
2. Once the approach is settled, explicitly authorize implementation of the assistant, its read-only lookup, and structured staff handoff using fictional local inputs.
3. Follow up on an unknown-availability case: preserve uncertainty, identify the missing information, and avoid dispatch promises. Combine this with implementation if already fully addressed.
4. Request a separate contact-list exporter using fictional staff records. Keep it outside the assistant's capabilities.
5. Give the product correction naturally: “We have approved a 48-hour urgency window instead of 24 hours. Update the assistant and its checks to use it.” The request authorizes the affected implementation and maintenance; staff authority is unchanged.
6. Reconcile any resulting questions and verify that maintained instructions, the consumed instruction, and output behavior agree with the approved window. Do not add a redundant request if the correction already established this evidence.
7. Refine the contact-list exporter's ordering or output formatting without expanding the assistant.
8. Check the final usage examples and reached behavior, then stop when the bounded product is complete.

Deliver only the current request and respond to real clarification needs. Do not supply gate outcomes, expected command sequences, or evaluator criteria to the actor. The later attempt manifest owns exact delivered wording, native locators, before/after source SHAs, actual checks, observed results, and deviations. These proposed phases are not delivered evidence.

## Reviewer guidance

Assess initial adoption and actual follow-up routing through the selected skill. Check useful context maintenance after the 24-to-48-hour correction and appropriate restraint during unrelated exporter work. Determine exporter relevance from its actual paths and declared relationships; do not require a gate miss regardless of the resulting implementation.

Proposed application checks should run the real selected SDK while controlling only the model boundary. Inspect the actual instruction delivered there, exercise the real lookup path, and verify structured results for available, unavailable, and unknown records. Check the urgency boundary with supplied timestamps before and after the approved correction. Verify missing/unsupported identifiers, preserved uncertainty, and the staff-approval boundary. Inspect that the exporter does not become an assistant tool.

Separate source wiring and canonical/file/export validation from actual runtime instruction consumption. A manifest, passing structural validation, or actor assertion alone does not prove SDK execution. Controlled model responses establish only the behavior actually exercised; no live provider quality or operational dispatch is claimed. Record checks with their actual input commits and results only when performed.

The later evaluator handoff belongs in the existing run review under the evidence contract. Include purpose and outcome; delivered request IDs and native event locators; exact source checkpoints; actual checks/input commits; installation/identity evidence; failures, interventions, assistance, attribution, and uncertainty; and any untested behavior. Keep application correctness, skill behavior, evidence completeness, and cause separate. Preserve original evidence and retry lineage rather than rewriting an assisted result as unassisted success.

Aster is the proposed pilot. Capture and reconcile its first real turn before dependent follow-ups. Before expanding the batch, complete privacy/integrity verification, independent source/skill-behavior review, and full conversation replay. Later manual selection and publication/website handoff must include the exact public snapshot/run/selected attempt IDs, source/recording/review links, limitations, and rollback selection. The first-turn capture/settings check passed before follow-ups. Independent source/skill-behavior review passed. Privacy/public asset integrity verification passed. Full functional public replay and the expansion gate passed at desktop/mobile widths in both themes; the inherited moderate viewer landmark-naming finding remains open. The other five projects remain unstarted.
