# Front-desk contact CSV export

Run these Bash examples from the repository root with Node.js 24. The standalone exporter reads JSON from stdin and writes CSV with `team,name,email` columns.

## JSON input and validation

Supply an array of contact objects:

```json
[{"team":"Front desk","name":"Ada","email":"ada@example.test"}]
```

Every row must have a nonempty string for each of `team`, `name`, and `email`. Missing fields, non-string values, and whitespace-only strings are rejected. Extra properties are ignored; email address syntax is not checked. Accepted text is preserved exactly, including case and surrounding whitespace. An empty array (`[]`) produces only the CSV header.

## Ordinary export: input order

```bash
printf '%s\n' '[{"team":"Front desk","name":"zoe","email":"zoe@example.test"},{"team":"Stage, audio","name":"Ada \"A\"","email":"ada@example.test"}]' |
  node tools/contact-csv.mjs
```

Output:

```csv
team,name,email
Front desk,zoe,zoe@example.test
"Stage, audio","Ada ""A""",ada@example.test
```

## Sorted export: `--sort=name`

```bash
printf '%s\n' '[{"team":"Front desk","name":"zoe","email":"zoe@example.test"},{"team":"Stage, audio","name":"Ada \"A\"","email":"ada@example.test"}]' |
  node tools/contact-csv.mjs --sort=name
```

Output:

```csv
team,name,email
"Stage, audio","Ada ""A""",ada@example.test
Front desk,zoe,zoe@example.test
```

Sorting uses English alphabetical order, ignores case, and distinguishes accents. Names that compare equal retain their original relative order. Field text is never trimmed or rewritten.

## CSV and errors

- Cells containing commas, double quotes, or CR/LF newlines are enclosed in double quotes. Embedded double quotes are doubled; embedded newlines remain inside the quoted cell. CSV rows end with LF.
- Success: CSV only on stdout, no stderr message, exit code `0`.
- Malformed JSON, a non-array input, invalid rows, or unsupported arguments: one concise `contact-csv:` message on stderr and exit code `1`. The whole array is validated before any CSV is written, so these errors leave stdout empty.
- Reading or writing failures also report an error on stderr and exit `1`; output may already be partial if writing fails.

No files are changed by the exporter. Omit the flag to keep input order; unsupported sort values, flags, or extra arguments are rejected.
