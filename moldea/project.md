# Cinder Returns

Cinder Returns is a small staff-facing tool intended to use one Vercel AI SDK assistant and one read-only lookup of fictional local order records to draft structured return recommendations.

Recommendations are advisory: staff approve every decision. The assistant must not issue refunds, create returns, or change orders. No UI, database, second assistant, or operational integration is in scope.

## Project sources

- [Project brief and return policy](../README.md): authoritative scope and operating rules, including the inclusive 30-elapsed-day window, supplied UTC timestamps, unknown delivery facts, lookup failures, and separation of recommendations, supporting identifiers, missing facts, and staff approval.
- [Fictional order records](../data/orders.json): read-only lookup data, including a record without delivery facts.
- [Sample request inputs](../data/requests.json): fictional order identifiers and supplied UTC request timestamps.
- [Package manifest](../package.json): Node.js and exact dependency versions; the README establishes npm as the package manager.
