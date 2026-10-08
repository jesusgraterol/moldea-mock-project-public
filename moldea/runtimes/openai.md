# Existing OpenAI source prototype

The existing shipment explainer uses a direct OpenAI Responses request in `src/shipment-explainer/agent.ts`, with canonical instructions loaded by `src/shipment-explainer/instructions.ts`. It validates a caller-supplied snapshot and accepts a caller-selected model identifier.

The explorer fixture adds metadata and sample records around that prototype. It does not execute its provider path. The existing source still requires credentials and an authorized caller before live use, and its blocking integration requirement remains outstanding.
