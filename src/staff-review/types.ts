import { z } from 'zod';

// a staff-supplied case snapshot and customer report, not verified order state
export const StaffCaseSchema = z.strictObject({
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
    lastRecordedScan: z.strictObject({
      description: z.string().trim().min(1).max(160),
      occurredOn: z.iso.date(),
    }).nullable(),
    deliveryScanOn: z.iso.date().nullable(),
    estimatedDeliveryBy: z.iso.date().nullable(),
  }),
  customerReport: z.string().trim().min(1).max(500),
  requestsForStaff: z.strictObject({
    wantsReplacement: z.boolean(),
    wantsShippingRefund: z.boolean(),
  }),
});

export type IStaffCase = z.infer<typeof StaffCaseSchema>;

// prototype queue identifiers are local recommendations, not live queue integration
export type IStaffReviewQueue = 'parcel-investigation' | 'shipment-support' | 'case-triage';

// structured note transmitted alongside the conversational answer
export interface IStaffRoutingNote {
  orderId: string;
  snapshotOn: string;
  missingParcel: IStaffCase['missingParcel'];
  deliveredParcels: IStaffCase['deliveredParcels'];
  customerReport: string;
  requestsForStaff: IStaffCase['requestsForStaff'];
  recommendedQueue: IStaffReviewQueue;
  routingReason: string;
  unknowns: string[];
}
