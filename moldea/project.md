# Incident Desk

Incident Desk is a source-only prototype that helps on-call engineers interpret alert batches for a small appointment-booking platform. It should classify supplied signals, distinguish observations from hypotheses, and prepare material for human incident review.

The fictional ID-301 batch in `records/id-301.md` contains elevated booking API errors and latency shortly after a deployment. The deployment timing is context, not evidence of cause. Classification should retain the raw event IDs and make the reason for review clear.

Engineers, not this prototype, decide whether to page, declare an incident, or change production. The repository does not require a working service, deployment, credentials, live provider execution, or an application test suite.
