# Release Desk Claude Agent SDK boundary

`draftSeatline28ReleaseNotes` is a source-only invocation, not a wired product service. It reads the checked-in Seatline 2.8 records and the canonical instruction at call time, then constructs a one-turn SDK query with no available built-in tools or filesystem settings. If invoked, it would send the record text to the configured model provider and return unverified draft text to its caller. It has no publishing, deployment, or customer/staff messaging integration.

No credentials, live provider call, product entry point, or application test suite are supplied or verified here. The release manager remains responsible for factual review and publication decisions. A future integration must supply its own authorized provider setup, caller, and verification before the draft can be used operationally.
