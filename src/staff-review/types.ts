import { z } from 'zod';

// local fictional cases supported by the read-only staff lookup
export const StaffCaseIdSchema = z.enum(['MH-205', 'MH-206']);

// recorded case facts are not live order or carrier data
export const StaffCaseSchema = z.strictObject({
  caseId: StaffCaseIdSchema,
  orderId: z.string().trim().min(1).max(64),
  itemDescription: z.string().trim().min(1).max(160),
  snapshotOn: z.iso.date(),
  deliveredParcels: z.array(
    z.strictObject({
      label: z.string().trim().min(1).max(80),
      deliveredOn: z.iso.date(),
    }),
  ).max(8),
  missingParcel: z.strictObject({
    label: z.string().trim().min(1).max(80),
    recordedScans: z.array(
      z.strictObject({
        description: z.string().trim().min(1).max(160),
        occurredOn: z.iso.date(),
      }),
    ).max(8),
    deliveryScanOn: z.iso.date().nullable(),
    estimatedDeliveryBy: z.iso.date().nullable(),
  }),
  customerReport: z.string().trim().min(1).max(500),
  requestsForStaff: z.strictObject({
    wantsReplacement: z.boolean(),
    wantsShippingRefund: z.boolean(),
  }),
});

// model-supplied lookup input is limited to the local case catalog
export const LookupRoutingNoteInputSchema = z.strictObject({
  caseId: StaffCaseIdSchema.meta({ description: 'The fictional staff case to review.' }),
});

// the policy tool returns a reviewable note, not an approved customer remedy
export const StaffRoutingNoteSchema = StaffCaseSchema.extend({
  recommendedQueue: z.enum(['parcel-investigation', 'shipment-support', 'case-triage']),
  routingReason: z.string(),
  unknowns: z.array(z.string()),
});

export type IStaffCaseId = z.infer<typeof StaffCaseIdSchema>;
export type IStaffCase = z.infer<typeof StaffCaseSchema>;
export type ILookupRoutingNoteInput = z.infer<typeof LookupRoutingNoteInputSchema>;
export type IStaffRoutingNote = z.infer<typeof StaffRoutingNoteSchema>;
export type IStaffReviewQueue = IStaffRoutingNote['recommendedQueue'];
