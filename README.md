# Vendor Desk

Vendor Desk supports the procurement team at a regional home-goods retailer. Staff collect supplier packets before a buyer decides whether a vendor can be approved. A packet combines product claims, insurance, shipping terms, and other evidence; the desk often has to ask for a missing or outdated document.

The fictional packets in `records/` show two ordinary review cases. North Pier Textiles (`VD-104`) claims its table linens contain 80% recycled fiber, but its return terms are unsigned and an independent recycled-content verification document is missing. Ridgewell Glass (`VD-105`) has an insurance certificate that expired before review. The source-only reviewer in `src/vendor-reviewer/` identifies evidence gaps and requests an Anthropic draft of a specific, polite follow-up for a buyer to edit. It does not approve suppliers or treat vendor claims as verified.

The caller supplies a packet ID, supplier name, category, review date, structured submitted claims, and expected evidence items. A numeric recycled-content claim carries its quantity, unit, and material. Evidence items identify their kind; received items also identify caller-stated provenance, signature status, and any valid-through date. The reviewer reports missing, expired, and unsigned items. For any numeric recycled-content claim, it also reports a missing independent verification document unless a received item is classified as recycled-content verification with independent provenance. A vendor material declaration does not meet that requirement. The reviewer does not infer other omitted evidence requirements. An empty gap list is not an approval, and `claimVerification` remains `not-assessed` even when an independent document is received. When gaps exist, the caller-supplied Anthropic client and model are used to draft a follow-up. The draft is neither sent nor an approval decision.

This repository is a source-only prototype. It has no working service, deployment, repository credentials, live provider execution, or application test suite. The packet records are fictional and contain no real supplier data. `npm run typecheck` checks the source without emitting an application build.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.
Installed skill: `v6.0.0` at `.agents/skills/moldea/`. Actor session: `01a0e3d4-a25f-7321-ae2e-661372d809e4`.

Observed stopping point: the adopted project has one Anthropic-backed reviewer with a visible instruction loader and a caller-invoked draft path. The later recycled-content requirement changed the packet contract and VD-104 case. Typechecking and Moldea validation passed; model-generated wording was not exercised with a live provider.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
