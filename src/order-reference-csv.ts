import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { z } from 'zod';

const IdentifierSchema = z.string().refine((value) => value.trim().length > 0, {
  error: 'Expected a non-blank string.',
});

// Export only the two requested fields; unrelated order facts are ignored.
const OrderReferencesSchema = z.array(z.object({
  id: IdentifierSchema,
  reference: IdentifierSchema,
}));

function quoteCsv(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

/** Stable, locale-independent ID sorting; equal IDs retain their input order. */
export function orderReferencesToCsv(input: unknown): string {
  const parsed = OrderReferencesSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const location = issue?.path.reduce<string>(
      (path, key) => typeof key === 'number' ? `${path}[${key}]` : `${path}.${String(key)}`,
      'orders',
    ) ?? 'orders';
    throw new TypeError(`Invalid order records at ${location}: ${issue?.message ?? 'invalid input'}`);
  }

  const rows = parsed.data
    .toSorted((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0)
    .map(({ id, reference }) => `${quoteCsv(id)},${quoteCsv(reference)}`);
  return ['orderId,reference', ...rows].join('\r\n') + '\r\n';
}

/** Reads only; the entire input is checked before any CSV is returned. */
export async function readOrderReferenceCsv(
  ordersFile: string = resolve(import.meta.dirname, '../data/orders.json'),
): Promise<string> {
  let contents: string;
  try {
    contents = await readFile(ordersFile, 'utf8');
  } catch (error) {
    const code = error instanceof Error && 'code' in error && typeof error.code === 'string'
      ? ` (${error.code})` : '';
    throw new Error(`Cannot read orders file${code}.`, { cause: error });
  }

  let input: unknown;
  try {
    input = JSON.parse(contents);
  } catch {
    throw new TypeError('Orders file must contain valid JSON.');
  }
  return orderReferencesToCsv(input);
}
