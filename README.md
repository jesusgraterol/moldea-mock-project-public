# Parcel Desk — repository explorer mock

This branch is a populated, fictional moldea repository for reviewing the cloud repository explorer UI. It needs no working service, deployment, credentials, or live model execution. Every new capability is an inert local fixture, and every result remains a staff-review draft.

The original Parcel Desk shipment explainer is preserved. The expanded mock adds support triage, order review, delivery investigation, returns, refund review, address-change review, catalog advice, inventory observations, risk screening, escalation, reply composition, quality review, knowledge curation, reporting, and accessibility editing.

## What's populated

- 16 agents with descriptions, canonical instructions, and routing-facing handoff descriptions.
- 18 focused context documents organized into eight nested topic groups.
- 12 timestamped decisions covering accepted, proposed, rejected, and superseded states.
- 2 runtime guidance documents for the existing OpenAI prototype and custom fixtures.
- 25 local tool implementations with registration and input/output schema relationships.
- 8 reusable skill source artifacts shared across agents.
- 22 declared variables and providers, 5 exact instruction mirrors, and project/agent requirements at all three effects.
- Sample inputs and outputs, fictional support records, and real source targets for explorer navigation.

## Browse the mock

- [Canonical project overview](moldea/project.md)
- [Manifest](moldea/moldea.yaml)
- [Explorer coverage and visual review scenarios](fixtures/explorer/README.md)
- [Machine-readable inventory](fixtures/explorer/inventory.json)
- [Fixture documentation](docs/explorer-fixtures.md)

`src/mock-agents/`, `src/mock-tools/`, and `src/mock-runtime/` provide typed fixture definitions. New agents do not call providers or perform business actions. `src/shipment-explainer/` remains the original caller-supplied snapshot prototype; this task does not execute it. No reply is sent to a customer by this repository.

`npm run typecheck` checks the source. The installed moldea skill launcher validates the repository format. Passing these checks does not establish live model behavior or operational readiness.

`/docs` is reserved for concise documentation of essential, durable project concepts and processes. API and HTTP endpoint documentation belongs outside `/docs` if those surfaces are added later.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
