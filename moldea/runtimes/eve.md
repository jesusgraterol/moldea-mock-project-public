# Quarry Handover's Eve connection

Runtime ID: `eve`, selected because installed `eve@0.82.0` defines and discovers the root assistant. The `ai` package is its model transport, not a second agent runtime.

## Instruction and capability consumption

- `agent/agent.ts` default-exports `rootAssistant`, with optional default tools and root-copy delegation disabled. There are no subagents, schedules, memory providers, external messaging channels or operational tools.
- `agent/instructions.ts` imports `/moldea/agents/quarry-handover/instruction.md` through Eve's documented `?raw` asset loader, returns it from `loadHandoverInstructions`, and supplies it as `defineInstructions({ content })`. Eve compiles the complete system-role text into its manifest; there is no textual mirror.
- The canonical agent description is human-facing metadata; the root has no parent routing consumer and needs no handoff description.
- Eve discovers `agent/tools/lookup_records.ts` as `lookup_records`. The tool's `description` is model-facing capability guidance. `LookupInputSchema` validates the model's selected IDs and supplied reference time. `LookupResultSchema` describes its result; there is no root-agent structured-output schema.
- `src/records.ts` reads the imported fictional JSON dataset and calculates elapsed age and review eligibility without any clock access. Unknown times and future reports keep null age; unresolved unknown-age reports keep null eligibility. Resolved reports do not become unresolved age-based review items. Different unresolved same-scope claims are all retained for supervisor reconciliation.
- Eve discovers `agent/skills/handover.md` as `handover`. Its frontmatter description is routing-facing catalog metadata; the body reaches the model only after `eve__skill({ name: 'handover' })`. It loads instructions, not a new executable action.

## Deterministic model boundary and real runtime checks

`evals/fixture-model.ts` uses the installed `eve/evals` `mockModel` contract and is selected by the one root definition. It is deliberately a scripted local fixture, not a live model or evidence of live-provider instruction following. Its callback inspects the real system instruction, selected procedure text in a tool-result message, available tools and schema, and the real lookup result before rendering a draft. It neither replaces the lookup nor injects a procedure into the prompt.

`evals/evals.config.ts` and `.eval.ts` files use actual HTTP sessions and deterministic assertions. They have no tool stubs, judge calls or reporters. Connection checks cover complete canonical instruction consumption, lazy procedure loading, tool inputs/results, threshold boundaries, unknown timestamps, conflicting claims, missing IDs, source-resolved reports and prohibited operations.

`scripts/test-runtime.ts` checks installed CLI help, runs real discovery and build, retains an owned `eve start` child bound to `127.0.0.1`, and targets it with installed `eve eval --strict --url`. `agent/channels/eve.ts` explicitly permits anonymous local fixture protocol access. Process-tree shutdown occurs in `finally`; the script checks the owned PID is gone, its port can be rebound, and the source records are unchanged. No external channel or cloud deployment is configured. Linux execution is verified; other host platforms are not claimed as tested.
