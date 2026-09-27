# Store Guide

Store Guide is a source-only assistant prototype for a fictional commuter-bag shop. It serves shoppers who need catalog-grounded bag comparisons and staff who review recommendations and comparison cards before making sales or product claims.

The first case, SG-101, concerns a 16-inch laptop and lunch on a 12 km bike commute with occasional rain. `records/catalog.md` is the local product-fact snapshot; `records/sg-101.md` is the shopper request. Prices are display examples, and neither availability nor delivery is provided.

The guide may explain options and tradeoffs but cannot verify exact laptop fit or waterproofing. A separate one-shot source invocation drafts a Canal 22 versus Ridge 26 card and returns the selected catalog facts for staff review. Neither path may mutate carts or orders. No service, deployment, credentials, or live provider validation exists in this prototype.
