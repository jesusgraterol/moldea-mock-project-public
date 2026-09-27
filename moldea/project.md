# Trail Ledger

Trail Ledger serves staff at a small outdoor-equipment rental desk. Staff consider reservations for specific physical items after checking bookings and repairs, then make the final booking decision.

## Availability rules

- A confirmed reservation blocks the same item when its rental dates overlap the request. Pickup is inclusive and return is exclusive, so a request beginning on an existing return date does not overlap.
- An open repair blocks the item. Completing the repair returns it to the candidate pool, but does not override a confirmed reservation conflict.
- The decision should explain the blocking repair or reservation rather than only return a boolean.

## Current implementation and evidence

`src/availability/index.ts` exports a typed, source-only `checkAvailability` function over caller-supplied item, reservation, and repair snapshots. It checks requested and relevant confirmed-reservation date ranges and reports every applicable blocker. The fictional CSV files in `records/` illustrate the desk data: `TL-T12` has an open pole-sleeve repair, `TL-S03` has a completed repair, and `TL-P08` has a confirmed reservation. `examples/check-availability.ts` copies fixture values for one invocation; it does not load the CSV files.

This prototype is not a booking authority or working service. It has no persistence, synchronization, authentication, payment handling, live provider execution, deployment, or application test suite. A future staff tool must provide complete, current, validated item records and handle concurrent booking decisions before relying on its result. No AI agents are required for the current project.
