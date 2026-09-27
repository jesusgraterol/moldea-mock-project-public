# Trail Ledger

Trail Ledger is a small outdoor-equipment rental desk. Staff approve reservations for specific physical items after checking existing bookings and the repair log. This repository starts with fictional records for a few pieces of gear and will hold a source-only prototype of that availability decision.

A confirmed reservation blocks overlapping dates for the same item. Pickup dates are inclusive and return dates are exclusive. An open repair makes an item unavailable. Under the current desk practice, completing the repair returns the item to the candidate pool, subject to any reservation conflict. Staff make the final booking decision; this prototype does not take payments or run a rental service.

Two useful cases in the records are `TL-T12`, a tent with an open pole-sleeve repair, and `TL-S03`, a stove whose repair was completed. The desk wants a small reservation check that explains availability for a requested item and date range.

## Source-only availability prototype

`src/availability/index.ts` exports `checkAvailability(request)`. Callers supply a specific equipment item, pickup and return dates in `YYYY-MM-DD` format, and current reservation and repair snapshots. The function rejects invalid requested dates or relevant confirmed-reservation dates, treats the rental interval as pickup-inclusive and return-exclusive, and explains every open repair or overlapping confirmed reservation for that item. A completed repair does not block availability.

Install dependencies with `npm install`, run `npm run typecheck`, and run the fictional-record example with `npm run example`. The example checks `TL-T12` and reports its open repair.

This is not a booking authority or a working service. The example copies values from the CSV fixtures; there is no CSV loader, persistence, synchronization, authentication, live-provider integration, or reservation write. A future staff tool must supply complete, current, validated records for the requested item and handle concurrent booking decisions before relying on the result. The check scans its supplied records once and does not cache them.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
