import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

import { loadReleaseRecordReviewInstruction } from './instruction.js';

// advisory subagent with no tools or independent side effects
export const releaseRecordReviewerAgent: AgentDefinition = {
  description: 'Reviews held Seatline release records and reports advisory evidence gaps before drafting.',
  prompt: loadReleaseRecordReviewInstruction(),
  tools: [],
  omitClaudeMd: true,
  maxTurns: 1,
};
