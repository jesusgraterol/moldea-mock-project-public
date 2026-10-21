# Contributor-list formatter

This standalone developer utility does not use or change the editorial skills or source notes. It requires Node 24 and no dependencies.

Run `node tools/format-contributors.mjs` from the repository root, sending a JSON array on standard input. Each person must be an object with nonempty string fields `name` and `contribution`. Extra fields are ignored.

- Leading/trailing whitespace is removed; runs of whitespace within either field become one space, including tabs and line breaks.
- Names are sorted by their normalized lowercase spelling, using locale-independent string order. Original capitalization and other characters are preserved; equal lowercase names retain their input order.
- Output is one UTF-8 `Name — contribution` line per person, with a final newline. An empty array succeeds with no output.
- The entire input is parsed and validated before any output is written. Errors identify zero-based row indices, such as `people[1].name`, when applicable. On invalid input, stdout stays empty and an explanation is written to stderr.
- Exit codes: **0** success, **1** invalid JSON or contributor data, **2** usage or input-reading failure. The command accepts no arguments.

## Copyable examples

These shell examples use POSIX `sh`/Bash syntax and run from the repository root.

### Normalize and sort

```sh
printf '%s\n' '[{"name":"  zoE  Chen ","contribution":" layout\tand\nproduction "},{"name":"Ada Lin","contribution":" editing "},{"name":"ADA LIN","contribution":"research"}]' | node tools/format-contributors.mjs
```

Output:

```text
Ada Lin — editing
ADA LIN — research
zoE Chen — layout and production
```

`Ada Lin` and `ADA LIN` keep their relative input order. For an existing JSON file, use `node tools/format-contributors.mjs < contributors.json`.

### Invalid later entry: no partial output

```sh
printf '%s\n' '[{"name":"Ada Lin","contribution":"editing"},{"name":"  ","contribution":"research"}]' | node tools/format-contributors.mjs
```

Stdout is empty, the exit code is 1, and stderr contains:

```text
Invalid contributor input: people[1].name must not be empty after whitespace normalization.
```

## Tests

```sh
npm test
```

This runs the focused formatter tests and the existing editorial word-counter tests. Formatter checks cover whitespace normalization, case-insensitive stable sorting, empty arrays, malformed input, invalid entries/fields, and no partial output. Tests invoke Node directly without a shell and run the formatter from an unrelated working directory.
