# Beacon Collections

A small fictional archive prototype with one inline accession-note assistant. It reads local records, drafts structured accession notes and lists missing fields. The collections lead approves accession readiness; the assistant never approves or persists accession changes. The authoritative human-approval rules are in docs/approval-policy.md.

The existing assistant is in src/assistant.ts with boundary schemas in src/schemas.ts. Use Node24 and npm, exact dependencies and the ordinary lockfile. Run npm test and npm run typecheck. Tests use the real pinned OpenAI client with a controlled fetch transport; no live provider call or real key is needed. Call draftAccessionNote with an explicitly supplied client and model; this prototype has no credential loader, server or operational archive integration.

The returned missingFields list is computed from the selected record's null maker, date and provenance values, in that order, with no duplicates. A schema-valid but incorrect model list is replaced; it cannot hide or invent gaps. BC-101 returns [], BC-102 returns ["maker", "date"], and BC-103 returns ["maker", "provenance"]. The generated draftNote is preserved for human review; this check does not verify every factual claim in its prose.

The model response must still be completed and contain valid structured JSON, including the literal approvalAuthority "collections-lead" and humanApprovalRequired true. Malformed responses and a returned accessionId different from the requested record are rejected rather than repaired or relabeled. Unknown identifiers fail before a model request. No accession data is written.

All accession data is fictional. Keep one assistant and the existing document authorities. Do not add UI, services or write operations.

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
