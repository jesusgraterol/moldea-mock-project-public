---
name: moss-labels
description: Turn supplied Moss Atlas specimen notes into consistent accession-label text. Use for drafting or reformatting these labels, not for identifying specimens, researching taxonomy, assigning accessions, or maintaining a collection database.
---

# Moss Atlas accession labels

Produce plain-text labels for Moss Atlas, a fictional volunteer herbarium, using
only the specimen facts supplied for the current request. This standalone skill
does not install itself, register a workflow, or change project configuration.

## Ground the label

- Keep each specimen's facts separate. Never borrow values from another specimen
  or from the examples.
- Preserve taxon wording exactly, including abbreviations and qualifiers such as
  `sp.`, `cf.`, or `?`. Do not identify a moss, expand names, correct spelling,
  choose an accepted name, or add a family or authority from outside knowledge.
- Preserve names, locality precision, dates, measurements, and uncertainty.
  Reformat whitespace and field headings only; do not geocode, convert units,
  resolve ambiguous dates, or supply an absent day, month, or year.
- Keep roles distinct: a determiner is not necessarily the collector, and a field
  tag or collection number is not an accession.
- Use `[not supplied]` for absent fields. Preserve explicit values such as
  `unknown` or `unidentified` as supplied. For conflicting or invalid values, use
  `[needs confirmation]` and quote the relevant source values outside the label.

## Check the accession

The current accession format is literal `MA-` followed by exactly four ASCII
digits, such as `MA-0042` (`^MA-[0-9]{4}$`). Preserve supplied leading zeros.
Never assign, increment, pad, truncate, or infer an accession. If a supplied
accession does not match, use `[needs confirmation]`; if none is supplied, use
`[not supplied]`. A format match does not establish registration or uniqueness.
Flag repeated accessions within a supplied batch without silently renumbering.

## Render consistently

Use this field order for each specimen; the bracketed field names below are
template slots, not literal output:

```text
Moss Atlas
Accession: [accession]
Taxon: [taxon]
Collector: [collector]
Collection date: [collection date]
Locality: [locality]
Substrate: [substrate]
Notes: [additional supplied specimen details]
```

Omit `Notes` only when there are no additional supplied details. Retain other
specimen facts there with explicit headings where needed (for example, `Field
tag: 27`), without changing their meaning. Separate multiple labels with a blank
line and keep their input order.

Return the label text, followed when needed by a concise `Checks:` line outside
each label identifying missing fields, conflicts, invalid or repeated accessions.
Keep draft labels usable with placeholders; do not claim they are complete.
If the user requires final labels without placeholders, request the missing
values rather than guessing. If facts cannot be assigned to individual
specimens, ask for that mapping before combining them.

Before returning, verify that every non-placeholder factual value traces to
that specimen's supplied notes and that uncertainty has not become certainty.
Consult [references/examples.md](references/examples.md) when an example of the
format or missing-data handling would help.
