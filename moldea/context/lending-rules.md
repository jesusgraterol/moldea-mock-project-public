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

## Outstanding implementation alignment

The approved power-tool loan period is now five days. The implementation in
[loan-policy.js](../../src/loan-policy.js) and the category-specific due-date
check in [loan-policy.test.js](../../src/loan-policy.test.js) still encode the
previous three-day period; the five-day policy is not yet implemented.

Resolve this gap by aligning the power-tool period and its due-date check with
the published policy, while preserving the other lending rules and the reminder
schedule. A power tool borrowed on October 1 must then be due on October 6.
