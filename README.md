# Cobalt Rooms

A local workshop-room booking planner for fictional room and booking files. It checks requested time, capacity and equipment, then explains suitable rooms and rejection reasons. Coordinators approve bookings; proposed options never create reservations. No runtime agent, server, database or booking persistence.

The approved room policy requires at least **30 minutes** of turnaround between bookings in the same room. Exactly 30 minutes is sufficient before or after a booking. Bookings and requests use explicit UTC timestamps; adjacent intervals with no turnaround are insufficient, while true time overlap is rejected. Evaluate supplied times rather than the machine clock. Missing or malformed facts must produce useful errors.

Keep input loading, booking rules and report formatting distinguishable where useful. Read local JSON only; never modify the input bookings.

## Local development

Use Node 24 and npm, exact dependency versions and an ordinary package-lock.json. Use built-in Node testing for JavaScript if sufficient. If TypeScript or schemas are needed, use TypeScript6.0.3, @types/node24.12.0 and Zod4.6.5. Fresh moldea adoption targets @moldea.ai/cli13.0.0. Inspect installed types/docs before relying on APIs. Keep the result small and directly runnable with copyable usage examples.

## Run the planner

The planner uses plain JavaScript ES modules on Node 24 or later. No build step or runtime dependency installation is needed. From the repository root:

```text
node src/cli.js --rooms data/rooms.json --bookings data/bookings.json --requests data/requests.json
```

The npm equivalent is:

```text
npm run plan -- --rooms data/rooms.json --bookings data/bookings.json --requests data/requests.json
```

All three file flags are required. Paths can be absolute or relative to the caller's current working directory, including paths with spaces when quoted. Run `node src/cli.js --help` for help.

The availability report states the 30-minute minimum turnaround and lists suitable rooms and specific rejection reasons for every request. Each request is evaluated independently against the supplied bookings: even overlapping requests may receive the same room options. An option is not a hold or reservation. Coordinators still approve every booking outside this CLI. The planner only reads its inputs; it never creates or modifies files.

Reports and help go to stdout with exit code **0**, including reports with no suitable room. Invalid arguments, unreadable files and malformed inputs go to stderr with exit code **2**, without a partial availability report.

## Input format

Each file must contain a JSON array of objects:

| File | Required record fields |
| --- | --- |
| Rooms | `id`, `name`, `capacity`, `equipment` |
| Bookings | `id`, `roomId`, `start`, `end` |
| Requests | `id`, `start`, `end`, `attendees`, `equipment` |

- IDs are unique within each file. IDs, room names, room references and equipment names are non-empty, trimmed strings. Booking room references must match a supplied room ID.
- Capacity and attendance are positive safe integers, not numeric strings. A room with exactly the requested capacity is sufficient.
- Equipment is a required array of unique strings; `[]` means no equipment. Names match exactly and are case-sensitive. Every requested item must be present.
- Times are real UTC calendar timestamps with seconds, ending in `Z` or `+00:00`, optionally with one to three fractional-second digits. For example, `2026-11-02T10:15:00Z` or `2026-11-02T10:15:00.125+00:00`. Local times, nonzero offsets, impossible dates and intervals with `end <= start` are rejected, not guessed or silently corrected.
- Empty arrays are valid. Missing fields, malformed records, duplicate IDs and unknown room references produce errors naming the file and field.

For every same-room booking, a request must neither overlap nor leave less than 30 minutes between intervals. A request starting exactly 30 minutes after a booking, or ending exactly 30 minutes before one, passes. Touching intervals, 15-minute gaps and a gap of 29 minutes 59.999 seconds fail. Bookings for other rooms do not interfere. The machine clock does not participate in evaluation.

## Supplied examples

Run the command above with [rooms](data/rooms.json), [bookings](data/bookings.json) and [requests](data/requests.json). All three requests are on **2026-11-02**, with the intervals below in UTC:

| Request | UTC interval | Attendees | Equipment | Suitable rooms |
| --- | --- | --- | --- | --- |
| `request-a` | 10:15 to 11:00 | 10 | projector | Orchid Hall |
| `request-b` | 12:00 to 12:45 | 20 | microphone | None |
| `request-c` | 09:30 to 10:00 | 8 | whiteboard | None |

For `request-a`, Cedar is rejected because the request starts only 15 minutes after its existing booking; Indigo has insufficient capacity and lacks a projector. Only Orchid Hall fits. For `request-b`, Orchid is rejected because the request ends only 15 minutes before its existing booking; Cedar and Indigo lack both capacity and a microphone, so no room fits. For `request-c`, Cedar overlaps an existing booking, Indigo is too small and Orchid lacks a whiteboard.

For example, the report's second request is:

```text
Request request-b: 2026-11-02T12:00:00Z to 2026-11-02T12:45:00Z
Attendees: 20; equipment: microphone.
Suitable rooms: none (no room meets all requirements).
Rejected rooms:
- Cedar Studio (cedar): insufficient capacity: 12 seats, 20 required; missing equipment: microphone.
- Indigo Room (indigo): insufficient capacity: 6 seats, 20 required; missing equipment: microphone.
- Orchid Hall (orchid): only 900s turnaround with booking booking-orchid-pm; at least 30 minutes required.
```

## Structure and tests

| Module | Responsibility |
| --- | --- |
| [src/cli.js](src/cli.js) | Flags, orchestration, stdout/stderr and exit codes |
| [src/input.js](src/input.js) | Read-only JSON loading and boundary validation |
| [src/booking-rules.js](src/booking-rules.js) | Pure capacity, equipment, overlap and turnaround checks |
| [src/report.js](src/report.js) | Human-readable availability and rejection explanations |

Run the built-in Node test runner:

```text
npm test
```

The tests cover both turnaround directions at millisecond boundaries, true overlap, capacity and equipment, independent requests, malformed input, all supplied examples, path handling and unchanged input files. A CLI test also runs under Node's permission model without filesystem write permission. The [accepted implementation plan](docs/implementation-proposal.md) records the small first slice.

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
