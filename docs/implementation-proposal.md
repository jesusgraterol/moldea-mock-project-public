# Cobalt Rooms small implementation proposal

Propose a read-only Node 24 CLI that evaluates the supplied fictional requests and explains room suitability. This is a proposal for review, not authorization to implement it. The [README](../README.md) remains the existing authority for booking rules and development conventions.

## Proposed first slice

Use plain JavaScript ES modules and npm, with no new runtime dependencies or build step. Keep four small responsibilities distinguishable:

| Proposed path | Responsibility |
| --- | --- |
| `src/cli.js` | Parse explicit file flags, coordinate evaluation and report useful input errors. |
| `src/input.js` | Read local JSON and validate room, booking and request facts. |
| `src/booking-rules.js` | Pure capacity, equipment, overlap and turnaround checks. |
| `src/report.js` | Print suitable rooms and concrete rejection reasons for each request. |

Use Node's built-in argument parsing, filesystem APIs and test runner. Resolve explicit input paths relative to the caller's working directory using native path APIs. Do not depend on shell expansion or platform-specific commands. Inspect installed documentation before relying on an API; consider additional validation packages only if the small input contract needs them.

Proposed invocation from the repository root, once implemented:

```text
node src/cli.js --rooms data/rooms.json --bookings data/bookings.json --requests data/requests.json
```

Each request is evaluated independently against the supplied bookings. Suitable rooms are options for coordinator approval, not provisional reservations for subsequent requests. No approval command, write-back path, model calls, server or database is proposed.

## Proposed evaluation and feedback

1. Validate JSON shapes, required fields, unique identifiers, known booking room references, positive integer capacity and attendance, equipment lists, explicit valid UTC timestamps and strictly increasing intervals. A missing or invalid input produces a filename and field-level error rather than guessed facts.
2. Check that room capacity is at least the requested attendance and that every requested equipment item is present.
3. Compare the request with every supplied booking for that room. Reject true overlap. For disjoint intervals, require at least 15 minutes between the earlier end and the later start, on either side of the request. Touching intervals fail turnaround; an exact 15-minute gap passes. Use supplied times, never the machine clock.
4. Report all suitable rooms and useful reasons for rejected rooms, including insufficient capacity, missing equipment, overlap or insufficient turnaround. State explicitly when no room fits and that any option still needs coordinator approval. Preserve input order for deterministic output.

## Proposed verification

Use focused `node:test` cases and a CLI smoke check after implementation:

- Capacity exactly equal to attendance passes; one seat short fails. All requested equipment must be available.
- True overlap, touching intervals and a gap just below 15 minutes fail; exactly 15 minutes passes before and after a booking. Bookings in other rooms do not interfere.
- Invalid JSON, missing files or facts, duplicate identifiers, unknown room references, invalid dates and reversed intervals produce useful errors.
- Request evaluation does not mutate inputs or reserve suggested rooms; changing the machine clock does not change results.
- The supplied fixtures yield these expected options:

| Request | Expected suitable rooms | Important boundary |
| --- | --- | --- |
| `request-a` | Cedar Studio and Orchid Hall | Cedar starts exactly 15 minutes after its booking. |
| `request-b` | Orchid Hall | The request ends exactly 15 minutes before Orchid's booking. |
| `request-c` | None | Cedar overlaps; Indigo lacks capacity; Orchid lacks a whiteboard. |

Document the runnable command and interpretation of its report when the implementation is authorized. Keep application code, scripts, test files and fixture changes out of this initialization.
