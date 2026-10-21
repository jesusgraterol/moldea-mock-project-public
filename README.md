# Cinder Returns

Cinder Returns is a small staff tool for drafting return recommendations from fictional local order records. One real Vercel AI SDK `ToolLoopAgent` uses one read-only order lookup and `Output.object` for structured recommendations. Staff approve every decision; the assistant cannot issue refunds, create returns or change orders.

The return window is 30 elapsed 24-hour days from delivery, inclusive at the exact boundary. Compare supplied UTC delivery and request timestamps rather than the machine clock. Missing delivery facts and unknown identifiers stay unknown. A failed lookup cannot establish eligibility.

Keep recommendations, supporting order identifiers, missing facts and staff approval distinct. No UI, database, second assistant or operational integration is needed.

Use Node24, npm and exact package versions declared in package.json. Order records and sample request inputs are fictional and read-only.

## Setup and checks

```sh
npm ci --ignore-scripts
npm test
npm run typecheck
```

Tests require no provider credentials, environment setup, or live calls. They run the actual agent loop, canonical instruction loader, local file lookup, deterministic assessment, and SDK structured parser. Only the external language model is replaced with `MockLanguageModelV4` from `ai/test`. The test runner is Node's built-in runner; TypeScript runs directly on Node24 and is checked separately with `tsc --noEmit`.

## Usage

The host supplies an AI SDK `LanguageModel` that supports tool calling and structured JSON output. No provider is configured by this project. Import the request entry point from Node24 TypeScript:

```ts
import type { LanguageModel } from 'ai';
import { draftReturnRecommendation } from './src/return-assistant.ts';

export async function draftForStaff(model: LanguageModel) {
  return draftReturnRecommendation(
    { orderId: 'CR-101', requestedAt: '2026-10-31T12:00:00.000Z' },
    { model },
  );
}
```

The result for this exact-boundary request has this shape:

```json
{
  "requestedOrderId": "CR-101",
  "supportingOrder": { "id": "CR-101", "reference": "CINDER-101" },
  "lookupStatus": "found",
  "assessment": {
    "status": "within_window",
    "reason": "assessed",
    "deliveredAt": "2026-10-01T12:00:00.000Z",
    "requestedAt": "2026-10-31T12:00:00.000Z",
    "elapsedMs": 2592000000,
    "windowMs": 2592000000
  },
  "missingFacts": [],
  "recommendation": "recommend_within_window",
  "rationale": "The request is exactly 30 elapsed days after delivery. Staff must review.",
  "staffApproval": { "required": true, "status": "pending" },
  "authority": "recommendation_only"
}
```

Only `rationale` is model-authored; all other fields must exactly match the executed lookup and deterministic assessment or the SDK rejects the output. A window result is not a final eligibility decision. `recommendation` is `recommend_within_window`, `recommend_outside_window`, or `needs_more_information`; staff approval always remains required and pending. There is no approval or operational execution endpoint.

The agent's first step requires `lookup_order` for the supplied `orderId`; its second step disables tools and drafts the result. The lookup reads `data/orders.json` without modifying it. `requestedOrderId` is merely the supplied identifier; only `supportingOrder` contains verified record identifiers. Unknown identifiers produce `not_found` with no supporting order. Read failures, malformed records, and ambiguous duplicate identifiers produce `unavailable`, not proof of nonexistence. Missing or invalid delivery timestamps preserve known identifiers but leave the window assessment unknown. `missingFacts` identifies unavailable order records and/or delivery timestamps.

The elapsed-time calculation uses milliseconds, not calendar dates or rounded days: `0 <= requestedAt - deliveredAt <= 2592000000`. The exact 30-day boundary qualifies for the window; one millisecond over does not. A request before delivery has an unknown assessment with reason `request_before_delivery`. Requests must supply a valid UTC (`Z`) timestamp with seconds and at most millisecond precision; invalid requests fail before any model call. Missing or invalid delivery facts are never replaced with the current time.

The draft entry point creates a fresh agent per request, limits it to two model steps, disables model retries, and applies a 30-second abort deadline. Provider errors, missing tool calls, malformed structured output, contradictory facts, and approval bypasses reject the promise; callers should show a drafting failure for staff handling, not manufacture a decision. For lower-level integration, `createReturnAgent(request, { model })` returns the real, single-use `ToolLoopAgent`; call its `generate` method with the request as the prompt and supply an abort deadline yourself.

Canonical model instructions are loaded directly from `moldea/agents/returns-assistant/instruction.md`. Keep that file and `data/orders.json` alongside the source when running the tool. The optional `ordersFile` setting is a trusted host-selected local fixture path, never a model-controlled path. No UI, database, provider integration, or second assistant is included.

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
