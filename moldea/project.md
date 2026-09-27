# Trail Ledger

Trail Ledger serves staff at a small outdoor-equipment rental desk. Staff consider reservations for specific physical items after checking bookings and repairs, then make the final booking decision.

## Availability rules

- A confirmed reservation blocks the same item when its rental dates overlap the request. Pickup is inclusive and return is exclusive, so a request beginning on an existing return date does not overlap.
- An open repair blocks the item. After the latest completed repair for an item, staff must record a safety check at a strictly later time before the item returns to the candidate pool. A later completed repair invalidates an earlier check. A reservation conflict still blocks an item with a valid check.
- The decision should explain a blocking repair, missing post-repair check, or reservation rather than only return a boolean.

## Current implementation and evidence

`src/availability/index.ts` exports a typed, source-only `checkAvailability` function over caller-supplied item, reservation, repair, and safety-check snapshots. Rental pickup and return remain calendar dates; repair completion and safety-check recording use canonical UTC timestamps to order same-day events. The function checks relevant date and timestamp validity and reports every applicable blocker. The fictional CSV files in `records/` illustrate the desk data: `TL-T12` has an open pole-sleeve repair, `TL-S03` has a completed repair but no recorded safety check, and `TL-P08` has a confirmed reservation. `examples/check-availability.ts` copies fixture values, then illustrates an in-memory post-repair check; it does not load or write the CSV files.

This prototype is not a booking authority or working service. It has no persistence, synchronization, authentication, payment handling, live provider execution, deployment, or application test suite. A future staff tool must provide complete, current, validated reservation, repair, and safety-check records for the item and handle concurrent booking decisions before relying on its result. No AI agents are required for the current project.
