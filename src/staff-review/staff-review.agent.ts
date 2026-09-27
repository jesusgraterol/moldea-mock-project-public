import { AIChatAgent, type OnChatMessageOptions } from '@cloudflare/ai-chat';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from 'ai';
import { createWorkersAI, type WorkersAISettings } from 'workers-ai-provider';

import { loadStaffReviewInstruction } from './instructions.js';
import { buildRoutingNote } from './routing-policy.js';
import { StaffCaseSchema } from './types.js';

// the host must provide a Workers AI binding before this source can run
interface IEnv extends Cloudflare.Env {
  AI: NonNullable<WorkersAISettings['binding']>;
}

/** Streams staff-only case explanations and structured routing notes from supplied facts. */
export class StaffReviewAgent extends AIChatAgent<IEnv> {
  /**
   * Streams a staff-facing answer and a deterministic routing note for the supplied case.
   * @param _onFinish Cloudflare's unused stream completion callback.
   * @param options Chat metadata and the staff-supplied case snapshot.
   * @returns A response containing the note and conversational reply.
   */
  public async onChatMessage(
    _onFinish: Parameters<AIChatAgent<IEnv>['onChatMessage']>[0],
    options?: OnChatMessageOptions,
  ): Promise<Response> {
    const parsed = StaffCaseSchema.safeParse(options?.body?.staffCase);

    if (!parsed.success) {
      return new Response('A valid staff case snapshot is required to prepare a routing note.', {
        status: 400,
      });
    }

    const routingNote = buildRoutingNote(parsed.data);
    const workersAi = createWorkersAI({ binding: this.env.AI });
    const messages = await convertToModelMessages(this.messages.slice(-8));
    const result = streamText({
      model: workersAi('@cf/zai-org/glm-4.7-flash'),
      system: loadStaffReviewInstruction(),
      messages: [
        ...messages,
        {
          role: 'user',
          content: `Staff-supplied case and local routing note (unverified).
Answer the preceding staff question:\n${JSON.stringify({ staffCase: parsed.data, routingNote })}`,
        },
      ],
      abortSignal: options?.abortSignal,
    });

    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'data-routing-note', id: 'routing-note', data: routingNote });
        writer.merge(result.toUIMessageStream());
      },
    });

    return createUIMessageStreamResponse({ stream });
  }
}
