# Reminder schedule

The authoritative schedule and delivery boundary are
[README — Reminders](../../README.md#reminders). That section owns the advance
reminder and overdue-note days, and explains that volunteers deliver the notes
manually.

## Implementation and checks

- [Reminders](../../src/reminders.js) selects scheduled days, prepares plain-text
  notes, and returns no note when none is due.
- [Reminder tests](../../src/reminders.test.js) check the advance reminder,
  overdue-note days, and days on which no note is due.

When timing or delivery behavior changes, reconcile the published reminder
policy with this implementation and its tests. Reminders use the overdue-day
helper from the loan-policy module, but loan periods, borrowing limits, and
suspension belong to the separate [lending-rules context](lending-rules.md).
