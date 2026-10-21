# Cinder Returns

Cinder Returns is a small staff tool for drafting return recommendations from fictional local order records. One assistant will use Vercel AI SDK and one read-only order lookup. Staff approve every decision; the assistant cannot issue refunds, create returns or change orders.

The return window is 30 elapsed 24-hour days from delivery, inclusive at the exact boundary. Compare supplied UTC delivery and request timestamps rather than the machine clock. Missing delivery facts and unknown identifiers stay unknown. A failed lookup cannot establish eligibility.

Keep recommendations, supporting order identifiers, missing facts and staff approval distinct. No UI, database, second assistant or operational integration is needed.

Use Node24, npm and exact package versions already declared in package.json. Order records and sample request inputs are fictional and read-only. This is an initial project brief; the assistant has not been implemented.

<!-- moldea:start -->

This project uses [moldea](https://skill.moldea.ai) to keep project knowledge in Git and bring relevant context into coding-agent work.
Start at [the project overview](moldea/project.md); [the manifest](moldea/moldea.yaml) maps context and implementation relationships.
<!-- moldea:end -->
