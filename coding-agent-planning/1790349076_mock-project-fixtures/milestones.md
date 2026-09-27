# Mock project conversation milestones

This existing six-milestone sequence implements `plan.md` in this directory and is amended in place with it. All milestones remain pending; these document amendments do not authorize fixture implementation.

## Rules applied to every milestone

- **Scope and roles:** The driver sends natural requests to actors using the installed skill and preserves factual outcomes. The developer asks the skill-repository agent to review the full first pass. The driver does not tune, judge, initiate reruns, create deliberately invalid cases, or change sibling repositories. Platform connection and Assurance testing remain the developer's manual work.
- **Branches and context:** Check refs and use the next `fixture_<scenario>_<attempt>` number, starting at `01`. Each attempt gets a fresh disposable worktree outside the driver's `main` checkout, based on initial commit `c3ecda12e853b527a96c6ca81150083b0224643a` or an authorized replay checkpoint. Keep planning/index commits outside fixture ancestry. Carry no `node_modules`, generated output, or residual project-local state between attempts. Actors run sequentially with `fork_turns: none` or equivalent. The host delivers the intended existing repository instructions without modifying protected files; actor context contains only those instructions, its brief/constraints, and subsequent requests. Actor inspection stays within its worktree and branch history.
- **Current releases:** After publication confirmation, resolve the latest stable published skill and needed libraries at each attempt's start. Follow published installation, activation, CLI, and adapter contracts; verify the worktree-local skill is selected. Pin actual direct dependencies in the manifest/lockfile and keep them fixed during the attempt. Reuse current driver research and package-download caches, installing dependencies separately per worktree. Do not substitute global skills or development checkouts. Material published-contract changes require revising affected coverage before construction.
- **Natural development:** Prepare small fictional briefs and records without pre-authoring canonical content or adapter-shaped source. Tell every actor: source-only prototype; no working service, deployment, credentials, live provider execution, or application test suite required. Request small, plausible, typed source with meaningful instruction-loading and invocation paths, current SDK APIs, and honest incomplete-integration notes. Send distinct requests, answer actual questions, and include meaningful follow-ups. Adapt the four situations below to actual state; move one to another existing project if needed. Do not reveal expected behavior or canonical destinations, repeat all situations everywhere, or add scenarios for coverage.
- **Owned artifacts:** Each construction milestone owns its listed branches' `README.md`, repository-local skill installation, canonical assets produced through the skill, and necessary product source, fictional records, manifests, and lockfiles. Exact source and canonical filenames follow the actor's development and the published skill. Each milestone also owns its factual rows in the root `README.md` index on `main`. Protected coding-instruction files must remain unchanged.
- **Records:** Keep native sessions with real requests, responses, tool results, errors, and any natural compaction evidence; do not fabricate transcripts or force compaction. Retain actual actor model, reasoning setting, host version, and skill release in native metadata or the existing index, adding only missing fields. Commit reached stages. Product READMEs record case, release/path, base/retry parent, later change, and stopping point; skill-only records its unadopted installation. The index retains scenario, branch, date, release, SHA, session reference, and factual outcome. Mark incomplete products honestly.
- **Verification and publication:** Check worktree targeting, host-delivered instructions/brief constraints, metadata, local skill selection, releases, branch/base/ancestry, diff, and safe fictional content. Preserve unrelated work and protected files. Use `git diff --check`, existing formatting, and only called-for CLI/TypeScript checks; retain actual output. Require `-s -S` commits and verify signatures. Publish only the active attempt branch to verified private `origin` using an explicit refspec, without force or tag following; confirm the remote SHA. Publish index updates from `main`. Report blockers and preserve local evidence. Remove a worktree only after its actor stops and relevant work is preserved; retain branches and commits. No skill-quality certification.
- **Stopping and continuation:** A missing release, broken common installer, or unavailable fresh auditable actor session is a shared prerequisite blocker; preserve the first failure and pause affected execution. A project-specific blocker ends that attempt at its observed state and does not prevent other projects in the currently authorized milestone from being attempted. Do not retry or tune between first-pass projects. Completion of one milestone never authorizes the next.

## Milestone 1: Establish the run and skill-only attempt

**Objective:** Preserve planning on `main`, establish fresh-worktree actor sessions with the intended instructions and auditable metadata, and record local installation without adoption.

**Dependencies:** Approval of this plan and breakdown, explicit authorization of Milestone 1, and developer confirmation that the pending release is published.

**Scope:** Root `README.md` on `main`; publication of the approved `plan.md` and this `milestones.md`; branch `fixture_skill_only_01` and its installation/README artifacts. No product source or project adoption is requested.

**Work:** Verify the host capabilities under the common rules. Research the release and coverage; create and publish the factual index and approved planning records in signed commits on `main`. Record that checkpoint separately from the fixture base. Create the skill-only branch in a fresh worktree, install the skill, deliver the prototype constraints and existing instructions through the host, and confirm actor selection. Stop before adoption; publish and index the attempt.

**Verification:** Demonstrate actual worktree targeting, instruction delivery, local skill selection, distinct messages, and observer access. Retain runtime metadata; a path or session identifier alone is insufficient. Confirm `main` stays unadopted and fixture ancestry excludes planning/index commits.

**Acceptance:** The planning checkpoint and skill-only attempt are safely published with an accessible session, actual metadata, and delivered instructions/constraints. Worktree isolation is established. A shared prerequisite blocker leaves this milestone incomplete.

**Review checkpoint:** Report the startup capabilities actually established, branch and commit references, and any blocker. This checkpoint makes no skill-quality determination.

## Milestone 2: Foundation and context-only projects

**Objective:** Conduct the minimum-adoption and existing-source conversations without requesting agents.

**Dependencies:** Milestone 1's shared prerequisites established and explicit authorization of Milestone 2.

**Scope:** `fixture_initialized_01` for Cedar Workshop and `fixture_context_only_01` for Trail Ledger, their common artifacts, and their `main` index rows. Cedar has no requested source or agents; Trail includes a small reservation slice and fictional equipment/repair records.

**Work:** Give Cedar and Trail separate fresh worktrees and actor sessions under the common rules. For Cedar, request a foundation, clarify that a waitlist entry is not a seat, and stop before source or agents. For Trail, develop the reservation slice and request adoption. Once its repair/availability context is established, ask for an ordinary source change to that rule without mentioning Moldea or canonical updates. React to the actual state, then conclude, publish, and index each attempt.

**Verification:** Apply the common checks and retain Cedar's clarification and Trail's ordinary source-change request and response. Record observed state if the skill differs from the requested minimum or zero-agent scope; do not manually reshape it to match a target or judge its maintenance behavior.

**Acceptance:** Both conversations conclude or have recorded blockers, with the common evidence and publication requirements satisfied. Preserve Trail's context-affecting source-change interaction or the blocker that prevented it.

**Review checkpoint:** Report which requests were delivered, each observed stopping point, publication state, and session reference. Continue without a skill audit between these projects.

## Milestone 3: Direct SDK and LangChain projects

**Objective:** Produce four understandable source-bearing projects through capability requests and subsequent product changes.

**Dependencies:** Shared prerequisites remain available, Milestone 2's attempts have concluded, and Milestone 3 is explicitly authorized. A stopped product from Milestone 2 is not a quality gate for this milestone.

**Scope:** The four branches below, their common artifacts, relevant dependency manifests/lockfiles and source/records, and their `main` index rows.

| Branch | Developer conversation |
| --- | --- |
| `fixture_anthropic_01` | Vendor Desk identifies missing supplier evidence and drafts follow-ups. Introduce a later evidence requirement while procurement staff retain supplier approval. |
| `fixture_google_genai_01` | Catalog Studio drafts from product facts and refines unsupported claims; staff approve publication. After adoption, request a small unrelated code edit from the actual source, such as changing an existing import utility's progress display. |
| `fixture_openai_01` | Parcel Desk explains delayed deliveries from local tracking facts. Add a missing or stale scan case; staff retain refunds and carrier changes. |
| `fixture_langchain_01` | Case Router recommends customer-request queues. Refine an escalation rule; staff retain billing disputes and deletions. |

**Work:** Run each project independently through preparation, adoption, initial capability, and at least one meaningful follow-up, unless a project-specific blocker stops it. Use realistic fictional cases and current official SDK APIs. Commit reached stages, publish each concluded attempt, and update the factual index before moving on.

**Verification:** Apply the common checks. Retain the initial and later product requests as separate real messages. Preserve Catalog Studio's unrelated code request and actual response as evidence for the observer to assess silent abstention; do not disclose that purpose to the actor. Do not execute providers or require application tests.

**Acceptance:** All four projects are attempted and recorded under the common rules, including the unrelated edit interaction or its blocker. Expected skill responses are not acceptance gates.

**Review checkpoint:** Report the four attempt records and any stopped workflow. Do not issue adapter or skill pass/fail judgments.

## Milestone 4: Projects with multiple target forms

**Objective:** Develop product needs that give the supported target forms meaningful roles within one project per adapter.

**Dependencies:** Shared prerequisites remain available, Milestone 3's attempts have concluded, and Milestone 4 is explicitly authorized.

**Scope:** The three branches below, their common artifacts, source/records and dependency manifests/lockfiles, and their `main` index rows.

| Branch | Developer conversation |
| --- | --- |
| `fixture_cloudflare_agents_01` | Mesa Help needs conversational customer support and structured staff routing through the two published supported target forms. |
| `fixture_langgraph_01` | Incident Desk classifies alerts and drafts briefs using Graph and Functional API forms where useful. Let a briefing task naturally reach adjacent alert-normalization or classification source when required by the actual dependency. No automatic paging or production action. |
| `fixture_vercel_ai_sdk_01` | Store Guide combines lookup-assisted catalog guidance and direct comparison generation. No cart or order mutations. |

**Work:** Give each actor product requests in separate turns, allowing the actor and installed skill to determine implementation and canonical structure. Continue with a meaningful routing, briefing, or comparison requirement after the initial capabilities. Keep the requests coherent if a target form proves unsuitable and record the limitation. Conclude, publish, and index each attempt.

**Verification:** Apply the common checks. Preserve the product reason for each capability, the later change, and Incident Desk's discussion and work when the task reaches another relevant module. Let the actual source determine that expansion. Record reached work and limitations without scoring coverage or exposing expected behavior to the actor.

**Acceptance:** All three conversations reach a follow-up or recorded blocker under the common rules. Preserve the task's expansion into another module or its observed limitation, with each session and outcome indexed.

**Review checkpoint:** Report the requests, reached stages, limitations, and publication references. Any evaluation of supported-target behavior belongs to the later observer.

## Milestone 5: Delegation and handoff projects

**Objective:** Conduct realistic developer conversations that introduce a justified specialist, reviewer, or knowledge role.

**Dependencies:** Shared prerequisites remain available, Milestone 4's attempts have concluded, and Milestone 5 is explicitly authorized.

**Scope:** The three branches below, their common artifacts, source/records and dependency manifests/lockfiles, and their `main` index rows.

| Branch | Developer conversation |
| --- | --- |
| `fixture_claude_agent_sdk_01` | Release Desk prepares release notes, adds a reviewer for ambiguous changes, then refines a classification rule. A manager publishes. |
| `fixture_openai_agents_sdk_01` | Trip Care presents itinerary options and adds a fare-rule specialist handoff. Discuss a fare-policy case in an explicitly read-only turn, then authorize implementation in a later message. Staff book or cancel. |
| `fixture_eve_01` | Field Notes helps engineers find operational notes, adds a knowledge subagent and local lookup tool, then refines a lookup need. No infrastructure operations. |

**Work:** Start each product from its brief, adopt through the installed skill, and develop the additional role through actual requests. When role division benefits from planning, ask for the skill's read-only agent-system planning workflow after adoption. Deliver a later product refinement and preserve the real responses, errors, and reached stages. Publish and index each attempt.

**Verification:** Apply the common checks. Preserve delegation and refinement requests without imposing a roster or fixing canonical relationships manually. Retain Trip Care's explicitly read-only request, the actor's actual response and actions, and the later implementation authorization in order; do not tell the actor how the observer will assess them.

**Acceptance:** All three projects reach refinement or a recorded blocker under the common rules. Preserve Trip Care's read-only discussion and later authorization, or the blocker that prevented them.

**Review checkpoint:** Report the completed interactions and stopped points. Defer assessment of delegation and handoff quality to the observer after the whole pass.

## Milestone 6: Complex project and complete first-pass handoff

**Objective:** Develop Harbor Supply through a broader product conversation and hand over the complete 14-attempt record.

**Dependencies:** Shared prerequisites remain available, all earlier milestone attempts have concluded, and Milestone 6 is explicitly authorized. Earlier incomplete products remain evidence and do not require repair before this milestone.

**Scope:** `fixture_custom_complex_01`, its common artifacts, focused source/records and necessary manifests/lockfiles, its `main` index row, and reconciliation of the full index with recorded branches and native sessions.

**Work:** Begin Harbor Supply in its fresh worktree with the agreed actor brief and one believable case involving equipment fit, symptoms, warranty, or shipments. After adoption, use the skill's read-only agent-system planning workflow as needs expand. Develop justified roles with shared and focused context, then introduce a policy change while staff retain authority to make commitments. Let product needs determine roles and turns; retain any natural compaction evidence without forcing it. Preserve, publish, and index the reached state or blocker. Reconcile all 14 scenarios, commits, sessions, runtime metadata, and reached conversational situations. Hand the complete evidence to the developer, who will ask the skill-repository agent to review it.

**Verification:** Apply the common checks to Harbor Supply. Reconcile factual records and access to sessions, actual model/reasoning/host/skill metadata, and recorded commits. Preserve errors, incomplete integration, reached conversational boundaries, and any natural compaction evidence. Do not rerun completed diagnostics, manufacture missing interactions, or audit skill quality.

**Acceptance:** Harbor Supply reaches policy refinement or a recorded blocker. All 14 attempts have native sessions, metadata, delivered constraints, and factual records of reached situations. Safely publishable branches and the index are on `origin`; earlier attempts and local evidence remain preserved. Hand over the complete evidence without a driver verdict or automatic rerun.

**Review checkpoint:** Present the complete branch/session index and unresolved blockers. The developer requests review by the agent in the skill repository; an observed failure alone does not establish that its instructions need changing.

## Later reruns

After the complete authorized first pass, the developer asks the skill-repository agent to review the evidence and determine whether skill adjustment is warranted. A failure does not automatically justify an instruction change. If warranted, the adjustment and release happen in the skill repository. The developer then authorizes the next run, and the skill-repository agent reviews that evidence again. The driver does not tune, judge, or initiate reruns.

For an authorized full rerun of all projects or a subset, reuse the corresponding project scopes with fresh disposable worktrees, fresh actors, next independent attempt numbers, the recorded initial commit, recreated unadopted briefs, and newly selected published releases. Reapply the instruction-delivery, prototype-brief, metadata, and filesystem-isolation rules. Preserve prior attempts and record meaningful input or dependency differences.

A separately requested focused replay uses a fresh worktree and next numbered branch from the recorded commit immediately before the operation, with no leftover project-local state. Record the parent and new setup checkpoint, and state that the skill performed only the replayed operation, not inherited initialization. Neither rerun form is automatic. Platform connection and Assurance testing remain the developer's separate manual work.

## Approval required

The existing six milestones and 14 scenarios remain the implementation scope. Each milestone includes the common worktree, brief, metadata, verification, publication, and evidence requirements.

These inline document amendments do not require another plan/breakdown cycle or additional document approval, and they do not start implementation. After implementation approval, I will signal that planning is complete so you can switch models manually. The pending release must be confirmed published and each milestone explicitly authorized. Report the authorized milestone's outcome and stop before the next. The developer requests the skill-repository agent's review after the complete first pass and authorizes any next run.
