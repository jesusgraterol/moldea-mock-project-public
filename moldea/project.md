# Trip Care

Trip Care is a source-only assistant prototype for a fictional travel desk. It helps staff explain itinerary-change options from supplied records. Staff verify current availability and fare rules, and make booking or cancellation decisions.

The first case is TC-201, a traveler seeking a departure after 09:30. The supplied schedule snapshot is not live inventory, and its displayed fare differences are not complete change quotes. This repository does not provide a working service, deployment, credentials, or verified live provider execution.

The local Basic fare voluntary-change rule is in `records/basic-fare-rule.md`. Source configuration hands policy questions from the itinerary-options agent to a separate fare-rule specialist; timing guidance remains with the itinerary-options agent.
