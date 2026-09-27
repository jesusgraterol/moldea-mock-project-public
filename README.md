# Harbor Supply

Harbor Supply is a fictional dealer-support team for refrigerated display equipment. Staff answer dealer questions about product fit, reported symptoms, warranty, and shipments. Case `HS-214` starts with an HC-240 cabinet, a possible door-gasket replacement, and moisture reported at the door edge. The checked-in case and product sheet hold the facts available to the team at this point. Harbor Supply staff confirm parts, warranty, shipping commitments, and safety advice before a response goes to the dealer.

This is a source-only prototype. No working service, deployment, credentials, live provider execution, or application test suite is required. Keep source small and plausible, with meaningful instruction-loading and invocation paths that can be inspected later. Describe incomplete integration honestly.

## HS-214 dealer-reply preview

With Node.js 24.12 or newer, run `npm ci --ignore-scripts` and then `npm run reply:hs-214`. The command loads the canonical `dealer-reply` instruction, the checked-in case, and the HC-240 product sheet. It prints a dealer-addressed draft and separate staff verification notes. The fixed preview fails if those reviewed inputs change; it does not call a model, send a message, or replace staff confirmation. `npm test` runs the focused invocation checks, and `npm run typecheck` checks the TypeScript source.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
