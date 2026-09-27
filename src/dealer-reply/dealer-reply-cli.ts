import type { IDeskReview } from '../desk-review/index.ts';
import { runHs214Preview } from '../hs-214/index.ts';

const formatReview = (heading: string, review: IDeskReview): string[] => [
  `## ${heading} (staff only)`,
  '',
  'Findings:',
  ...review.findings.map(({ text, sources }) => `- ${text} [Sources: ${sources.join(', ')}]`),
  '',
  'Open questions:',
  ...review.openQuestions.map(({ text, sources }) => `- ${text} [Sources: ${sources.join(', ')}]`),
  '',
];

const result = await runHs214Preview();

process.stdout.write(
  [
    '# HS-214 dealer draft (deterministic preview, not sent)',
    '',
    result.dealerDraft,
    '',
    '# Staff review packet',
    '',
    ...formatReview('Equipment support', result.deskReviews.equipment),
    ...formatReview('Claims', result.deskReviews.claims),
    ...formatReview('Fulfillment', result.deskReviews.fulfillment),
    '## Manager approval',
    '',
    ...result.managerChecks.map((check) => `- ${check}`),
    '',
  ].join('\n'),
);
