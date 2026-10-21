# Cinder Returns

## Driver brief

Prepared driver brief: one return-recommendation assistant using Vercel AI SDK. It reads fictional order records through one read-only lookup and produces a structured recommendation for staff. Staff approve every decision; the assistant cannot issue refunds, create returns, or change orders. Add no second assistant, UI, database, or operational integration.

Initial policy: a return may be recommended within 30 elapsed 24-hour days from delivery, inclusive at the exact boundary. Evaluate supplied UTC delivery/request timestamps instead of the machine clock. Missing delivery facts and unknown order identifiers remain unknown. Separate the recommendation, supporting order identifiers, missing facts, and staff approval. A lookup failure must not become evidence of eligibility.

Run selection: `run-20261021-01`, scenario `cinder-returns`, initial attempt `cinder-returns-01`, branch `fixture_vercel_ai_sdk_xs_cinder_returns_01`, fixture base `c3ecda12e853b527a96c6ca81150083b0224643a`. Use `ai@7.0.148`, Node 24, npm, and the plan's exact development/schema versions. Seed a small README, package conventions, and fictional order/request inputs, not a finished assistant or expected answers.

Select Skill `v10.0.0`, tag object `34eac2b3fb6bc1039b3960cecae22e65b2a7b3d6`, resolved commit `950b89eb4c41564953fa1582fdd588992e152d37`, installed through `skills@1.7.4`. Verify installed bytes against the immutable release. Content identity is SHA-256 of the compact UTF-8 JSON array of sorted relative `{path,sha256}` file records. Actual seed SHA and installed hash remain pending; no project run has started.

Keep this brief, future requests, the later 21-day correction, and reviewer criteria outside the actor worktree. The unrelated order-reference exporter remains ordinary separate work, not another assistant capability.

## Actor setup

Shared run configuration was checked: reuse the authenticated dedicated private Codex home, request `gpt-6.1-sol` at `xhigh`, workspace-write/network, approvals never, and personality none. No MCP servers or hooks are configured; the personal discovery helper is disabled. Authentication reports ChatGPT login. No credentials or personal configuration are copied. Record actual host catalogs, instructions, and effective native settings; configuration isolation is not filesystem isolation.

Use a task-owned writable npm cache in an allowed temporary write root. Before the first request, record actual base/seed SHAs, installed Skill identity/hash/method, runtime identity, and inert CLI/Core/adapter observations. Fresh adoption starts without CLI/Core; target CLI `13.0.0` is not an observed installation. Establish actual Core/adapters per project and retain its baseline. Unavailable evidence is unknown, not absence.

No seed, installed distribution, actor inference, session, or application check exists yet. The [evidence contract](../README.md) and [operating guide](../../docs/simulation-workflow.md) govern capture, source checkpoints, review, recovery, and publication; the guide's earlier batch pins are historical.

## Prospective conversation

First proposed request:

> Initialize moldea for Cinder Returns, a small assistant using Vercel AI SDK that looks up fictional order records and drafts structured return recommendations for staff. Our return window is 30 elapsed days from delivery, including the exact boundary. Missing delivery facts stay unknown, and staff approve every decision. Start with a small proposal; hold off on implementing the assistant.

Adapt these phases to actual questions and results. Roughly six to eight substantive requests are an estimate, not a quota or batch prompt:

1. Initialize context and settle the smallest single-assistant proposal.
2. Explicitly authorize implementation with one read-only lookup and structured output.
3. Follow up on missing delivery facts or an unknown identifier without guessing eligibility.
4. Exercise a failed lookup and request useful uncertainty/error handling, without adding another tool or operational integration.
5. Approve the correction from 30 to 21 elapsed days and authorize the assistant and its affected checks to follow it.
6. Request a small independent order-reference exporter or refine its output, assessing actual relevance without forcing a gate result.
7. Verify reached examples, boundaries, and maintained behavior; combine already resolved phases instead of adding features for request count.

Deliver only the current natural request. Do not reveal future corrections, expected command sequences, gate outcomes, or grader criteria. The attempt manifest owns actual wording, native locators, before/after SHAs, checks, results, and deviations.

## Reviewer guidance

Assess adoption, maintenance of approved policy and staff authority, and relevance/silence during exporter work using actual paths and declared relationships. Keep the initial response and any assistance; do not silently repair source or classify an assisted result as unassisted.

Run the real `ToolLoopAgent`, real lookup, and structured output path, controlling only the external model boundary with the installed `ai/test` interface. Inspect the maintained instruction on every outgoing call, lookup input/result flow, tool schema, and `Output.object` schema. Confirm the actual APIs from installed documentation/types instead of copying examples from another major version.

Focused checks cover exact-window boundaries with supplied times, missing delivery facts, unknown identifiers, lookup failure, malformed model output, grounded record references, and staff approval. Run native tests and typechecking against the exact input SHA. A fake internal loader, static manifest assertion, or predetermined correct reply alone does not prove instruction/tool/schema consumption.

Keep canonical/file/export validation, SDK execution under controlled responses, application-owned handling, and live model quality distinct. No live provider result, payment action, semantic reliability evaluation, or general SDK qualification is claimed.

Before this project runs, the Aster pilot must have passed first-turn capture, independent review, privacy/integrity verification, and full replay. Complete this project's source/behavior review, privacy check, publication, and downloaded-asset verification within its own milestone. Retain failures, interventions, retries, and limitations. The existing run review owns final outcome/evidence anchors, manual selection, public snapshot and source/recording/review links, and rollback selection.

## Observed run

[cinder-returns-01](../runs/run-20261021-01/attempts/cinder-returns-01.json) records five actual requests from brief revision 18651cd2a17ff89921bbbe557036f21f1cd16695 and final source f26b7754937ef2915a50757fc046159c730b08a6. One real AI SDK assistant uses an actual read-only lookup, deterministic inclusive21-day assessment and structured parsing, followed by a separate CSV utility;52tests/typecheck passed. Free rationale remains a human-review limit. Independent source/skill/capture/privacy review, signed source publication and authenticated/anonymous asset-byte verification are complete. The prospective sections above remain preparation history; no turn was added solely to meet an estimate.
