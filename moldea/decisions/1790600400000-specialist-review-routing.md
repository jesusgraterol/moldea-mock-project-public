---
status: "accepted"
createdAt: "2026-09-28T13:00:00.000Z"
supersedes:
  - "1790596800000"
---

# Use responsibility-based specialist routing

Fictional decision record for repository-explorer feedback.

## Decision

The fixture separates shipment, return, refund, address, product, risk, and accessibility responsibilities. Handoffs are recommendations and stay local.

## Rationale

This gives the explorer a representative policy record with an explicit lifecycle status and traceable relationships. It describes fixture design rather than a deployed business process.

## Consequences

Staff can inspect the status and related agents without inferring runtime readiness from the record.
