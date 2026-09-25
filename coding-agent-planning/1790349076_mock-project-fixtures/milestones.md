# Mock project fixture milestones

These milestones implement the current `plan.md` in this directory. Begin fixture work only after the developer confirms the pending skill and adapter upgrade is complete, and verify the published release and adapter coverage before installation. Each branch is a complete local fixture at its checkpoint; Milestone 16 publishes the corpus. Source filenames, agent IDs, context topics, and bindings are chosen through the developer workflow and repository-installed skill, so they are intentionally not predetermined here. For every valid branch, verify that the coding host selected that branch's installed skill path and version before skill-dependent work. If selection cannot be verified, re-enter the branch in a compatible session or host and stop that milestone if it still fails. No milestone performs Cloud connection, Assurance testing, provider calls, or application tests.

## Milestone 1: Uninitialized index and shared skill

**Objective:** Establish `main` as the uninitialized fixture index and `fixture_skill_only` as the common, unadopted skill ancestor.

**Dependencies:** Approval of the current plan and milestone sequence; developer confirmation that the pending skill and adapter upgrade is complete; publication of that release and access to its qualification profiles. No earlier milestone.

**Owned scope:** `main`'s `README.md` only; the installer-created repository-local skill files on `fixture_skill_only`. No `/moldea/**`, package manifest, CLI dependency, or managed README block on either branch.

**Implementation:** After the upgrade confirmation, inspect the latest published skill tag, adapter qualification inventory, target forms, and compatible CLI range. Stop for a plan revision if the release is unavailable or materially changes the planned coverage. Document branch purposes and the ordinary Git skill-refresh procedure on `main`. Create `fixture_skill_only` from it, install the verified tag with the documented repository-scoped installer, inspect every generated path and the installed `SKILL.md`, and commit the two branch states cohesively with `-s -S`. Do not stage the planning directory or protected `AGENTS.md`.

**Verification:** Record the upgrade confirmation, published tag, adapter inventory and target forms, and CLI compatibility result. Confirm both branches lack adoption, identify the installed skill path/version, and confirm the coding host discovers that repository copy. Review complete diffs, generated paths, `git diff --check`, status, and signed commits. No source typecheck or skill validation applies.

**Acceptance criteria:** Both local branch states exist; `main` remains uninitialized; `fixture_skill_only` contains the current selectable skill and nothing that adopts a project.

**Review checkpoint:** Inspect the installation footprint and refresh path before authorizing any project branch.

## Milestone 2: Cedar Workshop minimum adoption

**Objective:** Create a valid initialized project with no source, extra context, or agents.

**Dependencies:** Milestone 1 complete; branch from `fixture_skill_only`.

**Owned scope:** `fixture_initialized` README, repository-local CLI `package.json` and `package-lock.json`, skill-managed README block, `moldea/moldea.yaml`, and `moldea/project.md`.

**Implementation:** Treat the booking/waitlist brief as the developer's first request, invoke the host-selected installed skill to initialize, and stop at the foundation. Review the skill output and commit with `-s -S`; add no ceremonial source or agent.

**Verification:** Record selected skill path/version and initialization result. Run the plan's launcher `composition`, `validate`, and `inspect` checks; require zero agents. Check README, foundation, complete diff, `git diff --check`, status, and signature. No TypeScript or application tests apply.

**Acceptance criteria:** The local branch is adopted and valid with exactly the minimum foundation and zero agents; the waitlist boundary is clear from project context.

**Review checkpoint:** Inspect whether the skill grounded initialization in the developer brief without inventing source or agent behavior.

## Milestone 3: Trail Ledger context without agents

**Objective:** Create a source-backed rental project whose durable context evolves with an ordinary repair or reservation change.

**Dependencies:** Milestone 1 complete and Milestone 2 reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_context_only` README, exact-pinned package and lock files, `tsconfig.json`, focused rental/stock/repair TypeScript source, foundation, and skill-maintained context with source-backed `affectedBy` relationships. No agent or runtime registration.

**Implementation:** Build a small rental slice and a mock request grounded in stock and repair records; initialize through the selected skill; request focused project context. Commit the reviewed baseline with `-s -S`. Make one ordinary repair or reservation refinement, let the skill maintain affected context, and sign the refinement commit.

**Verification:** Record selected skill path/version and adoption/maintenance operations. Run local `tsc --noEmit` plus launcher `composition`, `validate`, and `inspect`; require zero agents. Trace the request and refinement through source and context, inspect exact `affectedBy` paths, complete diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** The local branch validates, typechecks, has meaningful source-backed context and zero agents, and shows a genuine before/after skill maintenance step.

**Review checkpoint:** Compare the initial and refined context against the rental rules and confirm no agent was introduced to implement deterministic logic.

## Milestone 4: Vendor Desk with Anthropic

**Objective:** Build a supplier-intake assistant using the direct Anthropic SDK.

**Dependencies:** Milestone 1 complete and zero-agent fixtures reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_anthropic` README, exact-pinned package and lock files, `tsconfig.json`, supplier-intake source and mock records, foundation, and skill-created agent/context files and relationships.

**Implementation:** Develop the missing-evidence workflow, initialize through the selected skill, then request a source-grounded assistant while procurement retains approval. Commit the reviewed adopted feature; add one realistic intake-rule refinement and let the skill maintain its canonical state; sign both commits with `-s -S`.

**Verification:** Confirm selected skill path/version, current SDK API, source typecheck, and launcher `composition`, `validate`, and `inspect` evidence for the `anthropic` adapter. Trace a supplier packet and later rule change through source and instructions; review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** A valid, typechecked local branch with one meaningful Anthropic-backed agent and a traceable developer progression.

**Review checkpoint:** Inspect the exact runtime binding and the line between assistant follow-up and staff approval.

## Milestone 5: Catalog Studio with Google Gen AI

**Objective:** Build product-copy review from known catalog facts using Google Gen AI.

**Dependencies:** Milestone 1 complete; prior single-target adapter checkpoint reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_google_genai` README, exact-pinned package and lock files, `tsconfig.json`, catalog source and facts, foundation, and skill-created agent/context files and relationships.

**Implementation:** Create a small catalog slice, initialize with the selected skill, then request drafting and unsupported-claim detection. Commit the adopted feature; refine one catalog rule and let the skill update affected guidance; sign both commits with `-s -S`.

**Verification:** Record skill selection and operations; typecheck against current Google Gen AI types; run launcher `composition`, `validate`, and `inspect` for `google-genai`. Trace one product request and refinement through source and canonical content; review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** The local branch validates and typechecks, flags unsupported claims, and leaves publication to staff.

**Review checkpoint:** Inspect whether the instruction claims only facts the mock catalog supplies.

## Milestone 6: Parcel Desk with direct OpenAI

**Objective:** Build delivery-exception assistance using the direct OpenAI SDK.

**Dependencies:** Milestone 1 complete; earlier single-target adapters reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_openai` README, exact-pinned package and lock files, `tsconfig.json`, delivery/tracking source and mock events, foundation, and skill-created agent/context files and relationships.

**Implementation:** Establish a delayed-delivery case, initialize with the selected skill, then request a grounded explanation assistant. Commit the adopted feature; add one delivery-policy or tracking-state refinement and let the skill maintain affected canonical state; sign both commits with `-s -S`.

**Verification:** Record skill selection and operations; typecheck against current OpenAI APIs; run launcher `composition`, `validate`, and `inspect` for `openai`. Trace initial and refined cases, inspect source-observable binding, diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** The local branch validates and typechecks; it explains tracking facts without granting refunds or changing a carrier request.

**Review checkpoint:** Inspect the exact implementation relationship; this branch later becomes the valid parent of `fixture_invalid_binding`.

## Milestone 7: Case Router with LangChain

**Objective:** Build customer-request classification and staff routing with LangChain.

**Dependencies:** Milestone 1 complete; single-target adapter approach reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_langchain` README, exact-pinned package and lock files, `tsconfig.json`, case-category source and mock messages, foundation, and skill-created agent/context files and relationships.

**Implementation:** Build a small routing flow, initialize through the selected skill, request a classification agent, and commit the adopted feature. Add a modest category or escalation refinement, use skill maintenance, and sign the refinement commit with `-s -S`.

**Verification:** Confirm selected skill and actual operations; typecheck against the latest LangChain packages; run launcher `composition`, `validate`, and `inspect` for `langchain`. Trace a message and refinement through routing rules and canonical state; review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** The local branch validates and typechecks, with billing and deletion decisions remaining with staff.

**Review checkpoint:** Inspect category ownership and ensure the assistant recommends a queue without mutating an account.

## Milestone 8: Mesa Help with two Cloudflare targets

**Objective:** Build one edge-support product with conversational and structured-reasoning target forms.

**Dependencies:** Milestone 1 complete; single-target patterns reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_cloudflare_agents` README, exact-pinned package and lock files, `tsconfig.json`, support source and mock cases, foundation, and skill-created agent/context files and relationships for both qualified Cloudflare forms.

**Implementation:** Build a credible chat and case-routing need, initialize through the selected skill, then request the relevant capabilities. Let current Cloudflare APIs and the skill determine source and agent layout. Commit the adopted feature; refine a support-routing rule through skill maintenance; sign both commits with `-s -S`.

**Verification:** Record skill selection and operations; typecheck current Cloudflare APIs; run launcher `composition`, `validate`, and `inspect` and require evidence for both target forms. Trace a chat case and staff-routing refinement; review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** Both targets serve the same understandable support workflow; the local branch validates and typechecks without account-changing behavior.

**Review checkpoint:** Inspect why each target form exists and whether the skill registered only source-observable relationships.

## Milestone 9: Incident Desk with two LangGraph forms

**Objective:** Build severity classification and a draft incident brief using Graph and Functional API targets.

**Dependencies:** Milestone 1 complete; multiple-target checkpoint reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_langgraph` README, exact-pinned package and lock files, `tsconfig.json`, alert/incident source and mock records, foundation, and skill-created agent/context files and relationships for both qualified LangGraph forms.

**Implementation:** Build the engineer's alert flow, initialize through the selected skill, request the two useful reasoning stages, and commit the adopted feature. Refine one severity or incident-brief rule and let skill maintenance update the affected canonical state; sign both commits with `-s -S`.

**Verification:** Record skill selection and operations; typecheck against current LangGraph and peer APIs; run launcher `composition`, `validate`, and `inspect` for both target forms. Trace an alert and refinement through source and instructions; review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** Both targets participate in one coherent workflow; the local branch validates and typechecks; no production paging or action is implied.

**Review checkpoint:** Inspect Graph and Functional bindings separately and their shared incident facts.

## Milestone 10: Store Guide with two Vercel AI SDK forms

**Objective:** Build catalog lookup and comparison using both qualified Vercel AI SDK forms.

**Dependencies:** Milestone 1 complete; multiple-target patterns reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_vercel_ai_sdk` README, exact-pinned package and lock files, `tsconfig.json`, catalog and guidance source with mock products, foundation, and skill-created agent/context files and relationships for both qualified Vercel forms.

**Implementation:** Establish a shopper question grounded in local products, initialize through the selected skill, then request tool-assisted guidance and a direct comparison output. Commit the adopted feature; add a catalog or availability refinement with skill maintenance; sign both commits with `-s -S`.

**Verification:** Record skill selection and operations; typecheck current Vercel AI SDK APIs; run launcher `composition`, `validate`, and `inspect` for both forms. Trace the question and refinement to catalog facts and canonical guidance; review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** Both forms serve one plausible store workflow; the local branch validates and typechecks without cart or purchase side effects.

**Review checkpoint:** Inspect tool use versus direct generation and confirm the comparison does not invent product facts.

## Milestone 11: Release Desk with Claude Agent SDK delegation

**Objective:** Build release-note drafting with a genuine change-review subagent.

**Dependencies:** Milestone 1 complete; multi-agent adapter evidence from earlier fixtures reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_claude_agent_sdk` README, exact-pinned package and lock files, `tsconfig.json`, release/change source and mock entries, foundation, and skill-created root/reviewer agent files, context, and optional target-owned handoff description.

**Implementation:** Build a release manager's draft workflow, initialize through the selected skill, request reviewer delegation where ambiguity warrants it, and commit the adopted feature. Add a change-classification refinement; let the skill maintain source and canonical relationships; sign both commits with `-s -S`.

**Verification:** Record skill selection and operations; typecheck current Claude Agent SDK APIs; run launcher `composition`, `validate`, and `inspect`. Confirm a source-observable programmatic subagent relationship and trace one ambiguous change plus refinement; review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** The local branch validates and typechecks; reviewer duties are distinct; publication remains a release-manager action.

**Review checkpoint:** Inspect the runtime-native delegation and target guidance rather than inferring it from agent names.

## Milestone 12: Trip Care with OpenAI Agents SDK handoff

**Objective:** Build itinerary-change advice with a real fare-rule specialist handoff.

**Dependencies:** Milestone 1 complete; delegation checkpoint reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_openai_agents_sdk` README, exact-pinned package and lock files, `tsconfig.json`, travel/fare source and mock itinerary, foundation, and skill-created coordinator/specialist files, context, and target-owned handoff guidance when useful.

**Implementation:** Build a travel representative's change request, initialize through the selected skill, request specialist interpretation, and commit the adopted feature. Add a fare-rule refinement and let skill maintenance follow the source change; sign both commits with `-s -S`.

**Verification:** Record skill selection and operations; typecheck current OpenAI Agents SDK APIs; run launcher `composition`, `validate`, and `inspect`. Confirm a source-observable runtime handoff and trace both requests to fare facts and canonical instructions; review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** The local branch validates and typechecks; the specialist has a meaningful routing purpose; no agent books or cancels travel.

**Review checkpoint:** Inspect the handoff target's effective description and the human booking boundary.

## Milestone 13: Field Notes with Eve subagent and tool

**Objective:** Build operational-note lookup with an Eve root agent, knowledge subagent, and grounded local tool.

**Dependencies:** Milestone 1 complete; delegation patterns reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_eve` README, exact-pinned package and lock files, `tsconfig.json`, operational notes and Eve agent/tool source, foundation, and skill-created agent/context files and relationships.

**Implementation:** Build a plausible on-call symptom and local note collection, initialize through the selected skill, request knowledge lookup delegation, and commit the adopted feature. Refine one operational note or lookup condition, use skill maintenance, and sign the refinement commit with `-s -S`.

**Verification:** Record skill selection and operations; typecheck current Eve APIs; run launcher `composition`, `validate`, and `inspect`. Inspect the root/subagent/tool source relationship and trace the symptom and refinement to local notes; review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** The local branch validates and typechecks; the tool is grounded in local notes and no production operation is executed.

**Review checkpoint:** Inspect whether the knowledge role and tool add real value over deterministic lookup alone.

## Milestone 14: Harbor Supply complex custom system

**Objective:** Build the rich dealer-support fixture with several evidence-justified model roles and one later business-rule change.

**Dependencies:** Milestone 1 complete; simple, multiple-target, and delegation fixtures reviewed; branch from `fixture_skill_only`.

**Owned scope:** `fixture_custom_complex` README, exact-pinned package and lock files, `tsconfig.json`, focused product/order/warranty/delivery source and mock records, foundation, and skill-maintained custom runtime guidance, context, agent instructions, capabilities, and relationships justified by actual source. The skill's plan determines exact agent paths and count.

**Implementation:** Build a dealer case and domain records, initialize through the selected skill, then invoke its read-only agent-system planning workflow. Implement justified specialist reasoning while keeping lookups deterministic and final commitments with staff. Use the skill to create canonical state, commit the adopted feature, then refine one business rule and let the skill maintain affected relationships; sign both commits with `-s -S`.

**Verification:** Record selected skill path/version and planning, creation, and maintenance operations. Typecheck source; run launcher `composition`, `validate`, and `inspect` for `custom`. Trace the case and refinement through records, specialists, and staff decision; inspect every binding, capability, variable, and `affectedBy` path against source. Review diffs, `git diff --check`, status, and signatures.

**Acceptance criteria:** The local branch is valid and typechecked; several model roles have distinct evidence-backed duties; the README, source, and canonical state agree before and after refinement.

**Review checkpoint:** Inspect the complete dealer case, agent boundaries, and human authority; reject complexity introduced only to raise agent count.

## Milestone 15: Two controlled invalid fixtures

**Objective:** Produce the partial-adoption and broken-binding states from verified valid parents.

**Dependencies:** Milestone 2 and Milestone 6 complete and reviewed.

**Owned scope:** `fixture_partial` derived from `fixture_initialized`, deleting only `moldea/project.md` and adding a concise README defect note; `fixture_invalid_binding` derived from `fixture_openai`, changing one exact manifest binding to a nonexistent path and adding its README defect note. Preserve all inherited skill and project content otherwise.

**Implementation:** Reconfirm both parent diagnostics are clean, derive the branches, apply one intentional fault per branch, inspect the exact diff, and sign cohesive commits with `-s -S`. Do not use the skill to repair the intentional faults.

**Verification:** Run the plan's launcher validation on each negative branch and require the named failure with no independent defect. Compare each to its valid parent, review `git diff --check`, status, signed commits, and expected README explanation. No source typecheck or application test adds value beyond the inherited parent verification.

**Acceptance criteria:** Both local invalid branches exist, each has only its designated mutation, and each produces the intended diagnostic while its parent remains valid.

**Review checkpoint:** Inspect the parent-to-negative diff and diagnostic pair before authorizing publication.

## Milestone 16: Current release snapshot and private publication

**Objective:** Publish every planned branch as one documented, current fixture corpus.

**Dependencies:** Milestones 1–15 complete and reviewed; private `origin` and required cryptographic signing available.

**Owned scope:** The final UTC cutoff and version record in `main`'s `README.md`; any required latest-release refresh to `fixture_skill_only` and affected fixture branches under the approved plan; Git publication of `main`, `fixture_skill_only`, all thirteen valid projects, and both invalid projects. No Cloud or PR work.

**Implementation:** Immediately before the first push, recheck the latest stable skill tag and every directly pinned npm package. If a release advanced, refresh the common skill branch and affected exact pins/locks, confirm the coding host selects the refreshed branch copy before further skill work, and rerun affected source typechecks, skill validation, adapter inspections, and negative diagnostics. Stop for a plan decision if the new release is incompatible. Record the UTC cutoff and actual skill version on `main`; inspect complete branch histories and final state; make any required cohesive signed commits. Push each active branch `HEAD` to only its explicit private `origin` branch ref without force or tag following.

**Verification:** Confirm every valid branch still passes its relevant launcher checks and source typecheck, both negative branches still fail as designed, and `main`/`fixture_skill_only` remain unadopted. Inspect all intended tracked and untracked paths while respecting excluded archive/backup content; ensure the planning directory and protected instructions are absent from commits. Verify required sign-off and cryptographic signatures, clean intended branch states, and each remote ref against its local `HEAD` with `git ls-remote`. Record actual skill selections, operations, versions, checks, and results; make no claim about provider execution, Cloud connection, Assurance, or resolution prompts.

**Acceptance criteria:** The complete branch inventory is present on private `origin`; all valid states are current as of the recorded cutoff and verified; both invalid states retain only their expected defect; remote refs equal reviewed local commits; excluded files were not published.

**Review checkpoint:** Inspect the final branch inventory, version snapshot, key skill-use evidence, negative diagnostics, signed commits, and remote-ref identities. This concludes the fixture deliverable.

## Approval required

Approval is requested for this complete sixteen-milestone sequence. Because the current plan has not yet been approved, approval of this sequence also approves that plan unless you limit it. Approval does not start implementation: after confirming the skill and adapter upgrade is complete, identify the specific milestone to implement, beginning with Milestone 1. After approval, planning is complete and I will tell you it is ready for your manual switch to the cheaper model before implementation starts.
