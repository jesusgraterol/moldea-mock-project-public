# Trail Ledger

Trail Ledger is a small outdoor-equipment rental desk. Staff approve reservations for specific physical items after checking existing bookings and the repair log. This repository starts with fictional records for a few pieces of gear and will hold a source-only prototype of that availability decision.

A confirmed reservation blocks overlapping dates for the same item. Pickup dates are inclusive and return dates are exclusive. An open repair makes an item unavailable. Under the current desk practice, completing the repair returns the item to the candidate pool, subject to any reservation conflict. Staff make the final booking decision; this prototype does not take payments or run a rental service.

Two useful cases in the records are `TL-T12`, a tent with an open pole-sleeve repair, and `TL-S03`, a stove whose repair was completed. The desk wants a small reservation check that explains availability for a requested item and date range.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.
