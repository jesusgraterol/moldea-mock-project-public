# River Gauge

River Gauge is a fictional garden team's deterministic local watering planner.
It serves garden coordinators by turning supplied zone records into watering
proposals with requested litres and a total.

## Goals and operating boundaries

- Produce repeatable proposals from supplied facts; never invent missing readings.
- Garden coordinators approve execution. The planner does not operate equipment.
- Keep the software local and credential-free, using fictional inputs.
- Use JavaScript, npm, and Node.js 24+. No model provider, database, or UI is needed.

## Durable context

- [Watering policy](context/watering-policy.md): authoritative input, selection,
  output, and validation contract, connected to the planner source and its tests.

The developer's initialization request and repository README establish the
project purpose, users, and boundaries. The planner and real-module Node tests
establish the implemented behavior documented in the watering policy.
