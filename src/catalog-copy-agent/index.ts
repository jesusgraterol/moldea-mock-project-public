import { readFile } from 'node:fs/promises';

import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({});
const instructionUrl = new URL('../../moldea/agents/catalog-copy/instruction.md', import.meta.url);

/**
 * Loads the canonical product-copy instruction for each draft request.
 * @returns A promise resolving to the instruction text.
 */
export const loadCatalogCopyInstruction = async (): Promise<string> =>
  readFile(instructionUrl, 'utf8');

/**
 * Drafts copy from a caller-supplied fact sheet for staff review, not publication.
 * @param factSheet The source fact sheet, including any clearly labeled uncertain claims.
 * @param modelId The Google Gen AI model selected by the caller.
 * @returns A promise resolving to the model's draft blurb and editor-review points.
 * @throws
 * - A non-empty fact sheet and model ID are required.
 * - The model returned no draft text.
 */
export const draftCatalogCopy = async (factSheet: string, modelId: string): Promise<string> => {
  if (!factSheet.trim() || !modelId.trim()) {
    throw new Error('A non-empty fact sheet and model ID are required.');
  }

  const response = await client.models.generateContent({
    model: modelId,
    contents: factSheet,
    config: {
      systemInstruction: await loadCatalogCopyInstruction(),
    },
  });

  const draft = response.text?.trim();
  if (!draft) {
    throw new Error('The model returned no draft text.');
  }

  return draft;
};
