# Harbor Supply

Harbor Supply is a fictional dealer-support team for refrigerated display equipment. Staff answer dealer questions about product fit, reported symptoms, warranty, and shipments. Case `HS-214` concerns an HC-240 cabinet, a possible door-gasket replacement, and moisture reported at the door edge. Equipment support, claims, and fulfillment own separate checked-in evidence and staff reviews. The support manager approves every dealer response and every part, claim, shipping, or safety commitment before a response goes to the dealer.

This is a source-only prototype. No working service, deployment, credentials, live provider execution, or application test suite is required. Keep source small and plausible, with meaningful instruction-loading and invocation paths that can be inspected later. Describe incomplete integration honestly.

## HS-214 dealer-reply preview

With Node.js 24.12 or newer, run `npm ci --ignore-scripts` and then `npm run reply:hs-214`. The command loads each desk's canonical instruction and only its owned checked-in evidence: equipment intake plus the [HC-240 product sheet](catalog/hc-240.md), [claims evidence](records/hs-214-claims.md) plus [parts-warranty policy](policies/parts-warranty.md), and [fulfillment evidence](records/hs-214-fulfillment.md). After three independent staff-only, source-attributed reviews, the reply writer loads its instruction and consumes those reviews, not their source documents. The output keeps each desk's findings and open questions separate from a dealer-addressed draft and manager checks. Part numbers, preliminary warranty screening, and dated stock/transit information stay staff-only. The fixed preview fails if reviewed instructions, sources, or desk outputs change; it does not call a model, reserve stock, decide a claim, send a message, or replace manager approval. `npm test` runs focused checks, and `npm run typecheck` checks the TypeScript source.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
