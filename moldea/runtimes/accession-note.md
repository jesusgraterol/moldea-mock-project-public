# Accession-note runtime connection

The `openai` runtime identifies the SDK called directly by [draftAccessionNote](../../src/assistant.ts). This is one inline, one-shot workflow, not a router or multi-agent system. The canonical description is general descriptive metadata; no runtime description or handoff consumer exists.

## Instruction and data path

- `loadAccessionInstructions` reads `/moldea/agents/accession-note/instruction.md` relative to the source module and trims surrounding whitespace. The exported `ACCESSION_INSTRUCTIONS` string is loaded once during module initialization and is passed as Responses `instructions`. There is no independent inline policy or instruction mirror. Changes to the canonical file take effect when the module is loaded again.
- The caller explicitly supplies an OpenAI client and model. The application loads and validates the fictional local JSON records, selects the requested accession, and sends only that record as JSON input with `store: false`.
- `AccessionRecordSchema` is the strict model-input record contract, not the function's identifier argument. Maker, date, and provenance keys are required and nullable; other record strings are nonempty.
- `AccessionNoteSchema` is supplied through `zodTextFormat` as Responses `text.format` and validates returned JSON. It requires a nonempty accessionId and draftNote, an array limited to maker/date/provenance names, and the literal curator authority and true approval-required flag. Unknown properties are rejected.
- The function rejects an unknown identifier, invalid source data, an incomplete or empty response, and invalid JSON or schema output. Filesystem and client errors propagate. It returns the validated draft without persisting changes. There are no model-visible tools, runtime variables, continuations, or handoffs.

## Authority and known limits

[docs/approval-policy.md](../../docs/approval-policy.md) remains the sole human-approval policy authority. The canonical instruction carries the existing assistant-facing rules; it does not replace or amend that document. [Host instructions](../../docs/host-instructions.md) continue to govern execution.

Missing-field reporting is model-generated, not derived from source nulls. The manifest records the existing consistency gap as `missing-field-consistency`. The schema checks shape and literals, not factual grounding, approval wording inside free-text prose, or equality of the returned accessionId to the selected record. Human review remains necessary.

## Connection verification

[src/assistant.test.ts](../../src/assistant.test.ts) exercises the actual module-relative loader, workflow, pinned OpenAI client, and schema formatting, substituting only the external fetch transport. It compares the outgoing instruction with the canonical file, verifies the full outgoing schema and selected record identifier, and checks the returned draft. No live provider call, real credential, archive action, service, or UI is required.
