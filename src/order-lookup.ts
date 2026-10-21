import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { OrderRecordSchema, type OrderLookupResult } from './contracts.ts';

const defaultOrdersFile = resolve(import.meta.dirname, '../data/orders.json');

/** Reads fictional local records only. No writes or operational integrations. */
export async function lookupOrder(
  orderId: string,
  ordersFile: string = defaultOrdersFile,
): Promise<OrderLookupResult> {
  try {
    const data: unknown = JSON.parse(await readFile(ordersFile, 'utf8'));
    const parsed = OrderRecordSchema.array().safeParse(data);
    if (!parsed.success) return { status: 'unavailable', order: null };

    const matches = parsed.data.filter((order) => order.id === orderId);
    if (matches.length > 1) return { status: 'unavailable', order: null };
    const order = matches[0];
    return order ? { status: 'found', order } : { status: 'not_found', order: null };
  } catch {
    // A read/JSON failure is not evidence that an order does not exist.
    return { status: 'unavailable', order: null };
  }
}
