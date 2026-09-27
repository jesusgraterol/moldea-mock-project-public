# HS-214 custom runtime

The repository owns a source-only custom invocation. `createDealerReplyAgent` loads the canonical agent instruction through `loadDealerReplyInstruction`, reads the checked-in HS-214 case and HC-240 product sheet, and passes all three texts to an injected draft invoker. The staff CLI binds a deterministic, case-specific preview invoker and prints its dealer draft separately from staff verification notes.

The preview is tied to reviewed source and instruction snapshots. It fails rather than presenting its fixed wording after those inputs change. It is not a model response and does not call a provider, send a message, persist a draft, or make a staff decision. No provider implementation, delivery path, or deployed service is integrated; the agent's unresolved model-execution requirement records that limit.
