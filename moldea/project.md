# Harbor Supply

Harbor Supply is a fictional dealer-support team for refrigerated display equipment. This repository is a source-only foundation for future AI-assisted dealer support. The intended workflow is to help staff use available case and product information to prepare a useful response, not to make final dealer-facing decisions on their behalf.

## People and decision boundaries

Dealers ask Harbor Supply staff about product fit, reported equipment symptoms, warranty, and shipments. Equipment support, claims, and fulfillment are separate desks with separate source ownership. Each prepares a staff-only, source-attributed review before the reply writer composes a dealer draft. The support manager approves every dealer response and every part, claim, shipping, or safety commitment. Assistance must distinguish source-backed facts and dealer reports from unknowns or inferences, and make needed staff checks clear.

## Source material

- [`records/hs-214.md`](../records/hs-214.md) is the equipment intake. It records the dealer's fit and symptom question and missing measurements.
- [`catalog/hc-240.md`](../catalog/hc-240.md) is the checked-in HC-240 product sheet. It explains why the model and serial number alone cannot confirm the fitted door revision or gasket, and why reported moisture timing does not establish a cause.
- [`records/hs-214-claims.md`](../records/hs-214-claims.md) is claims-owned invoice and tear evidence.
- [`policies/parts-warranty.md`](../policies/parts-warranty.md) is the parts-warranty rule used for preliminary screening; staff decide each claim.
- [`records/hs-214-fulfillment.md`](../records/hs-214-fulfillment.md) is fulfillment-owned, dated stock and route evidence.

The fulfillment evidence includes a dated stock snapshot, not live inventory. These sources support a staff review packet, not authorization to diagnose a fault, decide warranty coverage, promise shipment timing, or provide safety instructions. A reported failure to hold a safe temperature belongs with staff and their food-safety and equipment-escalation procedures.

## Prototype status

There is no working service, deployment, credential, live provider execution, or delivery integration. `equipment-support`, `claims-review`, `fulfillment-review`, and `dealer-reply` are declared custom source-only invocation boundaries. A staff CLI runs three deterministic desk reviews from their separately loaded instructions and sources, then loads the writer instruction and composes a dealer draft from the reviews. The packet preserves each desk's source attribution and unresolved questions. Preliminary warranty and stock/transit information stays staff-only. It is not a model response or sent message; model execution remains explicitly unresolved for all four roles. Future capabilities should remain small and plausible, with instruction-loading and invocation paths inspectable in source.
