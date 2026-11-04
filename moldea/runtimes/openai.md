# OpenAI connection for Parcel Desk

The `shipment-explainer` responsibility uses the direct `openai` SDK, not an agent framework. Its model-facing instruction is behavioral guidance; there is no routing or description consumer in this invocation.

`draftShipmentExplanation` validates the caller's model identifier and snapshot before constructing a Responses request. `loadShipmentExplainerInstruction` reads `/moldea/agents/shipment-explainer/instruction.md` relative to the source module, and the awaited text becomes the request's `instructions`. The validated snapshot is serialized into `input`; case files in `/records` are not loaded automatically. Any future build or packaging must preserve this instruction-file resolution or establish an equivalent canonical loading path.

The request sets `store: false`, registers no tools, and requests no structured output schema. The function returns `response.output_text` for staff review. The caller selects the model; no model identifier is fixed by moldea. The input schema rejects extra properties but does not remove personal data from allowed text fields.

The current repository remains a source-only prototype. The SDK constructor uses its ambient configuration, but the project provides no service entry point or credential setup. Live provider behavior and staff-review integration are not established; the agent's blocking operational-integration requirement records the criteria for operational use. No customer reply is sent by this function.
