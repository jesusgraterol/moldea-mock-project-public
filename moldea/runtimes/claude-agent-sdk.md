# Release Desk Claude Agent SDK boundary

`draftSeatline28ReleaseNotes` is a source-only invocation, not a wired product service. It reads only the drafting-eligible Seatline 2.8 records and the canonical drafter instruction at call time, then constructs a one-turn SDK query with no available built-in tools or filesystem settings.

`reviewHeldSeatline28Records` separately reads the held records and exposes only the SDK `Agent` tool to a parent query, with built-in subagents disabled. Its programmatic `release-record-reviewer` subagent loads the canonical reviewer instruction and has no tools. The invocation requires the full held-record text in a completed foreground reviewer call and returns the subagent's report from the SDK tool result, not a parent-model paraphrase. The text remains unverified model output. Review output is not an input to the drafter; the release manager manually promotes approved facts and a category to the drafting source.

If invoked, either query would transmit its source records to the configured model provider. Neither invocation publishes, deploys, or messages customers or staff. No credentials, live provider call, product entry point, or application test suite are supplied or verified here. A future integration must provide an authorized caller and verify the review and drafting paths before operational use.
