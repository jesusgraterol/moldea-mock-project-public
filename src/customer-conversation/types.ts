import { z } from 'zod';

// caller-supplied facts for one order snapshot, not an authoritative order record
export const OrderSnapshotSchema = z.strictObject({
  orderId: z.string().trim().min(1).max(64),
  itemDescription: z.string().trim().min(1).max(160),
  capturedAt: z.iso.datetime(),
  parcels: z.array(
    z.strictObject({
      label: z.string().trim().min(1).max(80),
      lastRecordedScan: z.strictObject({
        description: z.string().trim().min(1).max(160),
        occurredOn: z.iso.date(),
      }).nullable(),
      deliveryScanOn: z.iso.date().nullable(),
      estimatedDeliveryBy: z.iso.date().nullable(),
    }),
  ).min(1).max(8),
});

export type IOrderSnapshot = z.infer<typeof OrderSnapshotSchema>;
