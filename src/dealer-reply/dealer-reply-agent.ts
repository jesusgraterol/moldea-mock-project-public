import { loadDealerReplyInstruction } from './dealer-reply-instruction.ts';
import { loadDealerReplySources } from './dealer-reply-sources.ts';
import type { IDealerReplyAgent, IDealerReplyInvoker } from './types.ts';

/**
 * Creates the source-backed HS-214 invocation without selecting a provider.
 * @param invoker The draft invoker, currently a deterministic preview.
 * @returns An agent boundary that loads instructions and sources when invoked.
 */
export const createDealerReplyAgent = (invoker: IDealerReplyInvoker): IDealerReplyAgent => ({
  invoke: async () => {
    const [instructions, sources] = await Promise.all([
      loadDealerReplyInstruction(),
      loadDealerReplySources(),
    ]);

    return invoker({ instructions, ...sources });
  },
});
