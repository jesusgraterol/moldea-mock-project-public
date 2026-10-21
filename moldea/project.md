# Beacon Collections

Beacon Collections is a small fictional archive prototype for curator review. Its one accession-note assistant reads local records, drafts structured notes, and identifies missing maker, date, and provenance information. It supports human review; it does not approve accession readiness or persist accession changes.

## Authorities and boundaries

- [Accession approval policy](../docs/approval-policy.md) owns human approval authority and the handling of unknown source facts. It remains the application-policy authority; moldea does not replace it.
- [Host instructions](../docs/host-instructions.md), reached through the repository-relative `AGENTS.md` symbolic link, own repository execution guidance. Use Node24 and npm, exact dependencies, and the committed lockfile. Use only fictional data and controlled test transport, never live application-provider calls or operational archive actions in this exercise.
- Keep the existing single assistant. There is no credential loader, server, UI, or operational archive integration.

## Project sources

- [Accession-note assistant](agents/accession-note/description.md), its [canonical instructions](agents/accession-note/instruction.md), and [runtime connection and limitations](runtimes/accession-note.md).
- [Project overview and usage](../README.md).
- [Accession-note workflow](../src/assistant.ts) and [boundary schemas](../src/schemas.ts).
- [Fictional accession records](../data/accessions.json).
- [Controlled-transport connection test](../src/assistant.test.ts). Run `npm test` and `npm run typecheck` for native verification.

Existing documents retain their authority and location. The installed moldea skill is setup tooling, not a project-owned Agent Skill.
