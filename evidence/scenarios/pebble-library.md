# Pebble Library

## Driver brief

Prepared driver brief: a small command-line helper for the volunteer desk of a community workshop that lends tools to members. It works out due dates, checks whether a member may borrow another tool, and prepares plain-text reminder notes. There is no runtime agent, server, database, or email sending.

Initial product facts: hand tools are lent for 7 days and power tools for 3; a member may hold at most 3 tools; a member more than 14 days overdue is suspended from borrowing. A reminder goes out 1 day before the due date, and overdue notes go out on the first and seventh overdue day. The seed holds a product README, two small ESM modules with `node:test` tests, and a root `package.json` without dependencies.

This project exercises the Skill 10.0.1 working-tree link fix. The seed commits a plain copy of the installed distribution under `.claude/skills/moldea/` beside the Codex installation under `.agents/skills/moldea/`. In the actor worktree only, the driver replaces `.claude/skills/moldea` with the relative symbolic link `../../.agents/skills/moldea` and leaves that change uncommitted. This deliberate environment choice reproduces a multi-agent installation whose second agent directory is a link, as the `skills` installer creates. Git then reports the copied files as deleted and the link as untracked.

Run selection: `run-20261022-01`, scenario `pebble-library`, initial attempt `pebble-library-01`, branch `fixture_context_only_xs_pebble_library_01`, fixture base `c3ecda12e853b527a96c6ca81150083b0224643a`. Select Skill `v10.0.1` and CLI `13.0.1` as the fresh-adoption target. Skill `v10.0.1` resolves to tag object `6b7a96282b6e892c9943d030bf620057d2083639` and commit `1cfa4b83c9d98a7947253fc5c7b97d7ea39837b2`, installed with `skills@1.7.4` for Codex. Content identity is the SHA-256 of the compact UTF-8 JSON array of sorted relative `{path,sha256}` file records; the 36 installed files match the tag byte for byte with digest `ac6ce199850952a1914053e506aa52adbf2af08ab11349921682ea6c8323608e`. Driver seed `47a4208b2025b1748ca61feeb95c242562f712c6`.

Keep this brief, future requests, and reviewer criteria outside the actor worktree.

## Actor setup

Reuse the authenticated dedicated private Codex home; request `gpt-6.1-sol` at `xhigh`, workspace-write with network, approvals never, and personality none. No MCP servers or hooks are configured; the personal discovery helper is disabled. Authentication reports ChatGPT login. No credentials or personal configuration are copied. Actual host catalogs, instruction sources, and effective settings come from the native session; configuration isolation is not filesystem isolation.

Use Node 24 and npm with a task-owned writable npm cache. Record base and seed SHAs, the installed skill ref, commit, content hash, and method, and inert initial CLI and Core observations before the first request. CLI and Core start absent; the first installed CLI must be `13.0.1`.

## Prospective conversation

First proposed request:

> Initialize moldea for Pebble Library. Keep the lending rules and the reminder schedule as separate context so each stays tied to its own code.

Later phases, adapted to actual results:

1. After initialization, deliver an ordinary product change to a file that an actual declared relationship covers, such as a new loan period for power tools, without naming moldea.
2. Ask `Validate moldea`.

All requests run in the single actor worktree, with the link in place and tooling left installed after initialization. Only the current natural request goes to the actor.

## Reviewer guidance

The central check is that every launcher-backed `validate` or `inspect` in this worktree completes without `ENTRY_NOT_DIRECTORY` or any other repository-source error for the linked `.claude/skills/moldea` path, and that initialization records `.agents/skills/moldea` in AGENTS.md. Independent reviewers rerun validation in place, with the link present.

Also assess ordinary maintenance: the product change should reach the matched context owner through the gate and scope query, update it when its facts change, and finish with final validation. Separate application correctness, canonical structure, skill behavior, and evidence completeness. A product defect found here becomes a finding for a follow-up release, not a fix in this run.
