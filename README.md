# Release Desk

Release Desk is a source-only assistant prototype for Seatline, a fictional workshop-booking platform. Product staff keep short change records; the assistant prepares customer-facing release-note drafts. A release manager checks the facts, edits the draft, and decides whether and when to publish.

The first case is the planned 2.8 release in `records/release-2.8.md`. Draft notes should separate added features, changed behavior, and fixes without inventing launch dates, availability, or customer impact. The prototype must not publish, deploy, or send messages.

No working service, deployment, credentials, live provider execution, or application test suite is required. Keep source small and plausible, with meaningful instruction-loading and invocation paths. Preserve incomplete integration honestly.

## Project blueprint

- `records/release-2.8.md` contains the planned source changes, not approved release claims.
- `moldea/` owns project context and the release-note drafter's canonical instruction and runtime boundary.
- `src/release-note-drafter/` loads that instruction and the records before constructing a Claude Agent SDK query. `draftSeatline28ReleaseNotes` is exported through its module entry point but is not connected to a service or run by a script.
- `/docs` is reserved for concise, quickly scannable documentation of essential, durable project concepts and processes. API and HTTP endpoint documentation belongs in its established location outside `/docs`.

The query has no built-in tools or filesystem settings and returns unverified draft text for human review; it does not publish, deploy, or message customers or staff. The release manager must check the cited change IDs and uncertain claims before any publication. A future invocation would transmit the source records to the configured model provider. A real caller, credentials, provider execution, and integration verification remain future work, not capabilities established by this prototype.

Direct dependency versions are pinned in `package.json` and `package-lock.json`. On Node.js 22.11 or later, `npm ci --ignore-scripts` installs them and `npm run typecheck` checks the source without invoking a provider. There is no application test suite or runnable drafting command.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
