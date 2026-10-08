---
status: "rejected"
createdAt: "2026-09-28T18:00:00.000Z"
---

# Reject color-only review status

Fictional decision record for repository-explorer feedback.

## Decision

Review state must be readable as text. Color or an icon can supplement the state but must not carry the only meaning.

## Rationale

This gives the explorer a representative policy record with an explicit lifecycle status and traceable relationships. It describes fixture design rather than a deployed business process.

## Consequences

Staff can inspect the status and related agents without inferring runtime readiness from the record.
