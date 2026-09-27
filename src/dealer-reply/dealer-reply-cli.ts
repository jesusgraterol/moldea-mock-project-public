import { createDealerReplyAgent } from './dealer-reply-agent.ts';
import { previewDealerReply } from './dealer-reply-preview.ts';

const agent = createDealerReplyAgent(previewDealerReply);
const result = await agent.invoke();
const sections = [
  ['Fit', result.verificationNotes.fit],
  ['Symptom follow-up', result.verificationNotes.symptomFollowUp],
  ['Preliminary warranty screening', result.verificationNotes.warrantyScreening],
  ['Shipment questions', result.verificationNotes.shipmentQuestions],
  ['Staff approval', result.verificationNotes.staffApproval],
] as const;

process.stdout.write(
  [
    '# HS-214 dealer draft (deterministic preview, not sent)',
    '',
    result.dealerDraft,
    '',
    '# Staff review packet',
    '',
    ...sections.flatMap(([heading, notes]) => [
      `## ${heading}`,
      '',
      ...notes.map((note) => `- ${note}`),
      '',
    ]),
    '',
  ].join('\n'),
);
