import type { IStaffCase, IStaffRoutingNote, IStaffReviewQueue } from './types.js';

// local prototype policy; staff retain the final routing decision
const REVIEW_QUEUES = {
  ConflictingDelivery: 'case-triage',
  PassedEstimate: 'parcel-investigation',
  MissingParcel: 'shipment-support',
} as const satisfies Record<string, IStaffReviewQueue>;

/** Builds a staff routing note without approving or performing customer remedies. */
export const buildRoutingNote = (staffCase: IStaffCase): IStaffRoutingNote => {
  const { missingParcel, snapshotOn } = staffCase;
  let recommendedQueue: IStaffReviewQueue = REVIEW_QUEUES.MissingParcel;
  let routingReason = 'The customer reports a missing parcel without a recorded delivery.';

  if (missingParcel.deliveryScanOn !== null) {
    recommendedQueue = REVIEW_QUEUES.ConflictingDelivery;
    routingReason =
      'The customer report conflicts with a recorded delivery scan; staff should reconcile the facts.';
  } else if (
    missingParcel.estimatedDeliveryBy !== null &&
    missingParcel.estimatedDeliveryBy < snapshotOn
  ) {
    recommendedQueue = REVIEW_QUEUES.PassedEstimate;
    routingReason =
      'The carrier estimate has passed and no delivery scan is recorded in the snapshot.';
  }

  const unknowns =
    missingParcel.deliveryScanOn === null
      ? [
          'Current location after the last recorded scan',
          'Whether delivery occurred after the snapshot date',
        ]
      : ['Why the customer reports the parcel missing despite the recorded delivery scan'];

  return {
    orderId: staffCase.orderId,
    snapshotOn,
    missingParcel,
    deliveredParcels: staffCase.deliveredParcels,
    customerReport: staffCase.customerReport,
    requestsForStaff: staffCase.requestsForStaff,
    recommendedQueue,
    routingReason,
    unknowns,
  };
};
