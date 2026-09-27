# Cedar Workshop project context

## Purpose and people served

Cedar Workshop is a neighborhood maker studio. Staff schedule small-group ceramics and repair classes and manage class bookings. This shared context is for workshop staff and future developers who need to understand the booking process before software is built.

## Established class-booking practices

- Staff schedule classes with a date and capacity.
- Staff track the number of confirmed places on each class roster.
- When a class fills, staff keep a waitlist of requests.
- A waitlist request does not reserve a seat.
- If a confirmed place opens, staff may offer it, but the offer alone does not confirm a booking. The customer has a place only once staff confirm the booking on the roster.

The sample schedule in `records/class-schedule.csv` illustrates class capacities, confirmed counts, and waitlist counts. It lists an October 12, 2026, wheel-throwing class with all 8 places confirmed and 3 waitlist requests, and an October 17, 2026, chair-repair class with 4 of 6 places confirmed and no waitlist requests. These are sample schedule entries, not live booking data. The repository does not yet establish rules for waitlist order, selection of offer recipients, cancellation, or payment.

## Current project boundary

This repository is a source-only prototype for recording context. It has no working booking service, deployment, credentials, live provider execution, or application test suite. No AI agents or application source are part of this foundation. If software is added later, describe its actual instruction-loading and invocation paths and any incomplete integration honestly rather than implying that source files alone provide a working service.
