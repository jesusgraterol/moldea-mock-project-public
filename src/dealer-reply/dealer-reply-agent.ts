import { loadDealerReplyInstruction } from './dealer-reply-instruction.ts';
import type { IDealerReplyAgent, IDealerReplyInvoker } from './types.ts';

/**
 * Creates the reply writer without granting access to desk-owned sources.
 * @param invoker The draft invoker, currently a deterministic preview.
 * @returns An agent boundary that loads its instruction for each invocation.
 */
export const createDealerReplyAgent = (invoker: IDealerReplyInvoker): IDealerReplyAgent => ({
  invoke: async (reviews) => {
    const instructions = await loadDealerReplyInstruction();

    return invoker({ instructions, ...reviews });
  },
});
