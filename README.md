# Folio Workshop

A standalone editorial toolkit for a fictional small exhibition. Two reusable Agent Skills draft exhibit labels from supplied notes and review labels against those notes. They share one reference for terminology, attribution, uncertainty and length, with worked examples. These are independent host skill artifacts, not an application service or a runtime agent.

Labels may contain up to 60 words. Dates, provenance and attribution must come from supplied source notes; do not invent unsupported facts. Preserve missing information and unresolved conflicting claims. A label that meets its word limit can still fail factual review. Distinguish a grounded label, a request for missing information and a review finding.

Use only the fictional notes under notes. Keep the deliverable to two skills, one shared reference and worked examples; no third skill, model service or publishing pipeline. Keep project-owned skill sources under skills.

## Toolkit

- [Design, worked examples, and usage](skills/design-and-examples.md)
- [Draft exhibit labels](skills/folio-draft-label/SKILL.md)
- [Review labels against notes](skills/folio-review-label/SKILL.md)
- [Shared terminology, attribution, uncertainty, and counting rules](skills/shared/label-rules.md)

Keep the `skills/` tree together when distributing these source artifacts; both skills use its shared resources. Host installation or registration is not changed.

Check the label-only word counter with `node --test skills/shared/count-label-words.test.mjs`.

## Local development

Use Node 24 and npm with exact versions and an ordinary lockfile if dependencies are needed. Small unrelated developer utilities can use JavaScript ES modules and Node's built-in test runner. Keep usage copyable and artifacts easy to inspect.
