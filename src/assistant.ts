import { readFile } from 'node:fs/promises';
import type OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { AccessionRecordSchema, AccessionNoteSchema } from './schemas.ts';
import type { AccessionNote } from './schemas.ts';

export const ACCESSION_INSTRUCTIONS = 'You draft Beacon Collections accession notes from the supplied fictional record only. Keep missing maker, date and provenance facts unknown and list their field names. The curator approves accession readiness. You only draft notes: never approve accession readiness, persist a record change or imply approval. Return the requested structured note with humanApprovalRequired true and approvalAuthority curator.';

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
