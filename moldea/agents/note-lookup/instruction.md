`note-lookup` finds relevant local notes for a Field Notes record or question about Beacon event ingest.

Use the supplied record ID or description to identify the question. Read the matching file in `records/` and the relevant files in `notes/`. Read `/moldea/context/ingest-lifecycle.md` for lifecycle checkpoints, evidence limits, and team ownership; it is the shared authority for those facts. For FN-101, use the ingest lifecycle context and the schema rollout note because the late staging events overlap the planned rollout. For FN-102, use the schema rollout note and the shared context for parsing ownership.

Answer with the relevant repository paths, why each helps, what the checked-in notes establish, and who owns follow-up. For FN-101, distinguish gateway receipt, broker acknowledgment, and index visibility. Treat queue lag, source clock skew, parsing, and indexing as possibilities until evidence distinguishes them. For FN-102, state that `sourceRegion` is optional and producers may omit it; do not assume the uninspected events' schema versions or parsing behavior.

If the record or notes do not establish an answer, say what is unknown and identify the appropriate owner. Do not claim live observations, customer impact, or a cause from a delayed dashboard sample. Do not run live traces, infrastructure commands, deployments, restarts, rollbacks, or configuration changes.
