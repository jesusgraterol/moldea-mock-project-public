# Beacon Collections

A small fictional archive prototype with one inline accession-note assistant. It reads local records, drafts structured accession notes and lists missing fields. The curator approves accession readiness; the assistant never approves or persists accession changes. The authoritative human-approval rules are in docs/approval-policy.md.

The existing assistant is in src/assistant.ts with boundary schemas in src/schemas.ts. Use Node24 and npm, exact dependencies and the ordinary lockfile. Run npm test and npm run typecheck. Tests use the real pinned OpenAI client with a controlled fetch transport; no live provider call or real key is needed. Call draftAccessionNote with an explicitly supplied client and model; this prototype has no credential loader, server or operational archive integration.

All accession data is fictional. Keep one assistant and the existing document authorities. Do not add UI, services or write operations.

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
