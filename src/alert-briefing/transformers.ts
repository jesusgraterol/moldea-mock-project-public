import type { IClassificationResult } from '../alert-classification/index.js';

import type { IAlertBrief, IBriefFacts, IBriefSynopsis } from './types.js';

const inline = (text: string): string => text.replace(/\s+/g, ' ').trim();

const bullets = (items: string[], emptyMessage: string): string =>
  items.length > 0 ? items.map((item) => `- ${inline(item)}`).join('\n') : `- ${emptyMessage}`;

/**
 * Builds a timeline and evidence sections without asking a model to restate source IDs.
 * @param classification The existing classifier result.
 * @returns Source-derived briefing facts and separately identifiable classifier suggestions.
 */
export const composeBriefFacts = (classification: IClassificationResult): IBriefFacts => {
  const { rawBatch, recommendation } = classification;
  const { deployment } = rawBatch;
  const timeline = [
    ...(deployment
      ? [
          {
            at: deployment.completedAt,
            description: [
              `Release ${deployment.release} completed for ${deployment.service}.`,
              'Cause unconfirmed.',
            ].join(' '),
          },
        ]
      : []),
    ...rawBatch.events.map((event) => ({
      at: event.observedAt,
      description: `${event.eventId} observed for ${event.service}.`,
    })),
    { at: rawBatch.capturedAt, description: 'Alert batch captured for review.' },
  ]
    .sort(
      (first, second) =>
        Date.parse(first.at) - Date.parse(second.at) ||
        first.description.localeCompare(second.description),
    )
    .map((entry) => `${entry.at}: ${entry.description}`);

  return {
    batchId: rawBatch.batchId,
    timeline,
    observedSignals: classification.normalizedSignals.map((signal) => {
      const measurement = `${signal.observedValue} ${signal.unit} vs ${signal.threshold} ${signal.unit}`;
      return `${signal.rawEventId}: ${signal.service} ${signal.signal}, ${measurement}.`;
    }),
    classificationSummary: recommendation.summary,
    classificationRationale: recommendation.rationale,
    reviewPriority: recommendation.reviewPriority,
    hypotheses: recommendation.hypotheses,
    knownEvidenceGaps: rawBatch.knownEvidenceGaps,
    suggestedEvidence: recommendation.evidenceNeeded,
  };
};

/**
 * Renders the staff-review draft while keeping every model-derived statement labeled unverified.
 * @param facts Source observations and the classifier recommendation.
 * @param synopsis The briefing model's unverified sentence.
 * @returns A Markdown brief with an untouched engineer-decision section.
 */
export const renderAlertBrief = (facts: IBriefFacts, synopsis: IBriefSynopsis): IAlertBrief => ({
  batchId: facts.batchId,
  modelOutputStatus: 'unverified',
  markdown: [
    `# ${inline(facts.batchId)} handoff draft`,
    '',
    '_Staff review required. Model text is unverified; no decision is recorded._',
    '',
    '## Timeline',
    bullets(facts.timeline, 'No timeline entries supplied.'),
    '',
    '## Observed signals',
    bullets(facts.observedSignals, 'No signals supplied.'),
    '',
    '## Classification recommendation (unverified)',
    `- Review priority: ${facts.reviewPriority}`,
    `- Synopsis: ${inline(synopsis.synopsis)}`,
    `- Rationale: ${inline(facts.classificationRationale)}`,
    '',
    '## Unconfirmed hypotheses',
    bullets(facts.hypotheses, 'None supplied; cause remains unconfirmed.'),
    '',
    '## Missing evidence',
    bullets(facts.knownEvidenceGaps, 'No gaps recorded in the supplied batch.'),
    ...(facts.suggestedEvidence.length > 0
      ? facts.suggestedEvidence.map((item) => `- Suggested check (unverified): ${inline(item)}`)
      : []),
    '',
    '## Engineer decision',
    '_To be completed by the on-call engineer after review._',
  ].join('\n'),
});
