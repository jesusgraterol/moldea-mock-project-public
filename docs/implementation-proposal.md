# Cobalt Rooms small implementation proposal

This accepted plan is implemented as a read-only Node 24 CLI that evaluates the supplied fictional requests and explains room suitability. The [README](../README.md) provides current usage, input rules and example results, and remains the authority for booking rules and development conventions.

**Turnaround exception:** the approved room policy is 30 minutes, but booking code and its existing tests still use 15 minutes. Updating that implementation is explicitly deferred. The current report examples below describe the unchanged 15-minute behavior.

## First slice

Use plain JavaScript ES modules and npm, with no new runtime dependencies or build step. Keep four small responsibilities distinguishable:

| Path | Responsibility |
| --- | --- |
| `src/cli.js` | Parse explicit file flags, coordinate evaluation and report useful input errors. |
| `src/input.js` | Read local JSON and validate room, booking and request facts. |
| `src/booking-rules.js` | Pure capacity, equipment, overlap and turnaround checks. |
| `src/report.js` | Print suitable rooms and concrete rejection reasons for each request. |

Use Node's built-in argument parsing, filesystem APIs and test runner. Resolve explicit input paths relative to the caller's working directory using native path APIs. Do not depend on shell expansion or platform-specific commands. Inspect installed documentation before relying on an API; consider additional validation packages only if the small input contract needs them.

Invocation from the repository root:

```text
node src/cli.js --rooms data/rooms.json --bookings data/bookings.json --requests data/requests.json
```

Each request is evaluated independently against the supplied bookings. Suitable rooms are options for coordinator approval, not provisional reservations for subsequent requests. No approval command, write-back path, model calls, server or database is proposed.

## Evaluation and feedback

1. Validate JSON shapes, required fields, unique identifiers, known booking room references, positive integer capacity and attendance, equipment lists, explicit valid UTC timestamps and strictly increasing intervals. A missing or invalid input produces a filename and field-level error rather than guessed facts.
2. Check that room capacity is at least the requested attendance and that every requested equipment item is present.
3. Compare the request with every supplied booking for that room. Reject true overlap. The approved policy requires at least 30 minutes between the earlier end and the later start, on either side of the request. Touching intervals fail turnaround; an exact 30-minute gap passes. Use supplied times, never the machine clock. The current code still uses 15 minutes; alignment with this policy remains outstanding.
4. Report all suitable rooms and useful reasons for rejected rooms, including insufficient capacity, missing equipment, overlap or insufficient turnaround. State explicitly when no room fits and that any option still needs coordinator approval. Preserve input order for deterministic output.

## Verification

Use focused `node:test` cases and a CLI smoke check:

- Capacity exactly equal to attendance passes; one seat short fails. All requested equipment must be available.
- Policy-alignment verification must show that true overlap, touching intervals and gaps just below 30 minutes fail, while exactly 30 minutes passes before and after a booking. Existing tests still verify the 15-minute implementation and are unchanged. Bookings in other rooms do not interfere.
- Invalid JSON, missing files or facts, duplicate identifiers, unknown room references, invalid dates and reversed intervals produce useful errors.
- Request evaluation does not mutate inputs or reserve suggested rooms; changing the machine clock does not change results.
- The supplied fixtures yield these options under the current 15-minute implementation:

| Request | Expected suitable rooms | Important boundary |
| --- | --- | --- |
| `request-a` | Cedar Studio and Orchid Hall | Cedar starts exactly 15 minutes after its booking. |
| `request-b` | Orchid Hall | The request ends exactly 15 minutes before Orchid's booking. |
| `request-c` | None | Cedar overlaps; Indigo lacks capacity; Orchid lacks a whiteboard. |

The runnable command and interpretation of its report are documented in the README. The fictional input files remain unchanged; booking approval and persistence are outside this CLI.
