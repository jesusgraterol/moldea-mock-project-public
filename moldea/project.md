# Vendor Desk

Vendor Desk is a source-only prototype for procurement staff at a regional home-goods retailer. Staff collect supplier packets containing product claims, insurance, shipping terms, and other evidence before a buyer decides whether a supplier can be approved.

The source-only vendor reviewer identifies missing, expired, or unsigned evidence explicitly represented in caller-provided packet facts. A numeric recycled-content claim also requires an independently sourced recycled-content verification document before staff can complete packet review; a vendor material declaration alone does not meet that document requirement. The reviewer uses the Anthropic SDK to draft a specific, polite follow-up for a buyer to edit. Receipt or stated provenance of a document does not prove the claimed quantity or percentage. Procurement staff make every supplier-approval decision.

The fictional packets in `records/` illustrate these review gaps. The prototype has no working service or deployment and requires no repository credentials, live provider execution, or application test suite.
