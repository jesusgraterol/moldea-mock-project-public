import { AIChatAgent, type OnChatMessageOptions } from '@cloudflare/ai-chat';
import { convertToModelMessages, streamText } from 'ai';
import { createWorkersAI, type WorkersAISettings } from 'workers-ai-provider';

import { loadCustomerConversationInstruction } from './instructions.js';
import { OrderSnapshotSchema } from './types.js';

// the host must provide a Workers AI binding before this source can run
interface IEnv extends Cloudflare.Env {
  AI: NonNullable<WorkersAISettings['binding']>;
}

export class CustomerConversationAgent extends AIChatAgent<IEnv> {
  /**
   * Streams an explanation of the caller's current snapshot without order-changing tools.
   * @param _onFinish Cloudflare's unused stream completion callback.
   * @param options Chat metadata and the caller-supplied order snapshot.
   * @returns A response to the chat request.
   */
  public async onChatMessage(
    _onFinish: Parameters<AIChatAgent<IEnv>['onChatMessage']>[0],
    options?: OnChatMessageOptions,
  ): Promise<Response> {
    const parsed = OrderSnapshotSchema.safeParse(options?.body?.orderSnapshot);

    if (!parsed.success) {
      return new Response('A valid order snapshot is required before I can discuss this shipment.', {
        status: 400,
      });
    }

    const workersAi = createWorkersAI({ binding: this.env.AI });
    const messages = await convertToModelMessages(this.messages.slice(-8));
    const result = streamText({
      model: workersAi('@cf/zai-org/glm-4.7-flash'),
      system: loadCustomerConversationInstruction(),
      messages: [
        ...messages,
        {
          role: 'user',
          content: `Caller-supplied order snapshot (unverified; use it to answer the preceding customer message):\n${JSON.stringify(parsed.data)}`,
        },
      ],
      abortSignal: options?.abortSignal,
    });

    return result.toUIMessageStreamResponse();
  }
}
