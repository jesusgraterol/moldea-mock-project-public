# Trip Care

Trip Care is a source-only assistant prototype for a fictional travel desk. It helps staff explain itinerary-change options from supplied records. The assistant does not search live inventory, quote a final price, change a booking, or cancel a trip. Staff verify current availability and make all booking or cancellation decisions.

The first case, `TC-201`, is a traveler who needs a later departure. The itinerary and alternative schedule snapshot are in `records/tc-201.md`. The assistant should make the timing tradeoffs clear and distinguish displayed fare differences from a complete change quote.

No working service, deployment, credentials, live provider execution, or application test suite is required. Keep source small and plausible, with inspectable instruction loading and invocation paths. Record incomplete integration honestly.

## Project blueprint

- `records/tc-201.md` is the supplied, non-live itinerary and fare-difference snapshot.
- `moldea/project.md` and `moldea/moldea.yaml` hold project context and the agent's runtime relationships. `moldea/agents/itinerary-options/instruction.md` is the agent's authoritative instruction.
- `src/itinerary-options/instructions.ts` loads that instruction directly; `itinerary-options.agent.ts` constructs one OpenAI Agents SDK agent with no tools or booking actions.
- `src/itinerary-options/run.ts` exports `runTc201()`. Only an explicit call reads the TC-201 record and invokes the SDK. Importing the module does not run the agent. No live invocation has been verified.
- `package.json` pins direct dependencies exactly. `npm run check` typechecks the source; there is no application test suite or deployed service.

`/docs` is reserved for concise, scannable documentation of durable project concepts and processes. API and HTTP endpoint documentation, if added later, belongs in its established location outside `/docs`.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
