# Vendor Desk

Vendor Desk is a source-only prototype for procurement staff at a regional home-goods retailer. Staff collect supplier packets containing product claims, insurance, shipping terms, and other evidence before a buyer decides whether a supplier can be approved.

The source-only vendor reviewer identifies missing, expired, or unsigned evidence explicitly represented in caller-provided packet facts. It uses the Anthropic SDK to draft a specific, polite follow-up for a buyer to edit. Procurement staff make every supplier-approval decision. Vendor-provided claims must not be presented as verified solely because they appear in a packet.

The fictional packets in `records/` illustrate these review gaps. The prototype has no working service or deployment and requires no repository credentials, live provider execution, or application test suite.
