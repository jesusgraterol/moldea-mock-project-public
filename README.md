# Harbor Supply

Harbor Supply is a fictional dealer-support team for refrigerated display equipment. Staff answer dealer questions about product fit, reported symptoms, warranty, and shipments. Equipment, claims, and fulfillment teams hold distinct checked-in evidence for case `HS-214`; a manager approves any dealer response and every part, claim, shipping, or safety commitment.

The case concerns an HC-240 cabinet, moisture at the door edge, and a possible gasket replacement. Staff need a useful review packet while keeping uncertainty and team ownership visible.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider call, or dealer delivery.

## Local HS-214 preview

Run `npm run build`, then open `dist/index.html` in a browser. The build reads the checked-in case, catalog, claims, warranty, and fulfillment files, checks the passages used by each desk, and generates a read-only staff review and dealer-reply preview. The reply writer receives only the three desk handoffs. The preview cannot approve or send a dealer response.

<!-- moldea:start -->

For every repository task, select the repository-installed `moldea` skill so its two-byte relevance gate can test the host-known paths. If the gate does not match, continue without `moldea`.
Canonical moldea project state lives under `/moldea/**`; start at `/moldea/project.md`.
<!-- moldea:end -->
