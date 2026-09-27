import type { BaseChatModel } from '@langchain/core/language_models/chat_models';

import { classifyId302 } from '../alert-classification/index.js';

import { draftAlertBrief } from './alert-briefing.workflow.js';
import type { IAlertBrief } from './types.js';

/**
 * Runs ID-302 through the existing classifier and then the separate briefing workflow.
 * @param model A configured structured-output chat model supplied by the caller.
 * @returns An unverified handoff draft for staff review.
 */
export const draftId302Brief = async (model: BaseChatModel): Promise<IAlertBrief> => {
  const classification = await classifyId302(model);
  return draftAlertBrief(model, classification);
};
