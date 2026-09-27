# Vercel AI SDK source integration

`src/store-guide/store-guide.agent.ts` directly defines a Vercel AI SDK `ToolLoopAgent`. Its `instructions` value comes from `moldea/agents/store-guide/instruction.md` through `loadStoreGuideInstruction`; `lookup_bags` is the read-only tool registered from `src/store-guide/catalog.ts`. `src/store-guide/sg-101.ts` shows the intended invocation by reading the shopper note and calling `storeGuideAgent.generate`.

`src/store-guide/comparison-card/comparison-card.ts` is a separate one-shot `generateText` invocation. It reads the same catalog through `lookupBags`, selects Canal 22 and Ridge 26 by SKU, loads `moldea/agents/comparison-card/instruction.md`, and returns the draft alongside both complete selected product records and the catalog notes for staff review. It does not register a model tool or use the Store Guide agent loop.

The tool reads the local Markdown catalog snapshot on each lookup and selects rows with a listed sleeve of at least 16 inches. This small fixture does not justify a cache; reading per invocation keeps catalog edits visible. The source path assumes the files remain in this repository layout and is not a packaged or deployed asset path.

No host calls `runSg101` or `runComparisonCard`, no provider credentials are configured, and neither model path has been exercised live. The source does not establish end-to-end grounding or production readiness.
