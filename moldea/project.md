# Quarry Handover

Quarry Handover serves facilities shift staff and supervisors by drafting handover briefs from fictional local shift records. Its goal is to make observations, unresolved reports, missing facts, and supervisor-review items visible without making operational decisions.

## Scope and authority

The intended system is one filesystem-defined Eve assistant, one read-only record lookup, and one on-demand handover procedure. It only drafts; supervisors retain decision authority. No assistant, tool, procedure, or runtime binding is registered by this foundation.

The [project README](../README.md) owns the product policy and setup guidance, including the inclusive 12-hour supervisor-review threshold, supplied timestamp rules, preservation of conflicting claims, and excluded capabilities. Keep those rules there rather than creating a second policy owner.

## Project sources

- [Fictional shift records](../data/records.json): read-only source observations, identifiers, scopes, timestamps, and report status.
- [Sample requests](../data/requests.json): selected record identifiers and supplied reference timestamps.
- [Package manifest](../package.json): exact dependencies and the Node.js requirement; the README selects npm.

Implementation remains outside this initialization's scope. The proposed assistant and handover flow require a later implementation request.
