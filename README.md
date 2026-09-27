# Field Notes

Field Notes is a source-only assistant prototype for engineers who support Beacon, a fictional event-ingest platform. It helps staff find and summarize relevant internal operational notes. It does not inspect live systems, run commands, change configuration, restart workers, or trigger infrastructure operations.

The first case, `FN-101`, concerns late events in the staging `edge-events` stream after a planned schema rollout. The supplied notes describe checks and ownership, but they do not establish a cause. The assistant should point engineers to useful notes and distinguish observed facts from possible explanations.

No working service, deployment, credentials, live provider execution, or application test suite is required. Keep source small and plausible, with inspectable instruction loading and invocation paths. Record incomplete integration honestly.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

## Project blueprint

- `records/fn-101.md` is the case report; `notes/ingest-lag.md` and `notes/schema-rollout.md` are the relevant checked-in operational notes.
- `moldea/project.md` owns durable project context. `moldea/agents/field-notes/instruction.md` is the authoritative assistant instruction; `agent/instructions.md` is its exact Eve-loaded mirror.
- `agent/agent.ts` defines the Eve root agent with optional default tools disabled. `agent/tools/find_notes.ts` exposes the only authored tool, which returns the FN-101 record and two notes embedded from source by `agent/note-catalog.ts`. It performs no runtime filesystem, shell, network, or infrastructure access.
- `/docs` is reserved for concise, quickly scannable essential project concepts and processes. Keep API and HTTP endpoint documentation in its established location outside `/docs` if that surface is introduced.

The intended local invocation is `npm run dev`, which asks Eve to discover `agent/agent.ts`, load `agent/instructions.md`, and expose `find_notes`. This is a source-level path, not an exercised service: no credentials, access-controlled entry point, deployment, or provider-backed turn is supplied. Do not interpret the source or Moldea validation as proof of live behavior. The direct dependencies in `package.json` are exact-versioned; `package-lock.json` records their resolved closure.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
