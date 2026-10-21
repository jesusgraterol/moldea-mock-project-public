# Cobalt Rooms project context

## Purpose and users

Cobalt Rooms is a local CLI project for workshop coordinators who need to find suitable rooms using fictional room, booking and request files. Its purpose is to explain suitable options and why other rooms do not fit, not to create reservations.

## Goals and boundaries

- Check requested time, capacity and equipment against local JSON inputs.
- The approved policy requires a 30-minute turnaround between bookings in the same room; exactly 30 minutes is sufficient before or after a booking.
- Evaluate explicit UTC timestamps from the supplied inputs, independently of the machine clock.
- Give useful errors for missing or malformed facts.
- Keep booking approval with coordinators. Suggested options never reserve a room or change input bookings.
- Keep the application local and deterministic, with no runtime agent, server, database or booking persistence.

## Turnaround implementation gap

The approved 30-minute policy is distinct from current CLI behavior: [booking rules](../src/booking-rules.js) still enforce 15 minutes. Booking code and its existing test expectations are intentionally unchanged by this policy correction. Alignment remains outstanding until separately authorized implementation and test changes enforce 30 minutes, reject shorter gaps, and accept exactly 30 minutes in both directions. The [README](../README.md) distinguishes the approved policy from the current report examples.

## Project navigation

- [README](../README.md): detailed booking rules, input boundaries and local development conventions.
- [Fictional rooms](../data/rooms.json): room identifiers, capacity and available equipment.
- [Fictional bookings](../data/bookings.json): supplied room occupancy intervals.
- [Fictional requests](../data/requests.json): example workshop times, attendance and equipment needs.
- [Small implementation proposal](../docs/implementation-proposal.md): proposed CLI structure, invocation and acceptance checks; not implemented behavior or an approved architecture decision.

The README and fictional inputs provide the existing project-owned context. There are no application agents or inline model workflows to register. The installed moldea skill supplies development tooling, not an application responsibility.
