# Aster Dispatch

## Purpose and users

Aster Dispatch serves a small events team reviewing equipment requests. Its single assistant looks up fictional inventory records and drafts an evidence-backed handoff for staff.

## Goals and authority

- Help staff assess equipment requests using only the supplied inventory evidence.
- Separate recommendations, supporting record identifiers, missing facts, and required staff approval in each handoff.
- Keep dispatch authority with staff: every dispatch requires their approval.
- Keep inventory access read-only. The assistant must not reserve equipment, change inventory, or promise that an item is safe.

## Authoritative project sources

- [Equipment-handoff assistant](agents/equipment-handoff/description.md) and [its instructions](agents/equipment-handoff/instruction.md): the single drafting responsibility, with canonical model-facing instructions consumed directly by the application.
- [LangGraph connection](runtimes/langgraph.md): fixed control flow, canonical instruction loading, structured output, and the model boundary.
- [Product rules and local development conventions](../README.md): owns the inclusive 48-hour urgency rule, supplied UTC timestamp handling, unknown-stock treatment, selected runtime and exact dependency versions, and verification expectations.
- [Fictional inventory records](../data/inventory.json): supplied item identifiers, availability, quantities, and observations; not a live equipment system.
- [Example equipment requests](../data/requests.json): supplied item references, quantities, reference timestamps, and needed-by timestamps.
