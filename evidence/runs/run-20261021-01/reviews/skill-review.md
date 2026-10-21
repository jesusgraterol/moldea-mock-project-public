# Skill 10.0.0 project-run review

Run `run-20261021-01` is in progress. Aster Dispatch completed six actor requests and passed fresh independent source/skill-behavior review. Final public-copy privacy review and public asset integrity verification passed; full replay and the expansion checkpoint remain pending. Cobalt Rooms, Folio Workshop, Beacon Collections, Cinder Returns and Quarry Handover have not started. This review records evidence and findings; the later evaluator's whole-batch assessment remains separate.

## Aster Dispatch

**Independent source/behavior verdict: PASS, with no unresolved actionable product defect or material coverage gap in the bounded scope.** The review used a fresh agent and an owned disposable clone at `beb77a2ce6c7f2377a3d4dcd2966bc0217ab79b1`; its clone/cache were removed and the actor worktree stayed unchanged. Publication and public asset verification have passed; full replay remains a separate pending gate.

Aster is one equipment-request assistant with a real compiled LangGraph, a deterministic read-only inventory lookup and structured staff handoffs. Available, unavailable, absent and unknown inventory remain distinct. Supplied UTC timestamps determine urgency; staff approve every dispatch. There is no reservation, inventory write, operational integration or second assistant.

The generic fixture base is `c3ecda12e853b527a96c6ca81150083b0224643a`. The actual actor-start seed, and therefore the attempt's `baseCommit`, is `066ef7578ec935fe9f3532bcd59759eb6a91f7cf`. All seven introduced commits are signed driver seed/capture checkpoints; no actor-authored commit or driver repair request occurred. Source history, including the seed, was reviewed before its separate fixture-branch push.

The [attempt record](../attempts/aster-dispatch-01.json) owns exact delivered wording, settings, before/after source SHAs, checks and redaction locators. The [final source](https://github.com/jesusgraterol/moldea-mock-project-public/tree/beb77a2ce6c7f2377a3d4dcd2966bc0217ab79b1), [parent recording](https://github.com/jesusgraterol/moldea-mock-project-public/releases/download/run-20261021-01/aster-dispatch-01-session-01.jsonl.gz) and [identity log](https://github.com/jesusgraterol/moldea-mock-project-public/releases/download/run-20261021-01/aster-dispatch-identities-01.txt) are the evaluator entry points. The Release assets are published and anonymously verified as recorded below.

| Request / native event | Source after request | Reached result |
| --- | --- | --- |
| 01 / 9 | `7446cde05a479808f77609904537cece3e97588a` | Explicit adoption and proposal; application implementation stayed on hold. Initial CLI/Core absence was observed before adoption. |
| 02 / 137 | `c9ed3f5d35721951b75ce48a2b88b6b1162294f7` | Built the real graph/lookup/instruction/schema path; 38 tests and typecheck passed with the initial inclusive 24-hour policy. An intermediate API error was self-corrected. |
| 03 / 345 | `95a569b232f0b78b78c5377dde32dd5e2ec79d2c` | Added independent contact CSV exporter; 40 subprocess tests passed. Only its two files changed. |
| 04 / 401 | `3359018a03127bc4a3a80ed2ac11b32ca771a9ff` | Maintained the approved inclusive 48-hour policy across the governing README, canonical instruction/context, implementation and checks; 41 tests, typecheck and CLI example passed. |
| 05 / 485 | `8a0781201cac7c51e9917742ffdd3b0cc06c62a2` | Added stable case-insensitive `--sort=name`; 54 exporter tests passed. Only exporter source/tests changed. |
| 06 / 530 | `beb77a2ce6c7f2377a3d4dcd2966bc0217ab79b1` | Added only `tools/README.md`; both Bash examples passed syntax and exact stdout/stderr/exit checks. |

The native session is `01a15fe7-8015-7f12-a6a5-4c02617ad9a9`. All six actual contexts—7, 136, 344, 400, 484, 529—confirm `gpt-6.1-sol`/`xhigh`, workspace-write/network and approvals never. Host 0.163.0 is provenance. Skill `v10.0.0` matches immutable `950b89eb4c41564953fa1582fdd588992e152d37` byte-for-byte across 36 files; sorted compact path/file-hash digest `f035aedbbebefeb7905e066369ca411924ce57c5dd9a9f7b801cde0344530fc4`. CLI 13.0.0, Core 9.0.0 and repository/repository-fs 4.0.0 established the post-adoption baseline. Actual LangGraph 1.5.1, LangChain Core 1.2.20, Zod 4.6.5, TypeScript 6.0.3 and Node types 24.12.0 match exact declarations/lock entries.

### What the checks establish

At the final source, the independent reviewer executed:

| Command or method | Result |
| --- | --- |
| `npm ci --ignore-scripts` with an owned temporary cache | Passed; installed exact locked composition. |
| `npm test` | 41/41 assistant tests passed. |
| `npm run typecheck` | Passed. |
| `node --test tools/contact-csv.test.mjs` | 54/54 subprocess tests passed. |
| `npm run --silent example -- --request request-a`, `request-b`, `request-c` | All passed with grounded IDs, expected actions, urgency and required staff approval; the unknown projector retained three missing facts. |
| CLI help, absent request, unsupported option | Expected exits 0, 1, 1. |
| Both `tools/README.md` Bash blocks | `bash -n` and exact output/error/exit comparisons passed. |
| Installed closed launcher `composition --json`, instruction `content --json`, `validate --json` | Passed, schema 7; validation reported zero diagnostics and 8/8 exports. |
| Published distribution byte comparison; `git diff --check`; clean clone status | All passed. |

[The assistant](https://github.com/jesusgraterol/moldea-mock-project-public/blob/beb77a2ce6c7f2377a3d4dcd2966bc0217ab79b1/src/assistant.ts) runs lookup → draft → validation through the actual compiled graph. The actual lookup arguments/results and schemas remain real. [The boundary test](https://github.com/jesusgraterol/moldea-mock-project-public/blob/beb77a2ce6c7f2377a3d4dcd2966bc0217ab79b1/test/assistant.test.ts#L179) observes the exact maintained system instruction, converted output-schema properties/required fields, and cancellation signal. Tests cover exact/just-beyond 48 hours, fractional timestamps, missing observations, unavailable/insufficient/absent inventory, forged or erased evidence, malformed inputs/drafts and propagated model failure. The model controls only the recommendation prose; the graph enforces the structured facts and approval field.

Skill behavior is grounded in actual reads and actions. Initial adoption preserves the implementation hold (final proposal event 126). Request 02's green test/typecheck result is event 305 and validation result is 332. Request 04 inspects the existing owner/consumers at 422/426, maintains them at 436, verifies runtime behavior at 456 and validates at 470. Exporter relevance results are **0** at 353, 494 and 539; each exact source diff shows no canonical/assistant change, and no later moldea action or announcement followed those misses. A helper's process exit 0 and its printed relevance value are distinct.

### Retained findings and limits

- **Resolved actor development error:** the initial model test/example classes used nonexistent `this.bind`. Tests failed at event 255 and typecheck reported TS2339 at 263. Patch 267 changed both to `withConfig`; the same request passed all checks before checkpointing. This is an actor API integration mistake, with no driver intervention or demonstrated released Skill/SDK defect.
- **Host truncation:** some reference reads and the initial failing test output were truncated. Later targeted reads, complete green checks and independent reruns establish the reached result; the original omitted output is not reconstructed.
- **Resolved driver bookkeeping errors:** draft verification rejected premature review links and then an invocation without asset bytes. Pending review links were cleared and exact private candidate bytes supplied. These were driver record/invocation errors; source/session/utility bytes were unchanged. The actor-start seed distinction was also corrected in the draft.
- **Qualification limits:** real source wiring, canonical/file/export validation and controlled SDK execution are established separately. Arbitrary generated `recommendation.summary` prose is not semantically validated; no live-provider quality, causal advantage over a no-skill counterfactual, safety qualification or operational dispatch is claimed.
- **Environment and capture:** Linux/Node 24 were tested. Optional shellcheck/shfmt were unavailable; syntax/execution checks passed. The dedicated home isolates configuration, not filesystem reads or host catalogs. Encrypted reasoning and host-private world state are omitted; no natural compaction occurred.

The proposed parent asset has 163 shareable events, native ordinals 0–573, 223 explicit directory-prefix redactions, 182,549 compressed bytes and 698,219 expanded bytes. Its SHA-256 is `f7a0c702d323d40beb5c7e6f023c5d59617dd1fc49a95de57d8cb69e9239aa65`. Metadata and both sizes fit the reader's 8 MiB bounds. Private candidate verification passed with evidence explicitly incomplete; this is not a public download claim.

## Pilot publication and expansion checkpoint

Independent source/skill-behavior review, final public-copy privacy review, source/records/Release publication and actual downloaded/anonymous asset integrity verification are complete. Full public conversation replay and the expansion decision remain pending. The other five project seeds must not be prepared before this checkpoint passes.

The six reviewed record files were committed as `951bf224645dc24f0badc3c4299900ba7f95d194` and merged through [PR #7](https://github.com/jesusgraterol/moldea-mock-project-public/pull/7), merge `43ebb11aed5beb591532cc7493ad49b2c818f80f`. Release `run-20261021-01` was first created as a draft at that immutable target, its two assets downloaded and verified before publication, and published at 2026-10-21T20:07:24Z. Subsequent anonymous GETs returned HTTP 200 for both files and the same exact bytes. The tag remains fixed at `43ebb11aed5beb591532cc7493ad49b2c818f80f`. The identity log is 79,188 bytes, SHA-256 `11ec7e118bb06d4601a37059d638db87e24baa3fd5b313f6f6fc56296122ceb0`. The run remains incomplete while five planned projects are unstarted.

The pinned reader is `950b89eb4c41564953fa1582fdd588992e152d37`. Its readiness checks passed: 68 unit, 73 artifact integration and 191 Chromium checks, plus typecheck/lint/format/build. These used existing fixtures. The final Aster recording also parses into 110 reader entries; full public replay remains separate. Readiness previews stopped and the pinned tracked checkout stayed unchanged.

Keep the existing rollback selection exactly:

```json
{"run":{"commit":"87ee9e2f25e4dc188c317ae421c9b9f1dac1759e","runId":"run-20261013-01"},"history":[]}
```

No live deployed selection or website deployment is inferred or changed.
