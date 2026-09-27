# Mock project fixture milestones

This sequence implements the current `plan.md` in this directory. No fixture implementation has started. The numbered milestones are review boundaries; branch suffixes identify attempts and increment independently. The listed branches are first-attempt names. Use the next available suffix for a retry and preserve every concluded attempt.

## Rules shared by the milestones

These rules are part of each applicable milestone's implementation, verification, and acceptance criteria.

- **Startup and dependencies:** Begin fixture work only after the developer confirms the skill and adapter upgrade is published and authorizes a milestone under the approved plan and breakdown. Milestone 1 establishes the unadopted main base, index, and verified installation method. Milestones 2–14 need those startup prerequisites, but do not depend on each other's success. A publication-only blocker does not prevent separately authorized local work with satisfied prerequisites. Milestones 15 and 16 each need their own successful parent. The order favors simpler projects first without making that a requirement for unrelated projects.
- **Independent attempts:** Start fresh projects from a recorded unadopted `main` commit and install the skill in that project. Replace the inherited index with the product README before adoption. Check local and remote refs before choosing the attempt number. Completed branches retain their tips and history; no global skill refresh or automatic propagation of upgrades is performed.
- **Release selection:** For each fresh or retry attempt, verify the latest stable published skill, compatible CLI and adapter contracts, and required libraries at attempt start. Pin selected dependencies exactly and retain the lockfile. Read the actual SDK APIs and installed adapter contract. Keep selected releases fixed during that attempt; record any genuinely needed new dependency. Let the skill establish CLI tooling at its normal adoption or maintenance step. Missing publication blocks the attempt; material changes to planned coverage require a plan revision. Do not silently downgrade or substitute a runtime. Negative fixtures inherit their valid parent's releases without upgrading them.
- **Actual skill use:** Verify that the host selects the branch's repository-installed skill path and release; repeat selection checks after branch, installation, or host changes. Installation and CLI success alone are insufficient. If selection cannot be verified, re-enter a compatible session or report the attempt blocked. Use the installed skill for adoption, agent planning where needed, creation, maintenance, and supported repair. Do not hand-author canonical output to conceal a skill failure.
- **Developer interaction and checkpoints:** Deliver clearly labeled simulated requests sequentially, answer actual product ambiguities coherently, and review the observed result before the next request. Before initialization and every later request that may change files, commit the intended inputs and record their SHA alongside the exact request in the session. Include the product README, existing source and mock records, installed skill, and package files already present; do not create missing tooling early. Reuse an existing checkpoint when unchanged and add no empty commits for read-only exchanges. Every source-bearing successful project includes a meaningful later requirement change reflected in source and canonical state. There is no fixed conversation length or agent quota.
- **Failure and retry:** Preserve the request, starting state, failure state, and diagnostics before correction. Ordinary implementation corrections and skill-directed recovery retain their observed history. A skill or compatibility problem requiring an external fix concludes that attempt; the project milestone remains incomplete. Retry under authorization for that project using a new numbered branch from the recorded pre-request commit, preferably in a fresh session. Record inherited state, selected releases, setup changes, and both original and new checkpoint SHAs. A partial replay proves only its observed operations. Other independently authorized milestones may proceed; no automatic retry loop is added.
- **Records and observer:** Keep a concise attempt record in the branch README with date, base/retry checkpoint, selected skill path and release, exposed CLI/adapter identity, outcome, checks, and limitations. Source-bearing projects also describe a named mock case, expected outcome, and later refinement. Keep detailed requests and tool results in the actual coding session for the developer's separate observing agent. Do not fabricate transcripts, observer findings, or approvals, and do not add observer automation. Skill changes happen outside this implementation.
- **Verification and publication:** Perform the applicable checks below and read the source, README, and canonical state together. Review task changes, dependency and installer output, paths, and relevant history. Preserve existing tracked planning files, unrelated user changes, and protected instruction files; respect archive/backup exclusions. Use available targeted formatting without adding tooling. Create cohesive task commits with `-s -S`; do not bypass signing or hooks. Publish reviewed concluded attempts to the verified private `origin` through explicit one-branch refspecs without force or tag following. Compare each remote ref with its reviewed local commit. Update and publish only the owning attempt's records in `main`'s README, including the reviewed SHA and selected successful fixture. Publication and this index update belong to the project milestone, including safely representable failed or blocked attempts.

Use outcomes `passed`, `failed`, `blocked`, and `intentional_invalid`. Preserving a failure is useful progress but does not satisfy a project's successful acceptance criteria. A milestone with missing publication or required evidence remains incomplete. Git conflicts, secrets, and unsafe unrelated changes remain blockers regardless of the expected fixture outcome.

No milestone connects Cloud, opens PRs, runs Assurance, generates resolution prompts, calls model providers, adds application tests, deploys services, or modifies the sibling skill, packages, or platform repositories. No migrations, fixture generator, CI matrix, or custom reporting system is introduced.

## Common files and verification

Each adopted project owns its product `README.md` and skill-managed block, repository-local CLI `package.json` and `package-lock.json`, and skill-created `moldea/moldea.yaml` and `moldea/project.md`. Each source-bearing project also owns `tsconfig.json`, exact TypeScript/SDK dependencies, focused source, and typed mock records. Registered agents own skill-maintained `description.md` and `instruction.md`, with focused context, runtime guidance, capabilities, bindings, and optional target-owned handoff descriptions only where justified. Exact source filenames and agent IDs follow the developer workflow and skill decisions; they are not invented in advance by this breakdown.

The applicable adopted-project checks use the selected skill's supported launcher contract. The invocation shape inspected in the plan is:

```bash
./node_modules/.bin/tsc --noEmit
node .agents/skills/moldea/scripts/moldea-cli.mjs --repository "$PWD" -- composition --json
node .agents/skills/moldea/scripts/moldea-cli.mjs --repository "$PWD" -- validate --json --max-output-bytes 65536
node .agents/skills/moldea/scripts/moldea-cli.mjs --repository "$PWD" -- inspect --json --max-output-bytes 65536
git diff --check
git status --short --branch
```

Run TypeScript checking only for source-bearing projects. For valid adopted projects, require successful validation, the intended adapter composition where agents exist, and source-backed inspection results. Read relevant warnings and paginated output fully. Trace the representative request and later refinement through mock records, policy, source, and canonical state. Verify checkpoint SHAs and actual skill-operation evidence. Typechecking and inspection do not establish provider execution.

For unadopted states, check absence of adoption directly. For intentional invalid states, require the designated diagnostic without an independent defect. For failed or blocked attempts, record actual results without reporting them as passed. After publication, use `git rev-parse HEAD` and `git ls-remote` for the actual branch; the plan's example is `git ls-remote origin refs/heads/fixture_initialized_01`.

## Milestone 1: Main index and skill-only attempt

**Objective:** Establish the uninitialized repository index and a selectable installed-skill fixture.

**Dependencies:** Approved plan and milestone sequence, explicit milestone authorization, and developer confirmation that the upgrade is published.

**Owned scope:** `main`'s `README.md`; `fixture_skill_only_01` README and installer-owned repository-local skill files. Preserve existing tracked planning files. Neither branch gains canonical state, a managed README block, or a CLI dependency.

**Implementation:** Verify the published release, installation instructions, adapter inventory and target forms, and CLI compatibility contract without prescribing a version in advance. Create the concise main index and attempt instructions. Install the verified immutable release on the numbered skill-only branch, inspect the generated files, verify host selection, and publish its outcome and index record under the shared rules.

**Verification:** Check installed identity and selection evidence, installation footprint, absence of adoption and CLI files, task diffs, signed commits, and remote-ref identity.

**Acceptance criteria:** Main remains unadopted; a successful skill-only attempt is published and accurately indexed. The verified base and installation method are available for independent projects.

**Review checkpoint:** Inspect the selected release, generated paths, host-selection evidence, and absence of premature initialization.

## Milestone 2: Cedar Workshop minimum initialization

**Objective:** Publish the minimum adopted project with zero agents.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_initialized_01` installed skill and common adopted-project files, plus its main index entry. No application source, TypeScript tooling, or extra canonical context.

**Implementation:** Prepare the class-booking and waitlist brief, checkpoint it, then request initialization through the selected skill. Answer necessary product clarification and stop at the foundation. Record and publish the attempt.

**Verification:** Run composition, validation, and inspection; require zero agents and only the minimum canonical foundation. Confirm a waitlist entry cannot be described as a confirmed seat. Review skill use, checkpoint, README block, and publication evidence.

**Acceptance criteria:** A successful minimum initialization is published and indexed. No later feature or artificial refinement has expanded this fixture.

**Review checkpoint:** Inspect whether the skill grounded the foundation in the brief and stopped at the requested scope.

## Milestone 3: Trail Ledger context without agents

**Objective:** Publish a small rental project whose context follows ordinary development.

**Dependencies:** Startup prerequisites from Milestone 1; Cedar Workshop need not succeed first.

**Owned scope:** `fixture_context_only_01` common source-bearing project files, rental/stock/repair source and records, skill-maintained context and `affectedBy` relationships, and its index entry. No agent registration.

**Implementation:** Build the initial rental slice, initialize through the skill, and use sequential developer requests to evolve reservation or repair behavior. Include a meaningful later rule change and observe context maintenance without prescribing its output. Publish the reviewed result.

**Verification:** Apply common source and skill checks; require zero agents. Trace a named rental case and refinement through source, narrow relationship paths, and canonical context.

**Acceptance criteria:** The published project typechecks, validates, demonstrates context maintenance, and never promises gear under repair.

**Review checkpoint:** Inspect the source-to-context change and confirm deterministic rental rules did not create an unnecessary agent.

## Milestone 4: Vendor Desk with Anthropic

**Objective:** Publish supplier-packet assistance using the direct Anthropic SDK.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_anthropic_01` common source-bearing files, supplier packets and intake rules, skill-created agent/context state for `anthropic`, and its index entry.

**Implementation:** Develop a missing-evidence case, adopt through the skill, request assistant follow-up drafting, and introduce a realistic later intake clarification or exception. Preserve staff approval and record the actual interaction before publication.

**Verification:** Apply common checks against the selected SDK and adapter. Trace the supplier case, later change, exact implementation binding, and instructions.

**Acceptance criteria:** A published, typechecked, valid Anthropic fixture demonstrates both agent creation and later maintenance; supplier approval remains with procurement staff.

**Review checkpoint:** Inspect the distinction between identifying missing evidence, drafting a response, and approving a supplier.

## Milestone 5: Catalog Studio with Google Gen AI

**Objective:** Publish catalog-grounded product-copy assistance.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_google_genai_01` common source-bearing files, catalog facts and drafting source, skill-maintained `google-genai` agent/context state, and its index entry.

**Implementation:** Build a product-copy case, initialize with the selected skill, request drafting and unsupported-claim handling, then introduce a natural catalog or policy refinement. Publish the observed outcome.

**Verification:** Apply common checks and trace the named product's facts through source and instructions before and after the refinement.

**Acceptance criteria:** A published, typechecked, valid Google Gen AI fixture represents unsupported-claim handling and leaves publication approval to staff.

**Review checkpoint:** Inspect whether every claimed product fact and later correction is supported by the mock catalog and policy.

## Milestone 6: Parcel Desk with direct OpenAI

**Objective:** Publish delivery-exception assistance grounded in tracking facts.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_openai_01` common source-bearing files, tracking records and delivery-policy source, skill-maintained `openai` agent/context state, and its index entry.

**Implementation:** Build a delayed-delivery case, adopt with the skill, request an explanation assistant, and follow up with a realistic tracking gap or uncertainty requirement. Let skill maintenance follow the observed development and publish the result.

**Verification:** Apply common checks against the exact SDK and adapter. Trace the initial and refined request, policy, runtime binding, and human authority boundary.

**Acceptance criteria:** A published, typechecked, valid direct OpenAI fixture explains available facts without granting refunds or changing carrier requests. Its successful commit can parent Milestone 16.

**Review checkpoint:** Inspect uncertain-delivery guidance and the exact implementation binding that the later negative fixture will mutate.

## Milestone 7: Case Router with LangChain

**Objective:** Publish customer-request classification and queue recommendations.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_langchain_01` common source-bearing files, customer messages and routing rules, skill-maintained `langchain` agent/context state, and its index entry.

**Implementation:** Develop a routing case, adopt through the skill, request classification assistance, and refine a category or escalation rule through ordinary follow-up. Publish the reviewed attempt.

**Verification:** Apply common checks and trace a named message through categories, source, instructions, and later refinement.

**Acceptance criteria:** A published, typechecked, valid LangChain fixture recommends queues while billing disputes and deletion decisions remain with staff.

**Review checkpoint:** Inspect classification responsibilities and ensure routing suggestions do not imply account mutations.

## Milestone 8: Mesa Help with both Cloudflare forms

**Objective:** Publish one support product using both qualified Cloudflare target forms.

**Dependencies:** Startup prerequisites from Milestone 1; other adapter successes are not required.

**Owned scope:** `fixture_cloudflare_agents_01` common source-bearing files, customer support records and chat/routing source, skill-maintained `cloudflare-agents` state for both forms, and its index entry.

**Implementation:** Establish a product need for conversational support and structured staff-routing reasoning. Adopt, request the capabilities, and evolve one support rule through sequential interaction. Let the current skill and APIs determine the layout, then publish the result.

**Verification:** Apply common checks and require source-observable evidence for both target forms. Trace the support case and later refinement through their distinct responsibilities.

**Acceptance criteria:** Both forms serve the same believable support workflow in a published, typechecked, valid fixture with no account mutations.

**Review checkpoint:** Inspect why both forms exist and whether their declared relationships match source.

## Milestone 9: Incident Desk with both LangGraph forms

**Objective:** Publish an incident workflow using Graph and Functional API targets.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_langgraph_01` common source-bearing files, alert records and classification/brief source, skill-maintained `langgraph` state for both forms, and its index entry.

**Implementation:** Build an engineer's alert case, initialize through the skill, request useful classification and briefing capabilities, and introduce a severity or briefing refinement. Preserve the actual development sequence and publish it.

**Verification:** Apply common checks for both forms and relevant SDK peers. Trace the case, shared incident facts, bindings, and later change.

**Acceptance criteria:** Both forms participate in one published, typechecked, valid incident workflow without automated paging or production action.

**Review checkpoint:** Inspect the two bindings separately and verify that their duties explain the chosen split.

## Milestone 10: Store Guide with both Vercel AI SDK forms

**Objective:** Publish catalog guidance using tool-loop and direct-generation targets.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_vercel_ai_sdk_01` common source-bearing files, product records and lookup/comparison source, skill-maintained `vercel-ai-sdk` state for both forms, and its index entry.

**Implementation:** Start with a shopper's catalog question, adopt through the skill, request lookup-assisted guidance and comparison output, then refine a catalog or availability requirement. Publish the observed result.

**Verification:** Apply common checks for both target forms and trace the initial and later requests to actual catalog facts and canonical guidance.

**Acceptance criteria:** A published, typechecked, valid fixture uses both forms coherently and cannot change carts or place orders.

**Review checkpoint:** Inspect tool-loop responsibilities, direct generation, and the factual basis for product comparisons.

## Milestone 11: Release Desk with Claude Agent SDK

**Objective:** Publish release-note drafting with a meaningful change-review subagent.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_claude_agent_sdk_01` common source-bearing files, mock changes and release source, skill-maintained root/reviewer state and optional handoff description, and its index entry.

**Implementation:** Build the release manager's draft workflow, adopt, request reviewer delegation for ambiguous changes, and refine a change-classification requirement through the skill. Publish the attempt.

**Verification:** Apply common checks and confirm an actual programmatic subagent relationship. Trace an ambiguous change and refinement through source and instructions.

**Acceptance criteria:** A published, typechecked, valid Claude Agent SDK fixture gives the reviewer a distinct role and retains release publication with the manager.

**Review checkpoint:** Inspect delegation evidence and target guidance; agent names alone do not establish the relationship.

## Milestone 12: Trip Care with OpenAI Agents SDK

**Objective:** Publish itinerary-change assistance with a fare-rule specialist handoff.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_openai_agents_sdk_01` common source-bearing files, itinerary/fare records and source, skill-maintained coordinator/specialist state and optional handoff guidance, and its index entry.

**Implementation:** Develop a travel representative's change request, adopt, request specialist interpretation, and refine a fare-policy requirement through natural follow-up. Publish the reviewed result.

**Verification:** Apply common checks, confirm source-observable handoff wiring, and trace both the initial case and refinement through fare facts and instructions.

**Acceptance criteria:** A published, typechecked, valid OpenAI Agents SDK fixture includes meaningful specialist delegation while staff retain booking and cancellation decisions.

**Review checkpoint:** Inspect the routing purpose, handoff target guidance, and human decision boundary.

## Milestone 13: Field Notes with Eve

**Objective:** Publish operational-note assistance with an Eve subagent and local tool.

**Dependencies:** Startup prerequisites from Milestone 1.

**Owned scope:** `fixture_eve_01` common source-bearing files, operational notes, Eve root/subagent/tool source, skill-maintained canonical relationships, and its index entry.

**Implementation:** Build an on-call symptom and note collection, adopt, request knowledge lookup assistance, then refine a note or lookup requirement through ordinary interaction. Publish the observed attempt.

**Verification:** Apply common checks and inspect root/subagent/tool wiring. Trace the symptom and refinement to the local notes and relevant guidance.

**Acceptance criteria:** A published, typechecked, valid Eve fixture has justified delegation and a grounded local tool; it never operates production infrastructure.

**Review checkpoint:** Inspect which work is deterministic lookup and which requires the knowledge agent's reasoning.

## Milestone 14: Harbor Supply complex custom system

**Objective:** Publish a complex dealer-support project with several justified reasoning roles.

**Dependencies:** Startup prerequisites from Milestone 1. Earlier simple-project experience is useful; success of all adapters is not required.

**Owned scope:** `fixture_custom_complex_01` common source-bearing files, product/order/warranty/delivery records and source, skill-maintained custom runtime guidance, agents, shared and focused context, supported capabilities and relationships, and its index entry.

**Implementation:** Build a dealer case and domain records, initialize, then invoke the skill's read-only agent-system planning workflow. Develop justified specialist capabilities, answer actual product questions, and follow with a meaningful business-rule refinement. Keep deterministic lookups in ordinary software and final commitments with staff. Publish the reviewed result.

**Verification:** Apply common checks for `custom`. Trace the complete dealer case and later refinement across specialists, context, tools, variables, and declared bindings or `affectedBy` paths where present.

**Acceptance criteria:** A published, typechecked, valid complex fixture has several distinct model-reasoning responsibilities without an arbitrary agent quota. Source, canonical state, and the product story agree.

**Review checkpoint:** Inspect the skill's planning rationale, role boundaries, maintenance behavior, and preservation of staff authority.

## Milestone 15: Partial-adoption fixture

**Objective:** Publish the controlled incomplete-adoption state.

**Dependencies:** A verified successful Cedar Workshop attempt from Milestone 2. No other project dependency; deriving the negative fixture does not require waiting for its parent's publication.

**Owned scope:** `fixture_partial_01` derived from that exact parent commit, deletion of `moldea/project.md`, its README defect/attempt note, and its index entry. Retain inherited releases and other project content.

**Implementation:** Confirm the parent's valid baseline, record its SHA, create the numbered branch, and remove only the designated canonical file. Record and publish the result without asking the skill to repair the deliberate fault.

**Verification:** Run the relevant launcher validation and require the expected partial-adoption diagnostic without an independent error. Inspect the exact parent-to-negative diff, signed commit, and remote ref. Reuse unchanged parent evidence for other checks.

**Acceptance criteria:** The published branch is indexed as `intentional_invalid`, has only the planned canonical defect, and retains a valid unchanged parent.

**Review checkpoint:** Inspect the missing-foundation diagnostic against the actual mutation.

## Milestone 16: Invalid implementation binding

**Objective:** Publish an adopted project with one deliberately broken source relationship.

**Dependencies:** A verified successful Parcel Desk attempt from Milestone 6. Milestone 15 need not be complete; deriving the negative fixture does not require waiting for its parent's publication.

**Owned scope:** `fixture_invalid_binding_01` derived from that exact parent commit, one manifest implementation binding changed to a nonexistent source path, its README defect/attempt note, and its index entry. Retain inherited releases and source.

**Implementation:** Confirm the valid parent, record its SHA, create the numbered branch, and make the single binding mutation. Record and publish the result without skill repair of the deliberate fault.

**Verification:** Run the relevant launcher validation and require the intended binding diagnostic without an independent defect. Inspect the exact diff, signed commit, and remote ref; reuse unchanged parent source/typecheck evidence.

**Acceptance criteria:** The published branch is indexed as `intentional_invalid`, contains only the planned canonical fault, and preserves the valid parent.

**Review checkpoint:** Inspect the failed relationship and confirm the diagnostic is caused by the changed path.

## Milestone 17: Final fixture inventory

**Objective:** Review the published collection and make its usable coverage explicit.

**Dependencies:** Concluded attempt records are available. Full completion requires Milestones 1–16 to satisfy their acceptance criteria; missing projects may be reported without claiming completion.

**Owned scope:** Final reconciliation of `main`'s README index, successful-attempt selections, outcomes, releases, and reviewed commit references. This milestone does not rebuild projects, upgrade releases, or modify concluded attempt branches.

**Implementation:** Compare the scenario list with recorded attempts and published refs. Confirm one successful skill-only attempt, all thirteen successful valid-project scenarios, and both verified intentional-invalid scenarios, while retaining failed attempts as evidence. Correct index discrepancies supported by the actual records and publish the main update. Assign missing project work back to its owning milestone for separate authorization.

**Verification:** Match remote tips to reviewed commits and check that recorded skill-use, checkpoint, dependency, and validation evidence applies to those commits. Verify task commit signatures and main's continued lack of adoption. Reuse applicable completed checks; do not rerun a whole matrix or refresh packages merely because a newer release exists. Report evidence gaps explicitly.

**Acceptance criteria:** The complete required coverage is published, the index identifies usable successful attempts and preserved failures accurately, and all recorded remote refs match reviewed states. Different skill versions across branches are acceptable. Any missing required scenario leaves the overall deliverable incomplete.

**Review checkpoint:** Inspect the complete coverage table, version diversity, retry lineage, unresolved limitations, and the limits of what was actually tested.

## Approval required

Approval is requested for this complete seventeen-milestone sequence: startup and skill-only installation, thirteen valid projects, two independent negative fixtures, and final inventory review. Because the current plan has not yet been approved, approval of this sequence also approves that plan unless you limit it. Approval does not authorize implementation; each milestone needs explicit authorization identifying it. After approval, planning is complete and I will signal that you can switch models manually. When the upgrade is published, confirm that fact and authorize Milestone 1 to begin. Later independent milestones can be selected according to their stated prerequisites.
