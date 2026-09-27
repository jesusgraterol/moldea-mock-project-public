# Field Notes

Field Notes is a source-only assistant prototype for engineers who support Beacon, a fictional event-ingest platform. It helps staff find and summarize relevant internal operational notes. It does not inspect live systems, run commands, change configuration, restart workers, or trigger infrastructure operations.

`FN-101` concerns late staging `edge-events` after a planned schema rollout. `FN-102` asks whether events may omit the new optional `sourceRegion` field and who owns parsing questions. The notes describe evidence and ownership, not a diagnosed cause.

No working service, deployment, credentials, live provider execution, or application test suite is required. Keep source small and plausible, with inspectable instruction loading and invocation paths. Record incomplete integration honestly.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

## Project blueprint

- `records/fn-101.md` and `records/fn-102.md` are the case reports. `notes/ingest-lag.md` and `notes/schema-rollout.md` are the checked-in operational notes.
- `moldea/project.md` owns durable project context. `moldea/agents/field-notes/` and `moldea/agents/knowledge/` own the two roles' instructions; their matching `agent/**/instructions.md` files are exact Eve-loaded mirrors.
- `agent/agent.ts` defines the root agent, which delegates note-finding to the local `agent/subagents/knowledge/` specialist. Only the knowledge subagent exposes `lookup_notes`. Its curated `source-catalog.ts` embeds the relevant checked-in records and notes at build time; adding a case or note requires updating the catalog and input schema. The tool performs no runtime filesystem, shell, network, or infrastructure access.
- Both agents disable optional default tools. The root also disables root-copy delegation. The local `dev` script binds to loopback and disables Eve's default development extensions, including self-modification.
- `/docs` is reserved for concise, quickly scannable essential project concepts and processes. Keep API and HTTP endpoint documentation in its established location outside `/docs` if that surface is introduced.

The intended local invocation is `npm run dev`: Eve discovers the root and `knowledge` agent files, loads their mirrored instructions, exposes the local subagent to the root, and exposes `lookup_notes` only to that subagent. Use that script rather than bare `eve dev`, which would omit the safety flags. This is a source-level path, not an exercised service: no credentials, access-controlled entry point, deployment, or provider-backed turn is supplied. Do not interpret the source, build, or Moldea validation as proof of live delegation. The direct dependencies in `package.json` are exact-versioned; `package-lock.json` records their resolved closure.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
