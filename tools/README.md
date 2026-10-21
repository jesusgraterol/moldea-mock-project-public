# Staff roster formatter

`staff-roster.js` reads a JSON array of fictional people from stdin and prints a two-column Markdown table in input order. It is standalone roster formatting, with no room-planner imports or booking behavior. Use Node 24 or later; no dependency installation or build step is needed.

## Examples

Run from the repository root:

```text
node -e "process.stdout.write(JSON.stringify([{name: 'Mira | Holt', role: 'Setup\nDesk'}, {name: 'Arlo Moss', role: 'Host'}]))" | node tools/staff-roster.js
```

Output:

```markdown
| Name | Role |
| --- | --- |
| Mira \| Holt | Setup<br>Desk |
| Arlo Moss | Host |
```

An empty array succeeds with only the header and separator:

```text
node -e "process.stdout.write('[]')" | node tools/staff-roster.js
```

## Input and errors

Every array item must be an object with non-empty string fields `name` and `role`. Whitespace-only values are invalid; other field text is not trimmed. Extra fields are ignored, and duplicate people are retained.

Pipes and backslashes are escaped. Embedded LF, CRLF, CR and Unicode line separators become `<br>`, keeping one physical table row per person. Input `&`, `<` and `>` are escaped so literal HTML is not confused with generated line breaks.

The complete input is read and validated before anything is printed to stdout. Success exits **0**. Invalid JSON, wrong root or record types, and missing or invalid fields produce a useful error on stderr and exit **2**, with no partial table.

For example:

```text
node -e "process.stdout.write(JSON.stringify([{name: 'Mira Holt', role: 7}]))" | node tools/staff-roster.js
```

Stderr:

```text
staff-roster: stdin: people[0].role must be a non-empty string.
```

## Tests

```text
node --test tools/staff-roster.test.js
```

The root `npm test` command also discovers these built-in Node tests.
