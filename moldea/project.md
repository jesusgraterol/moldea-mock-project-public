# Parcel Desk

Parcel Desk is a source-only prototype that helps support staff at a small online stationery shop explain shipment delays. It drafts short, calm explanations from a caller-supplied tracking snapshot for staff review.

Explanations should distinguish recorded carrier events, delivery estimates, and unknowns. They must not invent a shipment's current location or promise delivery. Staff remain responsible for refunds, reroutes, carrier contact, and customer communication; the repository does not send replies to customers.

The current prototype does not require a working service, deployment, credential setup, live provider calls, or an application test suite. Its draft function constructs an OpenAI Responses request using the caller's model identifier and validated snapshot. Live model behavior and staff review integration have not been established.

The supplied case records are fictional and contain no real customer personal data. Callers must keep personal data out of snapshot text fields; rejecting extra fields does not sanitize allowed text.

## Project references

- [Project blueprint and documentation conventions](../README.md#project-blueprint) describe the source layout, prototype boundaries, and the reserved purpose of `/docs`.
- [Shipment drafting entry point](../src/shipment-explainer/index.ts) exposes the existing draft workflow and snapshot type.
- [Shipment explainer](agents/shipment-explainer/description.md) describes the registered responsibility; its [canonical instruction](agents/shipment-explainer/instruction.md) owns the drafting rules.
- [OpenAI runtime connection](runtimes/openai.md) explains how this prototype supplies the canonical instruction and snapshot to the existing model call. The [manifest](moldea.yaml) records the operational integration gap.
- [PD-431 case notes](../records/pd-431.md) and [PD-432 case notes](../records/pd-432.md) illustrate fictional tracking snapshots.
- Run `npm run typecheck` to check the TypeScript source.
