# Volunteer-name sorter

Run from the repository root with Node.js; no application imports, dependencies,
or npm script are needed.

`sort-volunteers.mjs` reads one JSON array of strings from stdin and writes a
sorted JSON array, followed by a newline, to stdout. It uses English alphabetical
comparison without regard to case; accents remain distinct. Names that compare
equally keep their input order. Original spelling, whitespace, and duplicates
are preserved.

## Examples

```sh
printf '%s\n' '["Zoe","bob","Alice","BOB","alice"]' | node tools/sort-volunteers.mjs
# stdout: ["Alice","alice","bob","BOB","Zoe"]

printf '%s\n' '[]' | node tools/sort-volunteers.mjs
# stdout: []
```

An empty array is valid; empty stdin is not.

## Errors

Malformed JSON, non-array input, or any non-string name produces a concise
stderr message, no stdout, and exit code `1`:

```sh
printf '%s\n' '["Ada",]' | node tools/sort-volunteers.mjs
# stderr: sort-volunteers: invalid JSON

printf '%s\n' '{}' | node tools/sort-volunteers.mjs
# stderr: sort-volunteers: input must be an array

printf '%s\n' '["Ada",42]' | node tools/sort-volunteers.mjs
# stderr: sort-volunteers: names must all be strings
```

## Tests

```sh
node --test tools/sort-volunteers.test.mjs
```
