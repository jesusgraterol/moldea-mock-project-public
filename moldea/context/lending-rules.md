# Lending rules

The authoritative rule list is [README — Lending rules](../../README.md#lending-rules).
It covers loan periods by tool category, the active-loan limit, and suspension
until an excessively overdue tool is returned.

## Implementation and checks

- [Loan policy](../../src/loan-policy.js) implements due dates, whole-day overdue
  calculations, and borrowing eligibility.
- [Loan-policy tests](../../src/loan-policy.test.js) check category-specific due
  dates, unknown categories, overdue-day calculations, the borrowing limit, and
  the suspension boundary.

When lending behavior changes, reconcile the published lending rules with this
implementation and its tests. Keep reminder timing and note wording in the
separate [reminder-schedule context](reminder-schedule.md).
