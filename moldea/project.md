# Release Desk

Release Desk is a source-only assistant prototype for Seatline product staff. It prepares customer-facing release-note drafts from short internal change records; the planned Seatline 2.8 records are in `records/release-2.8.md`.

A release manager verifies claims, edits the draft, and decides whether and when to publish. The prototype must not publish, deploy, or message customers or staff. The records establish planned changes, not shipment, launch timing, rollout scope, metrics, or customer impact. No working service or live provider integration is established.

Ambiguous planned records are held separately from drafting input. An independent reviewer subagent may give the release manager an advisory assessment, but only the manager can decide which facts and category to promote into the drafting source.

When a fix also changes customer-visible notification timing, the proposed note belongs under Changed, with the corrected defect explained in that entry rather than duplicated under Fixes. The reviewer recommends that classification for manager confirmation; it does not approve claims or infer a delivery-time guarantee. RC-44 remains held pending that decision.
