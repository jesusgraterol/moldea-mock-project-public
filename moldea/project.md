# Case Router

Case Router is a source-only prototype for support staff at a small appointment-scheduling company. It recommends which of the account access, billing review, privacy review, or product help queues should review a caller-supplied customer request and explains the evidence from that request.

The recommendation does not route a ticket or decide a billing dispute, refund, or deletion request. Billing staff verify account and ledger facts and decide corrections; staff retain decisions about deletion.

The TypeScript prototype in `/src/case-router/` loads the canonical queue-recommender instruction and invokes a LangChain agent with a caller-supplied request. It selects an OpenAI model, but no provider credentials, live invocation, ticket integration, or deployment have been configured or verified. The recommendation remains advisory and requires staff review.

A later live invocation would send the supplied customer request to the selected model provider. The handling of real customer data requires approval before that integration is used.
