# Cinder Returns

Cinder Returns is a small staff-facing tool for drafting structured return recommendations using one Vercel AI SDK assistant and one read-only lookup of fictional local order records.

Recommendations are advisory: staff approve every decision. The assistant must not issue refunds, create returns, or change orders. No UI, database, second assistant, or operational integration is in scope.

## Project sources

- [Project brief and return policy](../README.md): authoritative scope and operating rules, including the inclusive 21-elapsed-day window, supplied UTC timestamps, unknown delivery facts, lookup failures, and separation of recommendations, supporting identifiers, missing facts, and staff approval.
- [Fictional order records](../data/orders.json): read-only lookup data, including a record without delivery facts.
- [Sample request inputs](../data/requests.json): fictional order identifiers and supplied UTC request timestamps.
- [Package manifest](../package.json): Node.js and exact dependency versions; the README establishes npm as the package manager.

## Assistant

- [Return recommendation assistant](agents/returns-assistant/description.md) and [canonical instructions](agents/returns-assistant/instruction.md): the single recommendation-drafting responsibility and its limits.
- [AI SDK connection](runtimes/vercel-ai-sdk.md): instruction loading, tool registration, deterministic grounding, structured parsing, and the external model boundary.
- [Usage and verification](../README.md#usage): the supported entry point and offline checks.
