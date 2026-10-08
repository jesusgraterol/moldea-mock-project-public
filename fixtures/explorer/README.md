# Repository explorer fixture coverage

All new data in this branch is invented and exists for UI review. The checked-in source provides real binding targets, canonical loaders, static schemas, variable providers, tool registration, skill artifacts, and exact instruction mirrors. The custom runner returns predetermined examples without external calls.

## Inventory

- fixtureOnly: True
- agents: 16
- contextDocuments: 18
- decisions: 12
- runtimeGuidanceDocuments: 2
- toolImplementations: 25
- toolRegistrations: 25
- skillArtifacts: 8
- skillRegistrations: 20
- variables: 22
- mirrors: 5
- projectRequirements: 3
- agentRequirements: 12

| Agent | Tools | Skills | Variables | Mirror | Requirement |
| --- | ---: | ---: | ---: | --- | --- |
| [shipment-explainer](../../moldea/agents/shipment-explainer/instruction.md) | 0 | 0 | 0 | no | blocking |
| [support-triage](../../moldea/agents/support-triage/instruction.md) | 2 | 2 | 2 | yes | informational |
| [order-lookup](../../moldea/agents/order-lookup/instruction.md) | 1 | 1 | 2 | no | none |
| [delivery-investigator](../../moldea/agents/delivery-investigator/instruction.md) | 2 | 2 | 2 | yes | blocking |
| [returns-guide](../../moldea/agents/returns-guide/instruction.md) | 2 | 1 | 2 | no | warning |
| [refund-reviewer](../../moldea/agents/refund-reviewer/instruction.md) | 2 | 2 | 2 | yes | blocking |
| [address-change-reviewer](../../moldea/agents/address-change-reviewer/instruction.md) | 1 | 0 | 2 | no | warning |
| [catalog-advisor](../../moldea/agents/catalog-advisor/instruction.md) | 2 | 1 | 0 | no | none |
| [stock-watcher](../../moldea/agents/stock-watcher/instruction.md) | 1 | 0 | 0 | no | informational |
| [fraud-screener](../../moldea/agents/fraud-screener/instruction.md) | 2 | 1 | 2 | no | blocking |
| [escalation-coordinator](../../moldea/agents/escalation-coordinator/instruction.md) | 2 | 2 | 2 | yes | warning |
| [reply-composer](../../moldea/agents/reply-composer/instruction.md) | 1 | 2 | 2 | yes | warning |
| [quality-auditor](../../moldea/agents/quality-auditor/instruction.md) | 2 | 2 | 0 | no | none |
| [knowledge-curator](../../moldea/agents/knowledge-curator/instruction.md) | 2 | 2 | 2 | no | informational |
| [operations-reporter](../../moldea/agents/operations-reporter/instruction.md) | 2 | 1 | 2 | no | warning |
| [accessibility-editor](../../moldea/agents/accessibility-editor/instruction.md) | 1 | 1 | 0 | no | none |

## Decision lifecycle examples

| Decision | Status |
| --- | --- |
| [Keep the expanded explorer fixture inert](../../moldea/decisions/1790586000000-fixture-only-execution.md) | accepted |
| [Require staff review before customer delivery](../../moldea/decisions/1790589600000-review-before-customer-send.md) | accepted |
| [Reject guaranteed delivery wording](../../moldea/decisions/1790593200000-guaranteed-delivery-wording.md) | rejected |
| [Historical single generalist review](../../moldea/decisions/1790596800000-single-generalist-review.md) | superseded |
| [Use responsibility-based specialist routing](../../moldea/decisions/1790600400000-specialist-review-routing.md) | accepted |
| [Reject automatic refund execution](../../moldea/decisions/1790604000000-automatic-refund-execution.md) | rejected |
| [Keep snapshot facts separate from estimates](../../moldea/decisions/1790607600000-snapshot-evidence-priority.md) | accepted |
| [Explore multilingual review drafts](../../moldea/decisions/1790611200000-multilingual-drafts.md) | proposed |
| [Use fictional references and data minimization](../../moldea/decisions/1790614800000-minimal-data-fixtures.md) | accepted |
| [Reject color-only review status](../../moldea/decisions/1790618400000-color-only-review-status.md) | rejected |
| [Explore a weekly operations brief](../../moldea/decisions/1790622000000-weekly-operations-brief.md) | proposed |
| [Demonstrate exact instruction mirrors](../../moldea/decisions/1790625600000-canonical-instruction-mirrors.md) | accepted |

The specialist-routing decision explicitly supersedes the historical single-generalist decision. Proposed and rejected records illustrate historical or exploratory content rather than active policy.

## Visual review scenarios

- Browse agents with zero, one, and two skills; compare agents with and without variables or instruction mirrors.
- Open runtime-agent, input-schema, output-schema, loader, variable-provider, tool-implementation, registration, and skill-artifact relationships.
- Inspect blocking, warning, and informational requirements at project and agent scope.
- Open shared context nested under support, commerce, shipping, trust, quality, knowledge, operations, and platform.
- Compare short descriptions, routing-facing handoff descriptions, structured instructions, and longer review examples.
- Inspect accepted, proposed, rejected, and superseded decisions, including the supersedes relationship.
- Follow shared skill registrations from several agents to one source artifact and its workflow reference.
- Compare canonical instructions with five exact copies under `fixtures/instruction-mirrors/`.
- Open sample input and output JSON for each new agent and read fictional cases in `records/`.
- Inspect the original OpenAI agent beside inert custom agents without treating structural validity as live readiness.

## Source boundaries

`src/mock-agents/` contains the fifteen new agent definitions. `src/mock-tools/` contains the twenty-five inert tools. `fixtures/skills/` contains eight source skill artifacts; they are not installed host skills. `src/mock-runtime/routing.ts` classifies routing metadata as handoff-facing and catalog metadata as general-purpose. The original shipment implementation is preserved.
