# Cobalt Rooms

A local workshop-room booking planner for fictional room and booking files. It checks requested time, capacity and equipment, then explains suitable rooms and rejection reasons. Coordinators approve bookings; proposed options never create reservations. No runtime agent, server, database or booking persistence.

Rooms need at least 15 minutes of turnaround between bookings in the same room. Exactly 15 minutes is sufficient. Bookings and requests use explicit UTC timestamps; adjacent intervals with no turnaround are insufficient, while true time overlap is rejected. Evaluate supplied times rather than the machine clock. Missing or malformed facts must produce useful errors.

Keep input loading, booking rules and report formatting distinguishable where useful. Read local JSON only; never modify the input bookings.

## Local development

Use Node 24 and npm, exact dependency versions and an ordinary package-lock.json. Use built-in Node testing for JavaScript if sufficient. If TypeScript or schemas are needed, use TypeScript6.0.3, @types/node24.12.0 and Zod4.6.5. Fresh moldea adoption targets @moldea.ai/cli13.0.0. Inspect installed types/docs before relying on APIs. Keep the result small and directly runnable with copyable usage examples.
