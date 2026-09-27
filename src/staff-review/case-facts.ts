import { StaffCaseSchema, type IStaffCase, type IStaffCaseId } from './types.js';

// local fictional snapshots; no live order or carrier lookup occurs
export const STAFF_CASES: Record<IStaffCaseId, IStaffCase> = {
  'MH-205': StaffCaseSchema.parse({
    caseId: 'MH-205',
    orderId: 'MH-205',
    itemDescription: 'Lamp',
    snapshotOn: '2026-10-01',
    deliveredParcels: [{ label: 'Base carton', deliveredOn: '2026-09-26' }],
    missingParcel: {
      label: 'Shade carton',
      recordedScans: [{ description: 'Scanned at a transfer hub', occurredOn: '2026-09-25' }],
      deliveryScanOn: null,
      estimatedDeliveryBy: '2026-09-29',
    },
    customerReport: 'The shade is still missing.',
    requestsForStaff: { wantsReplacement: true, wantsShippingRefund: true },
  }),
  'MH-206': StaffCaseSchema.parse({
    caseId: 'MH-206',
    orderId: 'MH-206',
    itemDescription: 'Lamp',
    snapshotOn: '2026-10-01',
    deliveredParcels: [{ label: 'Base carton', deliveredOn: '2026-09-26' }],
    missingParcel: {
      label: 'Shade carton',
      recordedScans: [
        { description: 'Scanned at a transfer hub', occurredOn: '2026-09-25' },
        { description: 'Carrier delivery scan', occurredOn: '2026-09-30' },
      ],
      deliveryScanOn: '2026-09-30',
      estimatedDeliveryBy: '2026-09-29',
    },
    customerReport: 'The shade is still missing.',
    requestsForStaff: { wantsReplacement: true, wantsShippingRefund: false },
  }),
};
