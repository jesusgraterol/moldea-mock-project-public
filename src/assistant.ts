import { readFile } from 'node:fs/promises';
import type OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { AccessionRecordSchema, AccessionNoteSchema } from './schemas.ts';
import type { AccessionNote } from './schemas.ts';

export async function loadAccessionInstructions(): Promise<string> {
  return (await readFile(new URL('../moldea/agents/accession-note/instruction.md', import.meta.url), 'utf8')).trim();
}

export const ACCESSION_INSTRUCTIONS = await loadAccessionInstructions();

export async function draftAccessionNote(accessionId: string, options: { client: OpenAI; model: string }): Promise<AccessionNote> {
  const id = z.string().min(1).parse(accessionId);
  const records = z.array(AccessionRecordSchema).parse(JSON.parse(await readFile(new URL('../data/accessions.json', import.meta.url), 'utf8')));
  const record = records.find((item) => item.id === id);
  if (!record) throw new Error('Unknown accession identifier.');
  const response = await options.client.responses.create({
    model: options.model, instructions: ACCESSION_INSTRUCTIONS,
    input: JSON.stringify(record), store: false,
    text: { format: zodTextFormat(AccessionNoteSchema, 'accession_note') },
  });
  if (response.status !== 'completed' || !response.output_text) throw new Error('No completed structured accession note.');
  return AccessionNoteSchema.parse(JSON.parse(response.output_text));
}
