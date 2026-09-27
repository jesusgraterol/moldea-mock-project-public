# Mesa Help

Mesa Help is a source-only prototype for customer conversations and a separate support-staff follow-up workflow at a small home-goods shop. The customer-facing assistant explains caller-supplied order and parcel facts in plain language, distinguishes recorded scans from carrier estimates, and says when the available snapshot does not establish a parcel's current location or delivery. The staff-facing Think assistant can discuss fictional cases across turns and consults a read-only local lookup on demand for a structured routing note and prototype queue recommendation.

Neither assistant decides or performs refunds, replacements, carrier contact, or order changes, and neither sends a customer message. Staff own those decisions and actions. The fictional MH-204 case in `records/mh-204.md` illustrates the customer conversation. MH-205 in `records/mh-205.md` illustrates an overdue estimate without a delivery scan. MH-206 in `records/mh-206.md` illustrates a later carrier delivery scan that conflicts with the customer's missing-shade report; the scan is not proof of customer receipt.

This repository is not a working service or deployment and does not require credentials, live provider execution, or an application test suite.
