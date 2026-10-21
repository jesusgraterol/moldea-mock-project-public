# Aster Dispatch

## Purpose and users

Aster Dispatch serves a small events team reviewing equipment requests. The intended assistant looks up fictional inventory records and drafts an evidence-backed handoff for staff.

## Goals and authority

- Help staff assess equipment requests using only the supplied inventory evidence.
- Separate recommendations, supporting record identifiers, missing facts, and required staff approval in each handoff.
- Keep dispatch authority with staff: every dispatch requires their approval.
- Keep inventory access read-only. The assistant must not reserve equipment, change inventory, or promise that an item is safe.

## Authoritative project sources

- [Product rules and local development conventions](../README.md): owns the inclusive 24-hour urgency rule, supplied UTC timestamp handling, unknown-stock treatment, selected runtime and exact dependency versions, and verification expectations.
- [Fictional inventory records](../data/inventory.json): supplied item identifiers, availability, quantities, and observations; not a live equipment system.
- [Example equipment requests](../data/requests.json): supplied item references, quantities, reference timestamps, and needed-by timestamps.
