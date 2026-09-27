# Vendor Desk

Vendor Desk supports the procurement team at a regional home-goods retailer. Staff collect supplier packets before a buyer decides whether a vendor can be approved. A packet combines product claims, insurance, shipping terms, and other evidence; the desk often has to ask for a missing or outdated document.

The fictional packets in `records/` show two ordinary review cases. North Pier Textiles (`VD-104`) claims its table linens contain 80% recycled fiber, but its return terms are unsigned. Ridgewell Glass (`VD-105`) has an insurance certificate that expired before review. The source-only reviewer in `src/vendor-reviewer/` identifies listed evidence gaps and requests an Anthropic draft of a specific, polite follow-up for a buyer to edit. It does not approve suppliers or treat vendor claims as verified.

The caller supplies a packet ID, supplier name, category, review date, submitted claims, and expected evidence items. Each expected item is marked missing or received; received items have an explicit signature status and may have a valid-through date. The reviewer reports missing, expired, and unsigned items from those facts. It cannot infer an omitted evidence requirement, and an empty gap list is not an approval. When gaps exist, the caller-supplied Anthropic client and model are used to draft a follow-up from the gaps and unverified claims. The draft is neither sent nor an approval decision.

This repository is a source-only prototype. It has no working service, deployment, repository credentials, live provider execution, or application test suite. The packet records are fictional and contain no real supplier data. `npm run typecheck` checks the source without emitting an application build.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
