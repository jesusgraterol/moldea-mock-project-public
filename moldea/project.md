# Harbor Supply

Harbor Supply is a fictional dealer-support team for refrigerated display equipment. This repository is a source-only foundation for future AI-assisted dealer support. The intended workflow is to help staff use available case and product information to prepare a useful response, not to make final dealer-facing decisions on their behalf.

## People and decision boundaries

Dealers ask Harbor Supply staff about product fit, reported equipment symptoms, warranty, and shipments. Staff remain responsible for confirming parts, warranty decisions, shipping commitments, and safety advice before a response goes to a dealer. Assistance must distinguish source-backed facts and dealer reports from unknowns or inferences, and make needed staff checks clear.

## Source material

- [`records/hs-214.md`](../records/hs-214.md) is the checked-in dealer case. It records the dealer's question, the information received, and what is still missing.
- [`catalog/hc-240.md`](../catalog/hc-240.md) is the checked-in HC-240 product sheet. It explains why the model and serial number alone cannot confirm the fitted door revision or gasket, and why reported moisture timing does not establish a cause.
- [`policies/parts-warranty.md`](../policies/parts-warranty.md) is the parts-warranty rule used for preliminary screening; staff decide each claim.

The case record includes a dated stock snapshot, not live inventory. These sources support a staff review packet, not authorization to diagnose a fault, decide warranty coverage, promise shipment timing, or provide safety instructions. A reported failure to hold a safe temperature belongs with staff and their food-safety and equipment-escalation procedures.

## Prototype status

There is no working service, deployment, credential, live provider execution, or delivery integration. The `dealer-reply` agent is declared with a custom, source-only HS-214 invocation. A staff CLI loads its canonical instruction and checked-in sources, then prints a deterministic dealer draft and grouped staff review notes for fit, symptoms, warranty, shipment, and approval. Preliminary warranty and stock/transit information stays staff-only. The packet is not a model response or a sent message; model execution remains an explicitly unresolved integration. Future capabilities should remain small and plausible, with instruction-loading and invocation paths that can be inspected in source.
