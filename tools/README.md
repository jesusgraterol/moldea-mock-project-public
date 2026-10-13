# Crate totals

`crate-totals.mjs` is a standalone Node.js utility. Run the examples below from the repository root; no application imports or npm script are needed.

It reads a JSON array of `{ "label": "rice", "count": 2 }` objects from stdin and writes a JSON array of `{label, count}` totals to stdout, followed by a newline.

- Labels must be nonempty strings. Grouping is exact and case-sensitive: whitespace is preserved, with no trimming or normalization.
- Results are sorted by label using JavaScript's default string order (UTF-16 code units), not locale-aware sorting.
- Counts must be nonnegative safe integers, from `0` through `9007199254740991` (`Number.MAX_SAFE_INTEGER`). Each grouped total must stay within the same limit. Strings and fractions are not accepted as counts.
- An empty array produces `[]`. Missing stdin is not an empty array; it is invalid JSON.
- Invalid JSON, invalid entries, or unsafe totals cause exit status `1`, a concise `crate-totals:` error on stderr, and no stdout—not even partial totals. Successful runs exit with status `0` and no stderr.

## Examples

Group duplicates, retaining differently capitalized labels:

```sh
printf '%s\n' '[{"label":"rice","count":2},{"label":"Rice","count":1},{"label":"rice","count":3}]' | node tools/crate-totals.mjs
# stdout: [{"label":"Rice","count":1},{"label":"rice","count":5}]
```

Empty input array:

```sh
printf '%s\n' '[]' | node tools/crate-totals.mjs
# stdout: []
```

Valid individual counts whose grouped total is too large:

```sh
printf '%s\n' '[{"label":"rice","count":9007199254740991},{"label":"rice","count":1}]' | node tools/crate-totals.mjs
# stderr: crate-totals: entry 2 makes its label total unsafe
# stdout: (empty)
# exit status: 1
```
