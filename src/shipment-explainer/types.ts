import { z } from 'zod';

// carrier scans may provide a date without a time
const CarrierScanOccurrenceSchema = z.union([z.iso.date(), z.iso.datetime({ offset: true })]);

// the closed snapshot contract keeps unrelated customer data out of model input
export const ShipmentSnapshotSchema = z.strictObject({
  reference: z.string().trim().min(1).max(64),
  carrier: z.string().trim().min(1).max(128),
  snapshotTakenAt: z.iso.datetime({ offset: true }),
  estimatedDeliveryDate: z.iso.date().nullable(),
  scans: z
    .array(
      z.strictObject({
        occurredAt: CarrierScanOccurrenceSchema,
        description: z.string().trim().min(1).max(256),
      }),
    )
    .max(64),
  unknowns: z.array(z.string().trim().min(1).max(256)).max(16),
});

export type IShipmentSnapshot = z.infer<typeof ShipmentSnapshotSchema>;
