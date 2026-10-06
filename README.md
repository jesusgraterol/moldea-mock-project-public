# Parcel Desk (Test 2)

Parcel Desk helps support staff at a small online stationery shop explain shipment delays from a locally supplied tracking snapshot. A draft should distinguish recorded carrier events from estimates and unknowns, so staff can answer a customer without inventing a current location or promising delivery. Staff handle refunds, reroutes, and carrier contact themselves.

The fictional `PD-431` shipment in `records/` has a carrier handoff and a later regional-hub scan. Its estimated delivery date has not passed. `PD-432` has a passed carrier estimate and an older last scan, but no delivery scan or newer location. The desk wants short, calm explanations of what the known scans show and what remains uncertain. No customer address or other real personal data is included.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider calls, or application test suite. No reply is sent to a customer by this repository.

## Project blueprint

- `records/` contains fictional case notes, including PD-431 and PD-432. The source does not load these records automatically.
- `src/shipment-explainer/` validates a caller-supplied snapshot, reads the canonical instruction, and constructs a direct OpenAI Responses request using a caller-supplied model identifier. The draft text is returned for staff review, not sent to a customer.
- `draftShipmentExplanation(model, snapshot)` requires a reference, carrier, snapshot timestamp, nullable estimated delivery date, scan dates or timestamps and descriptions, and explicit unknowns. Its strict snapshot schema rejects extra properties; callers must still keep personal data out of allowed text fields.
- `moldea/` owns the project context and shipment-explainer instruction. Its manifest records the missing live integration as blocking operational readiness.
- `npm run typecheck` checks the TypeScript source. There is no service entry point, credential setup, live provider verification, deployment, or application test suite.

`/docs` is reserved for concise, quickly scannable documentation of essential, durable project concepts and processes. API and HTTP endpoint documentation belongs in its established location outside `/docs` if those surfaces are added later.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.
Installed skill: `v6.0.0` at `.agents/skills/moldea/`. Actor session: `01a0e3ff-bfb1-71d2-8391-34269dac7fab`.

Observed stopping point: the adopted project has a direct OpenAI Responses draft path. A later PD-432 request added date-only scans and guidance for a passed carrier estimate. Typechecking and Moldea validation passed; live model output, staff review integration, and customer delivery were not exercised.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.

<!-- moldea:end -->
