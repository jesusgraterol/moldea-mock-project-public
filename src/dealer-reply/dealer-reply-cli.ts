import { createDealerReplyAgent } from './dealer-reply-agent.ts';
import { previewDealerReply } from './dealer-reply-preview.ts';

const agent = createDealerReplyAgent(previewDealerReply);
const result = await agent.invoke();

process.stdout.write(
  [
    '# HS-214 dealer draft (deterministic preview, not sent)',
    '',
    result.dealerDraft,
    '',
    '# Staff verification notes',
    '',
    ...result.verificationNotes.map((note) => `- ${note}`),
    '',
  ].join('\n'),
);
