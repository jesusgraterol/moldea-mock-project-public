# Mock project fixture plan

## Objective and scope

Build believable mock projects through the actual repository-installed `moldea` skill, preserving numbered attempts so the developer can study successes, failures, and improvements after skill changes. Successful attempts become fixtures for later manual repository connection, PR Assurance, and resolution-prompt testing. The deliverable is the project branches, their development history, and a concise index of attempts and outcomes.

The coding agent simulates a developer building each product through successive requests, clarification, review, and refinement. The installed skill determines its relevant operations and canonical changes. Source, README, project context, instructions, and declared relationships must agree. A final valid manifest alone does not establish that the skill worked well.

Keep the work simple: ordinary Git branches, the official installer, exact package dependencies, short README records, and the actual coding session. No fixture generator, updater, conversation runner, evaluation framework, custom reporting system, or CI matrix is required. Projects need no working service, provider calls, credentials, database, application tests, or deployable build. Source-bearing successful attempts must pass no-emit TypeScript checking and the relevant skill checks.

Cloud connections, GitHub App changes, PRs, Assurance runs, resolution prompts, and edits to the sibling `skill`, `packages`, or `platform` repositories remain outside this implementation. The developer's separate observing agent can inspect the coding session and make skill adjustments independently.

## Repository evidence and startup conditions

- `main` currently tracks `README.md`, `LICENSE`, `.gitignore`, and this task's planning files. The README contains only the repository title. There is no application, package manifest, installed skill, or canonical `/moldea/**` project. No fixture implementation has started. The current worktree changes are this plan and removal of the obsolete milestone file.
- The planning files have already been committed. Preserve them and their history; they may be inherited by fixture branches. Do not introduce stripping commits or history rewrites to satisfy the old plan's obsolete exclusion. Local `AGENTS.md` is ignored and protected. Do not modify or add protected instruction files.
- The sibling skill's `README.md`, `docs/getting-started.md`, and `docs/coding-agent-compatibility.md` establish repository-local installation, explicit initialization, a minimum foundation and managed README block, and a distinction between installation and host activation. Initialization establishes its compatible repository-local CLI only after sufficient product evidence exists. Planning an agent system follows adoption and can recommend zero agents.
- The inspected `qualification/profiles/index.yaml` lists ten package-backed adapter families plus `custom`. Cloudflare Agents, LangGraph, and Vercel AI SDK each have two target forms. These observations support the coverage below; they do not select a release or qualify a future library version.
- Before fixture implementation, the developer must confirm that the pending skill and adapter upgrade is published. At each new attempt, inspect the latest stable published release, its installation instructions, compatibility ranges, and adapter contracts. The sibling development checkout and examples containing old package pins are not installation sources for these attempts.
- If the published upgrade cannot be identified or obtained, record the blocker before installation. If its repository format, adapter inventory, or supported workflows materially change this plan, report the specific mismatch and revise the affected scope before proceeding. A missing publication does not itself require redesigning the plan.

Planning can be approved before the release exists. Once the plan and regenerated milestones are approved, the developer can confirm publication and authorize the chosen milestone. No release number is prescribed in these planning files.

## Numbered attempts and project coverage

Leave `main` unadopted. Its README becomes a concise index of scenarios, numbered attempt branches, outcomes, selected skill releases, and reviewed commit SHAs. Identify which successful attempt should be used for manual testing. Keep this information in one Markdown table; do not add alias branches or a separate registry.

Name fixture branches `fixture_<scenario>_<attempt>`, starting at `01` and incrementing independently for each scenario. For example, `fixture_openai_01` and `fixture_openai_02` are attempts at the same project. The suffix is unrelated to the skill version or milestone number. Check existing local and remote refs before allocating a number; never replace an existing attempt.

Use ordinary commits while an attempt is active. Once concluded, preserve its branch tip and history; further project work uses a new attempt. Later observations can be added to the index on `main` without rewriting the recorded result.

A fresh project attempt starts from a recorded unadopted `main` commit and receives its own repository-local skill installation. Replace the inherited index with that project's README and short attempt record before requesting adoption. The skill-only scenario is a separate fixture; each project owns its installation. Do not copy another project's canonical files to manufacture a successful adoption.

| First attempt | Product brief and boundary | Required successful coverage |
| --- | --- | --- |
| `fixture_skill_only_01` | Install the skill without adopting a product. | Selectable repository-local skill; no canonical foundation, managed README block, or CLI dependency. |
| `fixture_initialized_01` | Cedar Workshop needs shared context for class booking and waitlists. A waitlist entry is never a confirmed seat. | Minimum adopted foundation, zero agents, no application source or extra context. |
| `fixture_context_only_01` | Trail Ledger clerks need stock, reservations, and repairs to agree. Gear under repair cannot be promised to a renter. | Source-backed context and narrow `affectedBy` relationships; zero agents. |
| `fixture_anthropic_01` | Vendor Desk reviews supplier packets for missing evidence and drafts follow-ups. Procurement staff approve suppliers. | Direct Anthropic SDK agent. |
| `fixture_google_genai_01` | Catalog Studio drafts product copy from catalog facts and flags unsupported claims. Staff approve publication. | Google Gen AI agent. |
| `fixture_openai_01` | Parcel Desk explains delayed deliveries from local tracking facts. Refunds and carrier changes remain with staff. | Direct OpenAI SDK agent. |
| `fixture_langchain_01` | Case Router classifies customer requests and recommends queues. Billing disputes and deletion decisions remain with staff. | LangChain agent. |
| `fixture_cloudflare_agents_01` | Mesa Help provides edge chat and structured reasoning for cases requiring staff routing. No account mutations. | Both qualified Cloudflare target forms serving the same support product. |
| `fixture_langgraph_01` | Incident Desk classifies an alert and assembles a draft incident brief. No paging or production action. | Graph and Functional API targets serving one incident workflow. |
| `fixture_vercel_ai_sdk_01` | Store Guide answers catalog questions and produces comparisons. It cannot change carts or place orders. | Tool-loop and direct-generation target forms. |
| `fixture_claude_agent_sdk_01` | Release Desk drafts release notes and delegates ambiguous changes to a reviewer. A release manager publishes. | Claude Agent SDK with source-observable programmatic subagent delegation. |
| `fixture_openai_agents_sdk_01` | Trip Care presents itinerary-change options with a fare-rule specialist. Staff book or cancel travel. | OpenAI Agents SDK with a source-observable handoff. |
| `fixture_eve_01` | Field Notes helps on-call engineers find relevant operational notes. It never operates production infrastructure. | Eve root agent, knowledge subagent, and grounded local lookup tool. |
| `fixture_custom_complex_01` | Harbor Supply's dealer desk needs advice across equipment fit, technical symptoms, warranty coverage, and shipment exceptions. Staff make final commitments. | Several justified model-reasoning roles, custom runtime guidance, and meaningful shared and agent-specific relationships. |
| `fixture_partial_01` | Derive from a successful Cedar Workshop attempt and remove only `moldea/project.md`. | Expected partial-adoption diagnostic and a concise defect note. |
| `fixture_invalid_binding_01` | Derive from a successful Parcel Desk attempt and change one exact implementation binding to a nonexistent source path. | Expected binding diagnostic and a concise defect note. |

These rows define product intent and coverage, not prewritten agent rosters or canonical content. Source filenames, agent IDs, context topics, capabilities, tools, and bindings follow the product and skill workflow. Multiple targets and delegation must serve actual product needs. Harbor Supply must have several meaningful reasoning responsibilities, but has no arbitrary agent quota. Keep deterministic lookups in ordinary software and final commitments with staff.

## Versions, outcomes, and retries

At the start of each fresh or retry attempt, resolve the latest stable published skill, repository-local CLI, direct SDK packages, necessary peers, TypeScript, and required type or schema packages. Read the selected release's compatibility contract and actual package APIs. Pin the chosen releases and dependency lockfile for the attempt. Let the skill establish CLI tooling at its normal authorized adoption or maintenance step; version discovery does not justify preinstalling it before sufficient product context exists.

Keep those selected versions fixed during the attempt. Add a newly needed dependency only when the evolving product requires it, recording its exact version. If changing an existing selected release is necessary, conclude the current attempt and start another numbered attempt. A later release does not invalidate an earlier successful branch. Different branches using different skill, CLI, adapter, or SDK releases are expected. There is no global publication cutoff, final upgrade sweep, or automatic merging of skill updates into completed attempts.

If the latest stable packages are incompatible, fail to install, or expose APIs the adapter cannot recognize, record the exact mismatch and stop the affected attempt. Do not silently downgrade, change runtime IDs, or treat a development checkout as the requested release. Other independently authorized projects may continue.

Use plain outcomes: `passed`, `failed`, `blocked`, and `intentional_invalid`. `passed` means the fixture's specified checks and observed skill workflow succeeded, not that an application or provider ran. `intentional_invalid` is reserved for the two deliberately mutated scenarios after their expected diagnostic is verified. An unexpected skill failure is never relabeled as one of those fixtures.

Before initialization and every subsequent simulated request that may change files, ensure the intended project inputs are committed and record that commit SHA alongside the exact request in the coding session. This includes the product README, any source and mock records, the installed skill, and package files already present; it does not require creating missing tooling or canonical files early. Review and sign any necessary checkpoint commit with `-s -S`. Reuse the existing commit when the state is unchanged, and create no empty commits for read-only exchanges. If the intended input state cannot be safely committed, preserve it and report the blocker before starting the writing request. This establishes the starting state independently of the failure state preserved afterward.

When a failure occurs, preserve the request, relevant repository state, diagnostic, and observed behavior before trying a correction. An ordinary implementation mistake may be corrected within the same attempt, retaining evidence of the failed step and subsequent result. A skill or compatibility problem requiring an external fix ends that attempt. Preserve its branch and safe changes in signed commits when possible; report anything that cannot be safely committed. Do not erase the symptom through hand-written canonical repairs or claim success because manual intervention produced valid output. Skill-directed supported repair can be observed and reported as recovery, with the initial problem still visible.

For a retry, allocate the next branch number and start from the recorded commit immediately before the failing request. An initialization retry therefore starts from its preserved unadopted product state; a maintenance retry starts from its preserved adopted state. Preserve the original branch, brief, and request. Install the new attempt's selected releases, update its attempt metadata, and record any setup or dependency changes before committing the new input checkpoint and replaying the operation. Record both the original starting SHA and the new attempt's checkpoint. A partial replay establishes evidence for the replayed operation; it does not establish that the newer skill performed the inherited project's original initialization.

Prefer a fresh coding session for retries, and always verify selection of the new branch's installed skill. If other package versions changed too, report that fact rather than attributing a changed outcome solely to the skill. There is no automatic retry loop or fixed retry budget; a retry remains part of a specifically authorized project milestone. Moving to another milestone still requires that milestone's authorization.

Negative fixtures are the exception to fresh version selection: derive them from an exact successful parent commit and retain its releases. Their only canonical mutation is the specified defect. This preserves a useful parent-to-negative comparison without an unrelated upgrade.

## Simulated developer interaction and observer evidence

Use the following natural progression for each source-bearing project, adapting its length and details to the product:

1. Start with a concise developer brief, typed mock records, and the smallest credible first product slice. Provide enough evidence for adoption without prescribing Moldea files or designing the full agent system in advance.
2. Commit the unadopted product inputs and record the checkpoint alongside the request, then request `Initialize moldea` through the actual selected repository skill. Let it determine whether product clarification is needed and create the foundation. Supply a coherent fictional developer answer only when a real ambiguity arises; do not force a question when the evidence is sufficient. Apply the same checkpoint rule before later requests that may change files.
3. Continue with an ordinary request for the next capability. Where role division matters, especially Harbor Supply, use the skill's read-only agent-system planning workflow after adoption. Implement source and skill-maintained context or agents together.
4. Review the actual result and introduce a meaningful follow-up beyond initialization and agent creation. Ask for an explanation, clarify a policy, correct an observed misunderstanding, or request a realistic exception. Deliver requests sequentially, inspect the intermediate state, and let the skill decide relevance and maintenance. Every source-bearing successful attempt includes at least one later requirement change reflected in source and canonical state.
5. Continue only while another interaction adds useful product or skill evidence. There is no fixed turn count. Commit coherent checkpoints so the initial adopted state and later refinement can be inspected independently.

For example, Parcel Desk can begin with explaining delayed deliveries, then add an assistant restricted to tracking facts, then handle a shipment without a recent scan. A follow-up about uncertain arrival estimates must respond to actual output or an explicitly introduced requirement; do not pretend the agent made an error it did not make.

Cedar Workshop stops after foundation initialization and any necessary clarification. Trail Ledger evolves context without adding agents. The skill-only and intentionally invalid scenarios do not need manufactured conversations. Across all projects, do not prewrite a successful dialogue, expected skill responses, canonical manifests, or adapter-shaped snippets and pass them off as observed skill use.

When the coding agent supplies both the fictional developer request and its implementation, label simulated requests and answers clearly in the session. They are not messages or approvals actually issued by the user. Fictional product choices can be resolved within the brief; real scope changes and milestone authorization remain with the user. Do not feed the builder a prescribed canonical solution or silently coach it around a weakness. This simulation provides workflow evidence with limitations; the observing agent should be able to spot hindsight-driven steering.

Keep evidence lightweight. Each attempt's README contains a short attempt record: starting date, base commit, any retry relationship and replay point, installed skill path and release, CLI and adapter identity where exposed, outcome, checks performed, and unresolved limitations. Exact dependency versions live in the manifest and lockfile; do not duplicate every transitive package in prose. Include a representative product request, named mock record, expected outcome, and later behavior change. Put the final reviewed commit SHA in the index on `main`, avoiding a self-referential SHA inside the attempt's own commit.

The actual coding session supplies detailed requests, answers, tool results, and errors. Report meaningful request boundaries and skill operations when they occur; do not fabricate a transcript afterward. The developer's observing agent can inspect unnecessary questions, missed relevance, invented policy, broken relationships, and workarounds. No observer automation, message integration, or mandatory observer approval after every turn is added. Skill changes remain outside this repository's implementation scope.

## Skill use and owned files

Install the selected immutable release with the official repository-scoped installer. Inspect its generated paths and installed `SKILL.md`. Before each skill-dependent operation, establish that the coding host selected that branch's repository-local copy, reusing valid session evidence until the branch, installation, or host changes. File presence, a manually read file, or a successful CLI call alone does not prove host activation. If discovery fails, re-enter in a compatible session; leave the attempt blocked if selection still cannot be verified. Never substitute a global skill or sibling source checkout.

Let the installed skill own operation selection, relevance checks, focused reference loading, canonical writes, and its managed README block. Ordinary follow-up requests should not all name Moldea or manually prescribe context updates; this would conceal failures of its natural maintenance workflow. Perform fixture verification explicitly at review checkpoints, distinguishing it from tooling the skill chose during an ordinary request. Do not force extra CLI work on every conversation turn.

The implementation owns these files and artifacts only as needed:

- `main`: its existing `README.md` index and short attempt/retry instructions. Keep existing tracked planning files and ordinary repository files intact.
- Skill-only attempts: installer-owned repository-local skill files and a short README record. No CLI dependency or adoption.
- All valid adopted attempts: a product README and skill-managed block; `package.json` and `package-lock.json` with a repository-local exact CLI dependency; `moldea/moldea.yaml` and `moldea/project.md` created through the skill.
- Source-bearing attempts: `tsconfig.json`, focused TypeScript source, mock records, exact SDK and TypeScript dependencies, and only required peers or type packages. Define exact paths when the developer request and selected SDK establish the owning modules.
- Agent-bearing attempts: skill-maintained agent `description.md` and `instruction.md`, focused context, runtime guidance, and supported capability or implementation relationships. Target-owned `handoff-description.md` is optional when useful; actual delegation must exist in runtime source. Do not invent a manifest-owned handoff graph.
- Negative attempts: their parent's files, the single canonical defect, and its README explanation.

Follow the selected skill's installation and tooling restrictions, including disabled lifecycle scripts when establishing dependencies. If an installer proposes modifying protected instruction files, stop that installation path and report the conflict before committing. Add no secrets, framework shells, filler documents, application tests, runtime services, deployment files, or unrelated infrastructure. Keep all files and branch names within repository naming and portability rules.

## Ordered implementation and review checkpoints

1. After release confirmation and implementation authorization, inspect the published contracts, verify the planned coverage remains applicable, and prepare `main`'s fixture index. Create the first skill-only attempt and verify host selection without adoption. Review the installation footprint and branch identity before building products.
2. Build the initialized and context-only scenarios through their developer briefs. Confirm the minimum fixture stays minimal and the context fixture demonstrates real maintenance while retaining zero agents. Review each attempt's story, skill use, outcome, and recorded versions.
3. Build the adapter projects one at a time through sequential developer requests. Prefer simple projects before multiple-target and delegation projects, but treat this as a useful order rather than an artificial dependency. A failed adapter does not require unrelated projects to wait. Review each concluded attempt and preserve failures for the observing agent and later retries.
4. Build Harbor Supply using initialization, skill-led planning, justified specialist responsibilities, and natural refinement. Simple-project experience informs the work, but success of every earlier adapter is not a prerequisite. Review the complete dealer case and each source-backed relationship.
5. Derive each intentionally invalid scenario after its own successful parent is available. Verify the parent-to-negative diff and expected diagnostic. Neither negative scenario depends on the other being ready.
6. Publish reviewed concluded attempts and update the index as useful checkpoints are reached, without requiring the entire collection to be finished first. Preserve failed and blocked attempts as clearly labeled evidence where their state is safely representable. Final inventory review identifies successful fixtures, intentional invalid states, preserved failures, and any missing coverage. Do not refresh releases merely because publication occurs later.

These are strategic steps, not implementation authorization or a replacement milestone sequence. Regenerate the breakdown from this revision. Each future milestone remains a separately authorized scope, including its necessary verification and publication work. An incomplete project can be parked while another independent milestone is authorized; parking does not mark the failed project complete.

Before each commit, inspect the complete intended change and relevant history. Keep commits cohesive and use both `-s -S`. Preserve user changes, planning files, and protected instructions. Publish only the intended active branch `HEAD` to its verified private `origin` destination through an explicit one-branch refspec, without force or tag following. Do not bypass signing or hooks. Failed fixture checks are reported as the evidence that branch preserves, never as successful verification. Unresolved Git conflicts, secrets, or unrelated unsafe changes remain publication blockers.

## Verification, acceptance, and limitations

At appropriate fixture checkpoints, use the repository-local compiler and installed skill launcher. The invocation shape inspected during planning is:

```bash
./node_modules/.bin/tsc --noEmit
node .agents/skills/moldea/scripts/moldea-cli.mjs --repository "$PWD" -- composition --json
node .agents/skills/moldea/scripts/moldea-cli.mjs --repository "$PWD" -- validate --json --max-output-bytes 65536
node .agents/skills/moldea/scripts/moldea-cli.mjs --repository "$PWD" -- inspect --json --max-output-bytes 65536
git diff --check
git status --short --branch
```

These commands target the current Bash workspace. Typecheck only source-bearing attempts; run adopted-project checks only where adoption is intended. Confirm the selected release's launcher contract before using it and follow its supported equivalent if the invocation changed. Tool-output pagination or truncation must not be mistaken for complete evidence.

For successful adopted attempts, validation must pass, composition must identify the intended adapter where agents exist, and inspection must match the source-justified agents and runtime assignments. Check adapter-specific evidence and warnings, actual bindings, `affectedBy` paths, tools, and handoffs. Registered relationships must point to existing source. Typechecking establishes compile-time API compatibility, not provider or runtime execution.

Read the README, source, and canonical content together. Trace the representative request through a mock record and policy to its expected outcome. Inspect the later requirement change and actual skill operations, intermediate diffs, and commit progression. Verify that each request that could change files has a recorded starting SHA identifying its committed inputs; for retries, inspect the recorded setup changes between the original and new checkpoints. Keep a distinction between first-pass success, recovery after a recorded problem, and unresolved failure. Passing structural checks cannot conceal unsupported policy, stale instructions, or manual canonical reconstruction.

For `main` and skill-only attempts, verify the intended absence of adoption directly. For negative fixtures, require the named diagnostic without an independent defect and confirm the exact successful parent. For unexpected failures or blockers, preserve the relevant checks and their limitations rather than requiring them to pass before an attempt can be recorded.

Review generated and changed paths, package and lockfile contents, documentation, and complete intended commit changes. Respect the hard archive/backup content exclusions. Run available targeted formatting without installing extra tooling. No application test suite or provider execution is required for this corpus. No migrations are planned. After each push, compare local `git rev-parse HEAD` with the corresponding remote ref; for example:

```bash
git ls-remote origin refs/heads/fixture_initialized_01
```

Use the actual numbered branch when verifying another attempt. Record the reviewed SHA and outcome on `main` after the attempt is committed, then publish that index update through the same scoped Git procedure.

The complete fixture deliverable requires the uninitialized `main`, a successful skill-only attempt, at least one successful attempt for each of the thirteen valid project scenarios, and both verified intentional-invalid scenarios at `origin`. Source-bearing successful attempts must typecheck and demonstrate skill use through initial development and subsequent refinement. Preserved failed attempts supplement this coverage; they do not satisfy missing successful scenarios. Reports may describe partial progress while some projects remain blocked, without claiming the whole deliverable is complete.

No shared skill version is required across successful branches. Their recorded start-time release selection, actual host activation, observed operations, and immutable concluded state are the evidence. Do not claim that provider behavior, Cloud connection, PR Assurance, or resolution prompts were tested. A separate observing agent's conclusions must not be fabricated or assumed.

## Approval required

Approval is requested for this fixture-only plan: after confirmation that the skill and adapter upgrade is published, build the listed scenarios through realistic sequential developer requests, preserve numbered successful and unsuccessful attempts with their own selected releases, verify skill use and source compatibility, and publish reviewed attempts with a concise index. Existing concluded attempts will not be automatically upgraded. The previous `milestones.md` has been removed because this revision changes branch identity, retry rules, dependencies, and publication; regenerate it with `breakdown`. After the plan and new milestone sequence are approved, planning is complete and I will signal readiness for the manual model switch. Implementation starts only after release confirmation and explicit authorization of the chosen milestone.
