import { isDeepStrictEqual } from 'node:util';
import { Output, ToolLoopAgent, stepCountIs, tool, type LanguageModel } from 'ai';
import { assessReturn } from './assessment.ts';
import {
  OrderLookupInputSchema,
  ReturnRequestSchema,
  StaffRecommendationSchema,
  type GroundedFacts,
  type StaffRecommendation,
} from './contracts.ts';
import { loadReturnInstruction } from './instructions.ts';
import { lookupOrder } from './order-lookup.ts';

export type ReturnAssistantOptions = {
  model: LanguageModel;
  /** Trusted caller-selected local fixture path; never supplied by the model. */
  ordersFile?: string;
};

/** Creates one real, request-scoped, single-use AI SDK agent. */
export async function createReturnAgent(input: unknown, options: ReturnAssistantOptions) {
  const parsed = ReturnRequestSchema.safeParse(input);
  if (!parsed.success) throw new TypeError('Expected an orderId and a valid millisecond-precision UTC requestedAt.');
  const request = parsed.data;
  let started = false;
  let lookupAttempted = false;
  let groundedFacts: GroundedFacts | undefined;

  const groundedOutputSchema = StaffRecommendationSchema.superRefine((value, context) => {
    const { rationale: _rationale, ...facts } = value;
    if (!groundedFacts || !isDeepStrictEqual(facts, groundedFacts)) {
      context.addIssue({
        code: 'custom',
        message: 'Recommendation facts must exactly match this request’s executed lookup and deterministic assessment.',
      });
    }
  });

  return new ToolLoopAgent({
    id: 'returns-assistant',
    model: options.model,
    instructions: await loadReturnInstruction(),
    maxRetries: 0,
    stopWhen: stepCountIs(2),
    toolCallConcurrency: 1,
    tools: {
      lookup_order: tool({
        description: 'Read the requested fictional order and return authoritative identifiers, elapsed-time assessment, missing facts, and pending staff approval. No writes.',
        inputSchema: OrderLookupInputSchema,
        execute: async ({ orderId }) => {
          if (lookupAttempted || orderId !== request.orderId) {
            throw new Error('Only one lookup of the supplied request orderId is permitted.');
          }
          lookupAttempted = true;
          const lookup = await lookupOrder(orderId, options.ordersFile);
          groundedFacts = assessReturn(request, lookup);
          return groundedFacts;
        },
      }),
    },
    prepareStep: ({ stepNumber }) => {
      if (stepNumber === 0) {
        if (started) throw new Error('Create a new return agent for each request.');
        started = true;
        return { toolChoice: { type: 'tool', toolName: 'lookup_order' } };
      }
      return { toolChoice: 'none', activeTools: [] };
    },
    output: Output.object({
      name: 'staff_return_recommendation',
      schema: groundedOutputSchema,
    }),
  });
}

/** Preferred entry point: validated request, bounded loop, parsed staff result. */
export async function draftReturnRecommendation(
  input: unknown,
  options: ReturnAssistantOptions,
): Promise<StaffRecommendation> {
  const agent = await createReturnAgent(input, options);
  const result = await agent.generate({
    prompt: JSON.stringify(ReturnRequestSchema.parse(input)),
    abortSignal: AbortSignal.timeout(30_000),
  });
  return result.output;
}
