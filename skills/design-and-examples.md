# Folio Workshop: small design and worked examples

## Design

| Artifact | Responsibility |
| --- | --- |
| [folio-draft-label](folio-draft-label/SKILL.md) | Turn supplied object notes into a grounded label, or a missing-information request when a label cannot be grounded. |
| [folio-review-label](folio-review-label/SKILL.md) | Review an existing label against supplied notes; report findings without silently rewriting it. |
| [Shared label rules](shared/label-rules.md) | Own terminology, attribution, uncertainty, and the counting contract for both skills. |
| [Word counter](shared/count-label-words.mjs) | Check label text only; it cannot assess factual support. |

The source of truth for an object's facts is its supplied notes, not these examples. The skills share one rules reference, not copies. Keep the whole `skills/` tree together when distributing the toolkit so sibling links continue to resolve. These are reusable source artifacts; creating them does not register them with a host or change any runtime.

Drafting and review are separate operations. A draft includes its evidence and open questions outside the label. A review independently checks both length and grounding. A supported statement of uncertainty is not itself a review failure; hiding that uncertainty is.

## Worked examples

The text inside each `text` block is the entire label. Headings, counts, evidence, and questions below the block are editorial metadata, not label text. Counts were checked with the shared word counter.

### 1. Supported attribution: FW-101

Request: `Use $folio-draft-label to draft a label from notes/fw-101.md.`

Source: [FW-101 notes](../notes/fw-101.md).

**Kind:** Grounded draft.

**Label:**

```text
Blue-glazed stoneware cup. The maker-signed studio card S-101 attributes it to Irena Vale and dates it to 1974 at North Quay. Accession record A-101 records its donation by the Harbor Study Group in 2011.
```

**Word count:** 34/60.

**Evidence:** Object/material: FW-101 opening description. Attribution/date/place and the signed card: S-101. Donor/donation year: A-101.

**Open questions:** None identified in the supplied notes for the fields covered here.

**Review:** PASS — length and grounding pass. Attribution remains explicitly tied to the studio card; donation is not confused with manufacture.

### 2. Missing information: FW-102

Request: `Draft an exhibit label from notes/fw-102.md and keep the missing facts visible.`

Source: [FW-102 notes](../notes/fw-102.md).

**Kind:** Grounded draft.

**Label:**

```text
Carved oak tray, dated about 1980 on storage card S-102. Its maker and place of manufacture are not recorded. Accession record A-102 records its donation by the South Window Study Circle in 2008.
```

**Word count:** 33/60.

**Evidence:** Object/material: FW-102 opening description. Approximate date and missing maker/place: S-102. Donor/donation year: A-102.

**Open questions:** Who made it, and where? Supply a source identifying the maker and place of manufacture if available; do not guess.

**Review:** PASS — the approximation and recorded gaps are visible. Passing review does not fill the gaps.

### 3. Unresolved disagreement: FW-103

Request: `Use $folio-draft-label on notes/fw-103.md without selecting a preferred attribution.`

Source: [FW-103 notes](../notes/fw-103.md).

**Kind:** Grounded draft.

**Label:**

```text
Woven wool wall panel. Note N-103-A attributes it to Tessa Marr, 1968; note N-103-B to Oren Pike, 1971. Attribution and date remain unresolved. Place of manufacture and provenance are not recorded in the supplied notes.
```

**Word count:** 35/60.

**Evidence:** Object/material: FW-103 opening description. Tessa Marr/1968: N-103-A. Oren Pike/1971: N-103-B. The notes explicitly supply no resolving authority; neither supplies manufacture place or provenance.

**Open questions:** What supplied authority, if any, resolves these two claims about the same panel? What sources establish place of manufacture and provenance? Neither competing claim has been adopted as fact.

**Review:** PASS — each maker/date pair keeps its source and the disagreement remains unresolved. This is not authentication of either attribution.

### 4. A short label can fail: FW-101

Request: `Use $folio-review-label to check this label against notes/fw-101.md.`

**Submitted label:**

```text
Irena Vale made this hand-made stoneware cup at North Quay in 1974. The artist donated it in 2011.
```

**Word count:** 18/60. **Length:** PASS. **Grounding:** FAIL. **Overall:** REVISE.

**Findings:**

- “Irena Vale made” turns S-101's attribution into an unqualified assertion. Restore source-qualified attribution.
- “hand-made” is not supported by FW-101; remove it. Its counting behavior does not establish its truth.
- “The artist donated it” contradicts A-101, which names the Harbor Study Group as donor. Correct the donor.

**Open questions:** None needed to identify these defects. No replacement label is implied by this review.

### 5. False precision and hidden gaps: FW-102

**Submitted label:**

```text
Carved oak tray, made in 1980. Donated by the South Window Study Circle in 2008.
```

**Word count:** 15/60. **Length:** PASS. **Grounding:** FAIL. **Overall:** REVISE.

**Findings:** “made in 1980” drops S-102's approximation; preserve “about 1980.” The missing maker and manufacture place are hidden; disclose them as not recorded. A-102 supports the donor and donation year.

**Open questions:** Maker and place of manufacture remain unrecorded.

### 6. Hidden disagreement: FW-103

**Submitted label:**

```text
Woven wool wall panel by Tessa Marr, 1968.
```

**Word count:** 8/60. **Length:** PASS. **Grounding:** FAIL. **Overall:** REVISE.

**Findings:** The label adopts N-103-A as settled fact and omits N-103-B's Oren Pike/1971 claim. No supplied authority resolves the conflict. Restore both source-linked claims and their unresolved status, and disclose the unrecorded place/provenance.

**Open questions:** Resolving authority, place of manufacture, and provenance remain outstanding.

### 7. Required input absent

Request: `Draft a label for FW-102, but no notes are supplied or accessible.`

**Kind:** Missing-information request.

**Request:** Supply the FW-102 source notes or an accessible path to them. An object identifier alone is not evidence for object type, maker, date, material, place, or provenance. No label or label word count is emitted.

For a review with a label but no accessible notes: report **Overall: NEEDS INFORMATION**, give a length result if the label text is unambiguous, and mark grounding **NOT CHECKED**. Do not use a worked example as substitute evidence.

## Copyable use

After making these source skills available through your host's skill-loading mechanism:

```text
Use $folio-draft-label to draft a label from notes/fw-102.md.
Use $folio-review-label to review the label below against notes/fw-103.md.
```

Run the counter from the repository root, passing only label text as one argument:

```sh
node skills/shared/count-label-words.mjs --text "hand-made bowl"
node skills/shared/count-label-words.mjs --text "hand made bowl"
node --test skills/shared/count-label-words.test.mjs
```

The first two commands report 2 and 3 words respectively. For multiline text, omit `--text` and send the exact label on standard input. The counter never strips document headings or evidence sections for you.
