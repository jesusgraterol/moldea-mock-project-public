import { GoogleGenAI } from '@google/genai';

import { loadProductCopyInstruction } from './instructions.js';

const client = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] });

export interface ProductCopyDraft {
  blurb: string;
  reviewFlags: string[];
}

/** Drafts copy from one fact sheet; a staff editor reviews the result. */
export async function draftProductFactSheet(
  factSheet: string,
  model: string,
): Promise<ProductCopyDraft> {
  if (!factSheet.trim()) throw new Error('A product fact sheet is required.');
  if (!model.trim()) throw new Error('A model name is required.');

  const response = await client.models.generateContent({
    model,
    contents: factSheet,
    config: {
      systemInstruction: loadProductCopyInstruction(),
      responseMimeType: 'application/json',
      responseJsonSchema: {
        type: 'object',
        properties: {
          blurb: { type: 'string' },
          reviewFlags: { type: 'array', items: { type: 'string' } },
        },
        required: ['blurb', 'reviewFlags'],
        additionalProperties: false,
      },
    },
  });

  if (!response.text) throw new Error('The model returned no draft.');
  const draft: unknown = JSON.parse(response.text);
  if (
    typeof draft !== 'object' ||
    draft === null ||
    !('blurb' in draft) ||
    typeof draft.blurb !== 'string' ||
    !('reviewFlags' in draft) ||
    !Array.isArray(draft.reviewFlags) ||
    !draft.reviewFlags.every((flag) => typeof flag === 'string')
  ) {
    throw new Error('The model returned an invalid product-copy draft.');
  }

  return { blurb: draft.blurb, reviewFlags: draft.reviewFlags };
}
