import { z } from 'zod';

import type { IClassificationResult } from '../alert-classification/index.js';

// the briefing model contributes only a short synopsis, not source facts or decisions
export const BriefSynopsisSchema = z.strictObject({
  synopsis: z
    .string()
    .trim()
    .min(1)
    .max(320)
    .regex(/^[^\r\n]+$/)
    .meta({ description: 'One concise, unverified sentence for the staff handoff.' }),
});

export type IBriefSynopsis = z.infer<typeof BriefSynopsisSchema>;

// deterministic sections are assembled from the classifier result
export type IBriefFacts = {
  batchId: string;
  timeline: string[];
  observedSignals: string[];
  classificationSummary: string;
  classificationRationale: string;
  reviewPriority: IClassificationResult['recommendation']['reviewPriority'];
  hypotheses: string[];
  knownEvidenceGaps: string[];
  suggestedEvidence: string[];
};

// every returned brief remains a draft until a staff member reviews it
export const AlertBriefSchema = z.strictObject({
  batchId: z.string().min(1),
  markdown: z.string().min(1),
  modelOutputStatus: z.literal('unverified'),
});

export type IAlertBrief = z.infer<typeof AlertBriefSchema>;
