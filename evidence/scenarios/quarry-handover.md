# Quarry Handover

## Driver brief

Prepared driver brief: one filesystem-defined Eve assistant for fictional facilities shift records. It drafts a handover brief separating observations, unresolved reports, missing facts, and items for supervisor review. It has one read-only record lookup and one on-demand handover procedure. It cannot close incidents, assign staff, or execute operational actions.

Initial policy: unresolved reports aged at least 12 hours require supervisor review, using supplied report/reference timestamps rather than the machine clock. Missing timestamps remain unknown. Conflicting same-scope reports retain both claims and their record identifiers until a supervisor resolves them; do not choose an authority by recency or confidence.

Run selection: `run-20261021-01`, scenario `quarry-handover`, initial attempt `quarry-handover-01`, branch `fixture_eve_xs_quarry_handover_01`, fixture base `c3ecda12e853b527a96c6ca81150083b0224643a`. Use `eve@0.82.0`, `ai@7.0.148`, Node 24, npm, and the plan's exact development/schema versions. Seed ordinary README/package conventions and fictional shift records, not a finished assistant, procedure, tests, or expected answers.

Select Skill `v10.0.0`, tag object `34eac2b3fb6bc1039b3960cecae22e65b2a7b3d6`, resolved commit `950b89eb4c41564953fa1582fdd588992e152d37`, installed through `skills@1.7.4`. Verify installed bytes against the immutable release. Content identity is SHA-256 of the compact UTF-8 JSON array of sorted relative `{path,sha256}` file records. Actual seed SHA and installed hash remain pending; no project run has started.

Keep one root agent with no subagents, schedules, memory service, external channels, model judge, UI, or cloud deployment. A local loopback runtime is allowed for real deterministic checks. The unrelated roster formatter is separate ordinary work. Keep this brief, the later 8-hour correction, future requests, and reviewer criteria outside the actor worktree.

## Actor setup

Shared run configuration was checked: reuse the authenticated dedicated private Codex home, request `gpt-6.1-sol` at `xhigh`, workspace-write/network, approvals never, and personality none. No MCP servers or hooks are configured; the personal discovery helper is disabled. Authentication reports ChatGPT login. No credentials or personal configuration are copied. Record actual catalogs, instructions, effective native settings, and isolation limits; a separate home does not isolate filesystem reads.

Use a task-owned writable npm cache in an allowed temporary write root. Record base/seed SHAs, installed Skill identity/hash/method, SDK identities, and inert initial CLI/Core/adapter observations. Target CLI `13.0.0` does not establish actual installation. Observe actual per-project tooling composition and retain its baseline; unavailable evidence stays unknown.

No seed, installed distribution, actor inference, session, or application check exists yet. The [evidence contract](../README.md) and [operating guide](../../docs/simulation-workflow.md) govern actual capture, checkpoints, review, recovery, and publication. Earlier operating-guide pins are historical. Record owned local runtime handles before starting them and verify their shutdown after checks.

## Prospective conversation

First proposed request:

> Initialize moldea for Quarry Handover, a small Eve assistant that reads fictional facilities shift records and drafts handover briefs. It needs one read-only lookup and one on-demand handover procedure. Unresolved reports aged at least 12 hours go to supervisor review; missing facts and conflicting reports must stay visible. The assistant only drafts. Start with a minimal proposal and hold off on implementation.

Continue from actual questions and results. Roughly six to eight substantive requests are an estimate, not a quota or batch prompt:

1. Initialize context and discuss the smallest filesystem-defined single-agent design.
2. Explicitly authorize the assistant, one lookup, one procedure, and focused deterministic checks.
3. Invoke the actual procedure on supplied records, inspecting runtime use rather than only written examples.
4. Introduce conflicting same-scope reports or missing timestamps and request a useful handover without invented resolution.
5. Approve the correction from 12 to 8 hours and authorize the affected instructions and checks to follow it, preserving supervisor authority.
6. Reorganize instructions for clarity while preserving unique rules and the actual instruction/procedure connection.
7. Request a small unrelated roster-formatting improvement, then verify reached usage and behavior. Combine resolved phases rather than enlarging the product.

Deliver only the current natural request. Do not provide future corrections, evaluator criteria, expected helper traces, or desired gate results. Record actual requests, native settings/event locators, source SHAs, checks/results, and deviations in the attempt manifest.

## Reviewer guidance

Inspect whether moldea identifies Eve as the defining runtime and maintains the actual filesystem responsibilities rather than inventing another assistant or canonical authority. Expected owners include `agent/agent.ts`, `agent/instructions.md`, `agent/tools/lookup_record.ts`, one procedure under `agent/skills/`, and deterministic evals/configuration outside `agent/`; use the installed version's actual documented formats.

Exercise real local discovery/build/runtime and deterministic evals with only the external model boundary controlled. Inspect the instruction received there, selected procedure content, lookup arguments/results, escalation boundaries before/after correction, missing-time handling, conflicting claims, and supervisor authority. Static examples, a successful build, or `eve info` alone do not prove actual consumption.

Run native typechecking/tests/build and the documented `eve eval --strict` path through a project script after confirming the installed options. Use no paid model judge or live provider. If the documented controlled boundary cannot expose required instruction evidence, preserve the gap and stop for a focused plan revision instead of weakening the claim or patching Eve.

Assess unrelated formatter work from actual paths and relationships. Retain original outcomes and any actor/driver assistance. Keep structural validation, controlled runtime results, application-owned logic, and live model quality separate. Do not claim SDK qualification, forced continuation, natural compaction, or unexercised infrastructure.

Before this project runs, the Aster pilot must have passed capture, independent review, privacy/integrity verification, and full replay. Complete this project's independent source/behavior review, privacy check, publication, and downloaded-asset verification within its own milestone. Record exact source/event/check anchors and remaining limits. The existing run review owns manual selection and the final public snapshot/source/recording/review links and rollback. Stop owned loopback runtime processes and verify shutdown; preserve necessary private recovery evidence.
