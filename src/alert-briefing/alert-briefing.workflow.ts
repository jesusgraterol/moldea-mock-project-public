import { readFile } from 'node:fs/promises';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { entrypoint, task } from '@langchain/langgraph';
import { z } from 'zod';

import {
  ClassificationResultSchema,
  type IClassificationResult,
} from '../alert-classification/index.js';

import { composeBriefFacts, renderAlertBrief } from './transformers.js';
import {
  AlertBriefSchema,
  BriefSynopsisSchema,
  type IAlertBrief,
  type IBriefFacts,
} from './types.js';

const loadBriefingInstructions = task('loadBriefingInstructions', async (): Promise<string> =>
  readFile(new URL('./briefing-instructions.md', import.meta.url), 'utf8'),
);

/**
 * Drafts a separate staff-review brief from a completed classifier result.
 * @param model A configured chat model that supports structured output.
 * @param classification The source observations and unverified classifier recommendation.
 * @returns A brief whose model-derived text is explicitly marked unverified.
 */
export const draftAlertBrief = async (
  model: BaseChatModel,
  classification: IClassificationResult,
): Promise<IAlertBrief> => {
  const validatedClassification = ClassificationResultSchema.parse(classification);

  const draftSynopsis = task(
    'draftBriefSynopsis',
    async (facts: IBriefFacts, instructions: string) => {
      const synopsis = await model.withStructuredOutput(BriefSynopsisSchema).invoke([
        new SystemMessage(instructions),
        new HumanMessage(JSON.stringify(facts)),
      ]);

      return BriefSynopsisSchema.parse(synopsis);
    },
  );

  const workflow = entrypoint('draftAlertBrief', async (result: IClassificationResult) => {
    const facts = composeBriefFacts(result);
    const instructions = z.string().trim().min(1).parse(await loadBriefingInstructions());
    const synopsis = await draftSynopsis(facts, instructions);

    return renderAlertBrief(facts, synopsis);
  });

  return AlertBriefSchema.parse(await workflow.invoke(validatedClassification));
};
