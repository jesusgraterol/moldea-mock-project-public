# Unique zone names

`unique-zones.mjs` reads a JSON array of nonempty strings from stdin and writes a
JSON array to stdout. It keeps the first occurrence of each exact string in input
order, without sorting, trimming, normalization, or coercion. Case and whitespace
are preserved, including whitespace-only strings. Empty arrays are valid.

## Valid examples

Run these commands from the repository root:

```sh
printf '%s\n' '["bed","Bed"," bed ","bed","Bed"]' | node tools/unique-zones.mjs
```

Stdout:

```json
["bed","Bed"," bed "]
```

```sh
printf '%s\n' '[]' | node tools/unique-zones.mjs
```

Stdout: `[]`.

## Invalid examples

Malformed JSON, non-array input, empty strings, or non-string entries fail with a
concise stderr message and a nonzero exit code. The entire input is validated
before output: failures produce no stdout, not even a partial array.

```sh
printf '%s\n' '["bed",""]' | node tools/unique-zones.mjs
```

Stderr: `unique-zones: entry 1 must be a nonempty string`.

```sh
printf '%s\n' '[' | node tools/unique-zones.mjs
```

Stderr: `unique-zones: invalid JSON`. Both invalid examples exit with code 1 and
leave stdout empty.

Run the subprocess tests with `node --test tools/unique-zones.test.mjs`.
