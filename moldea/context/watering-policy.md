# Watering policy

## Authority and scope

This document owns River Gauge's durable watering contract. Its selection
threshold reflects the garden coordinators' approved policy, confirmed by the
developer. The deterministic local planner produces a proposal only. Garden
coordinators approve execution; the planner performs no equipment
operations or external I/O and needs no credentials.

## Supplied facts

`planWatering(zones)` accepts an array of zone records. Each record must supply:

- `id`: a nonempty string, not whitespace-only; its supplied contents are retained.
- `moisturePercent`: a finite JavaScript number from 0 through 100, inclusive.
- `requestedLitres`: a finite JavaScript number greater than or equal to 0.

Validate every supplied record, including zones that will not be selected. Reject
missing or invalid facts instead of coercing values, estimating readings, filling
defaults, silently skipping records, or returning a partial plan. Missing records
in sparse arrays are invalid too. Wrong types and nonfinite numbers throw
`TypeError`; out-of-range numeric facts throw `RangeError`.

## Selection and output

- Select a zone exactly when `moisturePercent < 25`.
  A reading of exactly 25 is excluded.
- Order selected zones by their exact `id` using JavaScript string order (UTF-16
  code units), without trimming, normalization, locale collation, or numeric sorting.
  Preserve input order for equal IDs.
- Return each selected zone's supplied `id` and `requestedLitres`, including
  zero-litre requests.
- Return `{ zones: [{ id, requestedLitres }], totalLitres }`, where `totalLitres`
  sums only selected requests using JavaScript number arithmetic without rounding.
- An empty input or no selected zones returns `{ zones: [], totalLitres: 0 }`.
- Reject an overflowing, nonfinite total with `RangeError`.
- Do not mutate input records; return fresh plan records. Identical supplied
  facts produce identical plans.

## Implementation and maintenance

- [Planner source](../../src/water-plan.mjs): the exported `planWatering` function.
- [Focused Node tests](../../test/water-plan.test.mjs): execute the real module via
  `npm test` and protect selection boundaries, validation, totals, and determinism.

The manifest registers these exact files as `affectedBy` paths for this owner.
Changes to either file require reconsidering this contract alongside the code;
update the policy when an authorized change alters its behavior.
