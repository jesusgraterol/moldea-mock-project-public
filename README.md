# Mesa Help

Mesa Help supports customer conversations for a small home-goods shop. A chat assistant should explain caller-supplied order and parcel facts in plain language, distinguish recorded scans from estimates, and leave refunds, replacements, and carrier changes to staff.

The fictional `MH-204` case in `records/` concerns a lamp shipped in two cartons. The base arrived, while the shade carton has a later estimate and no delivery scan in the available snapshot. The customer asks where the shade is and whether shipping can be refunded. The assistant can explain the known shipment state but cannot decide a refund.

This is a source-only prototype. It needs no working service, deployment, credentials, live provider execution, or application test suite. It does not send a message to a customer or alter an order.

Attempt base: `c3ecda12e853b527a96c6ca81150083b0224643a`.
