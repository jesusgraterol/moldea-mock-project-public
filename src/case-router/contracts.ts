import { z } from 'zod';

// caller input and staff-facing recommendation contracts
export const CustomerRequestSchema = z.string().trim().min(1);

export const QueueRecommendationSchema = z.object({
  queue: z
    .enum(['account access', 'billing review', 'privacy review', 'product help'])
    .nullable()
    .describe('The recommended support queue, or null when the request gives too little evidence.'),
  evidence: z
    .string()
    .trim()
    .min(1)
    .describe('Request evidence for the queue, including any separate issue needing staff follow-up.'),
});

export type IQueueRecommendation = z.infer<typeof QueueRecommendationSchema>;
