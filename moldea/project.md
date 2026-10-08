# Parcel Desk explorer fixture

Parcel Desk is a fictional stationery support desk. This branch exists to populate the cloud repository explorer with representative moldea assets, metadata, relationships, and review states so the UI can be assessed.

The original shipment explainer remains a source-only OpenAI prototype. Fifteen additional agents use an inert custom fixture runner. Staff review all drafts and own refunds, reroutes, carrier contact, address edits, and customer delivery. No fixture contains real customer data or credentials.

The new source files and capability registrations are examples, not a live service. Format validation establishes structural consistency; canned outputs do not establish model behavior or operational readiness.

## Shared context

- [Support boundaries](context/support/policies.md)
- [Escalation and ownership](context/support/escalation.md)
- [Customer-facing voice](context/support/voice.md)
- [Order snapshots](context/commerce/orders.md)
- [Returns and product condition](context/commerce/returns.md)
- [Refund review](context/commerce/refunds.md)
- [Address-change review](context/commerce/address-changes.md)
- [Catalog and recommendations](context/commerce/catalog.md)
- [Inventory observations](context/commerce/inventory.md)
- [Tracking evidence](context/shipping/tracking.md)
- [Carrier exceptions](context/shipping/carrier-exceptions.md)
- [Data minimization](context/trust/privacy.md)
- [Risk signals](context/trust/risk-review.md)
- [Staff review gates](context/quality/human-review.md)
- [Accessible drafts](context/quality/accessibility.md)
- [Knowledge ownership](context/knowledge/editorial.md)
- [Operations reporting](context/operations/reporting.md)
- [Explorer fixture contract](context/platform/fixture-contract.md)

## Agents

- [shipment-explainer](agents/shipment-explainer/instruction.md): the existing tracking explanation prototype.
- [support-triage](agents/support-triage/instruction.md): Classifies fictional support requests and recommends the specialist who should review the recorded facts.
- [order-lookup](agents/order-lookup/instruction.md): Summarizes a fictional order snapshot while keeping payment, packing, shipment, and delivery states distinct.
- [delivery-investigator](agents/delivery-investigator/instruction.md): Reviews stale scans, passed estimates, and carrier exceptions to prepare a staff investigation brief.
- [returns-guide](agents/returns-guide/instruction.md): Explains fixture return-review criteria and identifies missing product-condition evidence for staff.
- [refund-reviewer](agents/refund-reviewer/instruction.md): Prepares a refund recommendation from fictional amounts and eligibility evidence without approving or issuing money.
- [address-change-reviewer](agents/address-change-reviewer/instruction.md): Assesses whether a fictional address-change request has enough dispatch evidence for staff review.
- [catalog-advisor](agents/catalog-advisor/instruction.md): Suggests fictional stationery products that match a supplied use case and the recorded catalog snapshot.
- [stock-watcher](agents/stock-watcher/instruction.md): Identifies fictional low-stock observations and drafts replenishment review notes for staff.
- [fraud-screener](agents/fraud-screener/instruction.md): Describes observable inconsistencies in fictional case data as review signals without accusing customers.
- [escalation-coordinator](agents/escalation-coordinator/instruction.md): Assembles a concise fictional case handoff with an owner, evidence, missing facts, and a suggested review priority.
- [reply-composer](agents/reply-composer/instruction.md): Turns an approved fictional evidence brief into a short customer-facing draft for staff review.
- [quality-auditor](agents/quality-auditor/instruction.md): Checks fictional support drafts for unsupported claims, missing uncertainty, and intervention promises.
- [knowledge-curator](agents/knowledge-curator/instruction.md): Proposes evidence-linked changes to fictional support knowledge while preserving canonical ownership.
- [operations-reporter](agents/operations-reporter/instruction.md): Summarizes fictional support volumes and inventory observations over a supplied reporting period.
- [accessibility-editor](agents/accessibility-editor/instruction.md): Simplifies fictional support drafts for readability while preserving dates, amounts, facts, and uncertainty.

## Runtime and decisions

- [Custom fixture runtime](runtimes/custom.md): local preview behavior and capability boundaries.
- [Existing OpenAI prototype](runtimes/openai.md): the original provider invocation boundary.
- [Fixture execution decision](decisions/1790586000000-fixture-only-execution.md): accepted inert-execution boundary.
- [Specialist routing decision](decisions/1790600400000-specialist-review-routing.md): an accepted decision superseding an older approach.
- [Explorer coverage](../fixtures/explorer/README.md): inventory, lifecycle states, and visual review scenarios.
