# Quarry Handover

Quarry Handover serves facilities shift staff and supervisors by drafting handover briefs from fictional local shift records. Its goal is to make observations, unresolved reports, missing facts, and supervisor-review items visible without making operational decisions.

## Scope and authority

The system is one filesystem-defined Eve root assistant, one read-only record lookup, and one on-demand handover procedure. It only drafts; supervisors retain decision authority. The [registered assistant](agents/quarry-handover/instruction.md) consumes canonical instructions directly and runs with a deterministic fixture model, without a live provider.

The [project README](../README.md) owns the product policy and setup guidance, including the inclusive 12-hour supervisor-review threshold, supplied timestamp rules, preservation of conflicting claims, and excluded capabilities. Keep those rules there rather than creating a second policy owner.

## Project sources

- [Fictional shift records](../data/records.json): read-only source observations, identifiers, scopes, timestamps, and report status.
- [Sample requests](../data/requests.json): selected record identifiers and supplied reference timestamps.
- [Package manifest](../package.json): exact dependencies and the Node.js requirement; the README selects npm.

## Implementation and verification

The [README usage guide](../README.md#local-use-and-checks) documents the JSON fixture request, npm commands and policy examples. [Eve runtime guidance](runtimes/eve.md) traces instruction consumption, tool and procedure discovery, model-boundary checks, and owned loopback-process cleanup. Evals and configuration remain outside `agent/`.
