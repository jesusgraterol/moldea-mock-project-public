# Saffron Menus

## Driver brief

Prepared driver brief: the Saffron café's weekly menu-card helper. The kitchen records each week's dishes in `menus/week-<week>.json`, and the project-owned `menu-card` Agent Skill under `.agents/skills/menu-card/` turns that file into a printable Markdown card under `cards/`. Price labels come from `src/price-labels.js`. There is no runtime agent, server, or model call in the application.

The project is already adopted. Its manifest binds `moldea/context/menu-style.md` and `moldea/context/allergens.md` to `/.agents/skills/menu-card/SKILL.md`, whose instructions read both files, and relates `moldea/context/pricing.md` to `/src/price-labels.js` through `affectedBy`. The managed README and AGENTS.md blocks come from the installed skill's bundled writers. The seed declares `@moldea.ai/cli` `13.0.1` exactly in root `devDependencies` with its lockfile and has no `node_modules`; this deliberate environment choice represents a fresh clone or worktree whose dependencies are not installed yet. The seed validated with zero diagnostics through a temporary installation that was removed before the seed commit.

Run selection: `run-20261022-01`, scenario `saffron-menus`, initial attempt `saffron-menus-01`, branch `fixture_skill_only_xs_saffron_menus_01`, fixture base `c3ecda12e853b527a96c6ca81150083b0224643a`. Select Skill `v10.0.1`, tag object `6b7a96282b6e892c9943d030bf620057d2083639`, commit `1cfa4b83c9d98a7947253fc5c7b97d7ea39837b2`, installed with `skills@1.7.4` for Codex; the 36 installed files match the tag with digest `ac6ce199850952a1914053e506aa52adbf2af08ab11349921682ea6c8323608e`. Driver seed `132a5ded61f2ebd14b898ab293c68fd14e258b06`. CLI target `13.0.1`.

Keep this brief, future requests, and reviewer criteria outside the actor worktree.

## Actor setup

Same shared run configuration as Pebble Library: the authenticated dedicated private Codex home, `gpt-6.1-sol` at `xhigh`, workspace-write with network, approvals never, personality none, no MCP servers or hooks, and a task-owned writable npm cache. CLI and Core start absent from `node_modules` while the root declaration and lockfile name CLI `13.0.1`.

## Prospective conversation

Planned requests, adapted to actual results:

1. Run the project skill: `Use the menu-card skill to draft the card for week 43.`
2. An ordinary change to the `affectedBy` source: whole-dollar price labels without cents.
3. Ask the actor to install the project dependencies.
4. Edit the project skill's instructions so every card ends with an allergy line for guests.
5. A context correction: sesame is also a major allergen the card must flag.
6. An unrelated change: a small script that counts dishes per week.

Only the current natural request goes to the actor.

## Reviewer guidance

Request 1 is host work: the actor should read the skill's named files without loading the moldea `SKILL.md`; any precheck covers only paths the run touches. Request 2 should hit the pricing relationship, attempt the launcher once, and report in one line that the CLI is not installed with the install step, without canonical reads or writes, while finishing the price change. Request 3 establishes tooling; the first installed CLI must be `13.0.1`. Requests 4 and 5 are direct skill and context work that should finish with launcher-backed validation. Request 6 should stay silent about moldea.

Separate application correctness, canonical structure, skill behavior, and evidence completeness. A product defect found here becomes a finding for a follow-up release, not a fix in this run.
