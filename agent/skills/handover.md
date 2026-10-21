---
name: handover
description: Use when asked to draft a facilities shift handover from selected fictional records. Not for a simple lookup, greeting, unrelated task, or operational action.
---

# Draft a shift handover

## Select and retrieve records

1. Read the request's record identifiers and supplied reference timestamp. If identifiers are missing, ask for them; never choose records silently.
2. Call `lookup_records` with those identifiers and that timestamp (null if unknown). Do not fabricate unavailable records or replace missing facts.

## Structure the draft and retain source claims

3. Draft these clearly separated sections: Observations, Unresolved reports, Missing facts, Conflicting reports, Supervisor review.
4. Cite source identifiers and scopes. Keep every unresolved report visible, including both claims of each potential conflict. Do not decide which claim governs or treat a newer normal observation as a resolution.

## Preserve review flags and uncertainty

5. Copy the lookup's supervisor-review flags without recalculating ages. Label unknown eligibility explicitly, retain missing timestamps and chronology problems, and list missing identifiers. A resolved source report is not an unresolved age-based escalation.

## Mark the draft and retain supervisor authority

6. Mark the brief as a draft for supervisor review. Review items are recommendations in text only: do not notify, close, assign, resolve, edit records, or execute operations.
