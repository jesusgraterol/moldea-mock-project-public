# Custom fixture runtime

The new agents use a deliberately local custom runner in `src/mock-runtime/agent.ts`. This is a repository explorer fixture, not a model adapter or live service. It validates sample input, reads canonical instructions or a declared exact mirror, resolves fixture variables, and returns a predetermined validated result.

Tool and skill registration is explicit in each `src/mock-agents/<id>/agent.ts`. Tools return invented records and preview artifacts. Skill metadata points to source artifacts under `fixtures/skills/`; those artifacts are not installed host skills.

Routing descriptions classify when a fictional case should transfer responsibility. `src/mock-runtime/routing.ts` reads `handoff-description.md` for routing-facing metadata. General catalog metadata uses `description.md`. The runner records routes and never invokes a downstream provider.

There are no provider requests, credentials, customer messages, payment operations, inventory writes, background schedules, or live metrics in this runtime. Operational gaps remain visible through unresolved requirements.
