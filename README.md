# Pebble Library

Pebble Library is a small command-line helper for the volunteer desk of a community workshop that lends tools to its members. Volunteers use it to work out due dates, check whether a member may borrow another tool, and prepare reminder notes.

## Lending rules

- Hand tools are lent for 7 days.
- Power tools are lent for 5 days.
- A member may hold at most 3 tools at once.
- A member whose loan is more than 14 days overdue is suspended from borrowing until the tool comes back.

## Reminders

- A reminder note goes out 1 day before a loan is due.
- Overdue notes go out on the first and the seventh day after the due date.
- Notes are plain text that a volunteer copies into an email; the tool sends nothing itself.

## Development

Requires Node.js 22.17 or later. Run the tests with:

```sh
npm test
```

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
