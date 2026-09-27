import { STAFF_CASES } from './case-facts.js';
import type {
  ILookupRoutingNoteInput,
  IStaffCase,
  IStaffReviewQueue,
  IStaffRoutingNote,
} from './types.js';

// local prototype policy; staff retain the final routing decision
const REVIEW_QUEUES = {
  ConflictingDelivery: 'case-triage',
  PassedEstimate: 'parcel-investigation',
  MissingParcel: 'shipment-support',
} as const satisfies Record<string, IStaffReviewQueue>;

/** Builds a structured routing note without approving or performing customer remedies. */
export const buildRoutingNote = (staffCase: IStaffCase): IStaffRoutingNote => {
  const { missingParcel, snapshotOn } = staffCase;
  let recommendedQueue: IStaffReviewQueue = REVIEW_QUEUES.MissingParcel;
  let routingReason = 'The customer reports a missing parcel without a recorded delivery scan.';

  if (missingParcel.deliveryScanOn !== null) {
    recommendedQueue = REVIEW_QUEUES.ConflictingDelivery;
    routingReason =
      `A carrier delivery scan on ${missingParcel.deliveryScanOn} conflicts with the customer report; the scan does not establish receipt.`;
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
      : [
          'Whether the customer received the shade despite the carrier delivery scan',
          'Where the shade carton is now',
        ];

  return { ...staffCase, recommendedQueue, routingReason, unknowns };
};

/** Looks up one fictional case and applies the read-only local routing policy on demand. */
export const lookupRoutingNote = ({ caseId }: ILookupRoutingNoteInput): IStaffRoutingNote =>
  buildRoutingNote(STAFF_CASES[caseId]);
