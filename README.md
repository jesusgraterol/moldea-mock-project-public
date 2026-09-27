# Catalog Studio

Catalog Studio helps merchandisers at a small home-goods shop draft product descriptions from a local fact sheet. A staff editor checks every draft before it reaches the storefront. The team wants a short product blurb and a list of factual points that need human review when a source is unclear.

The fictional records in `records/` cover the Harbor Linen Throw (`CS-214`) and a stoneware mug (`CS-215`). The throw has known materials, dimensions, care instructions, and a polyethylene shipping sleeve. The team has no emissions evidence for it. Vendor slogans and proposed marketing lines are separate from confirmed product facts and need editorial review.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider calls, or application test suite. The data is fictional and staff retain publication decisions.

## Source-only assistant

`src/catalog-copy-agent/index.ts` exports `draftCatalogCopy(factSheet, modelId)`. It reads the canonical instruction from `moldea/agents/catalog-copy/instruction.md`, then calls the direct Google Gen AI SDK's `models.generateContent` with the caller's fact sheet. The model text is a draft for staff review, not verified or publishable output. The function has no service endpoint, fact-sheet ingestion pipeline, provider credentials, output fact-checking, or publication integration. No live provider call has been made for this prototype.

`@google/genai` 2.24.0 and TypeScript 7.0.2 are pinned as direct dependencies. Run `npm run typecheck` to check the source without invoking a model.

## List sample records

Run `node scripts/list-records/index.mjs` to list the Markdown fact sheets in `records/` as ID and title, sorted by ID. Each file must start with a `# ID: Title` heading; a missing or malformed heading produces a file-specific error and a nonzero exit status. This local preparation utility does not call the model or change product-copy drafting.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.
Installed skill: `v6.0.0` at `.agents/skills/moldea/`. Actor session: `01a0e3ef-b90c-7741-a939-4cde36ebe906`.

Observed stopping point: the adopted project has a Google Gen AI copy-drafting path. A later CS-214 claim request changed its instruction and record; a separate request added the local record-listing utility without changing drafting. Typechecking and Moldea validation passed, while live model output and publication were not exercised.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
