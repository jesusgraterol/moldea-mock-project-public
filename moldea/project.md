# Pebble Library

Pebble Library is a small command-line helper for volunteers at a community
workshop's tool-lending desk. It helps volunteers determine due dates, check
whether a member may borrow another tool, and prepare reminder notes.

The goal is consistent application of the workshop's lending and reminder
policies. Reminder notes are plain text for a volunteer to copy into an email;
the tool does not send messages itself.

## Focused context

- [Lending rules](context/lending-rules.md): loan periods, borrowing limits, and
  suspension, tied to the loan-policy implementation and its tests.
- [Reminder schedule](context/reminder-schedule.md): when notes are prepared,
  tied to the reminders implementation and its tests.

The [README](../README.md) owns the published policies and development guidance.
Keep those existing policy sections in place; the focused context links to them
instead of maintaining duplicate rule lists.

## Development

The project uses JavaScript ES modules and Node.js 22.17 or later. Run the
existing checks with `npm test`. The application consists of deterministic
lending and reminder helpers, not model-driven agents.
