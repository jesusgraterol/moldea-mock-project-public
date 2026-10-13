# Workshop CSV exporter

Run these commands from the repository root with Node.js. No npm script or
application setup is needed. The exporter reads a JSON array from stdin and
writes UTF-8 CSV to stdout with `workshop,name,seats` columns.

## Input and ordinary usage

Each row must be an object with string `workshop` and `name` fields, and a
non-negative safe integer JSON number for `seats` (not a quoted number).
Empty strings and zero seats are valid; extra fields are ignored.

Without a flag, rows stay in input order:

```sh
node tools/workshop-csv.mjs <<'JSON'
[
  {"workshop":"Repair, mend","name":"zoe","seats":1},
  {"workshop":"Woodwork","name":"Ana \"A\"","seats":0}
]
JSON
```

Output:

```csv
workshop,name,seats
"Repair, mend",zoe,1
Woodwork,"Ana ""A""",0
```

## Sort by attendee name

`--sort=name` uses case-insensitive English alphabetical order. Equal names,
including case-only differences, keep their input order; accents remain distinct.

```sh
node tools/workshop-csv.mjs --sort=name <<'JSON'
[
  {"workshop":"Repair, mend","name":"zoe","seats":1},
  {"workshop":"Woodwork","name":"Ana \"A\"","seats":0}
]
JSON
```

Output:

```csv
workshop,name,seats
Woodwork,"Ana ""A""",0
"Repair, mend",zoe,1
```

## Escaping and errors

- Commas, quotes, and CR/LF newlines cause a field to be double-quoted; embedded
  quotes are doubled. JSON `\n` becomes a preserved newline inside the quoted
  CSV field. Each CSV record ends with LF.
- `[]` produces only `workshop,name,seats` followed by a newline.
- Success exits with code **0**. Malformed JSON, a non-array input, invalid rows,
  or unsupported arguments exit with code **1**, with a concise `workshop-csv:`
  message on stderr and no CSV on stdout.
- Every row is validated before sorting or output. Row errors report the
  original, one-based input position. Only `--sort=name` is supported.
