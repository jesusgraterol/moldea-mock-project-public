import { Think, type ToolCallContext, type ToolCallDecision, type TurnConfig } from '@cloudflare/think';
import type { ToolSet } from 'ai';
import { createWorkersAI, type WorkersAISettings } from 'workers-ai-provider';

import { loadStaffReviewInstruction } from './instructions.js';
import { lookupRoutingNoteTool } from './tools.js';

// the host must provide a Workers AI binding before this source can run
interface IEnv extends Cloudflare.Env {
  AI: NonNullable<WorkersAISettings['binding']>;
}

/** Provides a staff-only Think conversation with one read-only policy lookup. */
export class StaffReviewAgent extends Think<IEnv> {
  /**
   * Provides the Workers AI model used by Think's chat loop.
   * @returns The configured Workers AI model.
   */
  public getModel() {
    return createWorkersAI({ binding: this.env.AI })('@cf/zai-org/glm-4.7-flash');
  }

  /**
   * Loads the canonical staff instruction for every conversation turn.
   * @returns The staff-only model instruction.
   */
  public getSystemPrompt(): string {
    return loadStaffReviewInstruction();
  }

  /**
   * Registers the local routing lookup for staff conversations.
   * @returns The read-only tool set.
   */
  public getTools(): ToolSet {
    return { lookupRoutingNote: lookupRoutingNoteTool };
  }

  /**
   * Restricts the turn to the trusted lookup, even if a client offers a same-named tool.
   * @returns The tool restriction for this turn.
   */
  public beforeTurn(): TurnConfig {
    return {
      tools: { lookupRoutingNote: lookupRoutingNoteTool },
      activeTools: ['lookupRoutingNote'],
      sendReasoning: false,
    };
  }

  /**
   * Blocks other executable tools if a future configuration exposes them.
   * @param context The requested tool call.
   * @returns A block decision for every tool except the local lookup.
   */
  public beforeToolCall(context: ToolCallContext): ToolCallDecision | void {
    if (context.toolName !== 'lookupRoutingNote') {
      return { action: 'block', reason: 'Only the read-only routing lookup is allowed.' };
    }
  }
}
