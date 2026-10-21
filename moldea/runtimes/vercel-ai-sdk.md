# Cinder Returns AI SDK connection

`src/return-assistant.ts` constructs a request-scoped `ToolLoopAgent` from the installed `ai` package. `loadReturnInstruction` reads the canonical returns-assistant instruction directly into the SDK's general/system `instructions` field. No routing-facing description or handoff is consumed.

One locally executed `lookup_order` tool calls the read-only file lookup and deterministic assessment. The supplied request fixes the allowed identifier. The first step requires that tool; the second disables tools. Agents are single-use, bounded to two steps, with model retries disabled. The preferred draft entry point sets a 30-second abort deadline.

`Output.object` uses `StaffRecommendationSchema` plus a request-local refinement that rejects output unless all factual fields and approval state exactly match the executed lookup result. Only the explanatory rationale is model-authored. Malformed, ungrounded, or contradictory output fails rather than becoming a recommendation.

The host supplies a `LanguageModel` supporting tool calling and structured JSON output; no provider or credentials are configured here. Focused tests use `MockLanguageModelV4` only at that external boundary and execute the real loader, lookup, loop, and output parser. They do not establish live-provider behavior.
