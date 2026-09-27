// item and desk-record snapshots supplied by the caller; this module does not load records
export interface IEquipment {
  id: string;
  name: string;
}

export interface IReservation {
  id: string;
  equipmentId: string;
  pickupOn: string;
  returnOn: string;
  status: string;
}

export interface IRepair {
  id: string;
  equipmentId: string;
  issue: string;
  completedAt: string | null;
}

export interface ISafetyCheck {
  id: string;
  equipmentId: string;
  recordedAt: string;
}

export interface IAvailabilityRequest {
  equipment: IEquipment;
  pickupOn: string;
  returnOn: string;
  reservations: readonly IReservation[];
  repairs: readonly IRepair[];
  safetyChecks: readonly ISafetyCheck[];
}

export interface IAvailabilityDecision {
  available: boolean;
  explanation: string;
}

const isValidDate = (date: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
};

const requireDateRange = (pickupOn: string, returnOn: string): void => {
  if (!isValidDate(pickupOn) || !isValidDate(returnOn) || pickupOn >= returnOn) {
    throw new RangeError('Pickup and return must be valid dates with pickup before return');
  }
};

const requireUtcTimestamp = (timestamp: string): void => {
  const isCanonicalUtc = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(timestamp);
  const parsed = new Date(timestamp);

  if (
    !isCanonicalUtc ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString() !== timestamp
  ) {
    throw new RangeError('Repair completion and safety check times must be valid UTC timestamps');
  }
};

/**
 * Explains whether desk records block a specific item for a half-open rental date range.
 * @param request The item, requested dates, and complete current records relevant to that item.
 * @returns The availability decision and a staff-readable explanation.
 * @throws A RangeError if relevant rental dates or repair and check timestamps are invalid.
 */
export const checkAvailability = (request: IAvailabilityRequest): IAvailabilityDecision => {
  const { equipment, pickupOn, returnOn, reservations, repairs, safetyChecks } = request;
  requireDateRange(pickupOn, returnOn);

  const reasons: string[] = [];
  let latestCompletedRepair: { id: string; completedAt: string } | undefined;

  for (const repair of repairs) {
    if (repair.equipmentId !== equipment.id) continue;

    if (repair.completedAt === null) {
      reasons.push(`Open repair ${repair.id}: ${repair.issue}`);
      continue;
    }

    requireUtcTimestamp(repair.completedAt);
    if (
      latestCompletedRepair === undefined ||
      repair.completedAt > latestCompletedRepair.completedAt
    ) {
      latestCompletedRepair = { id: repair.id, completedAt: repair.completedAt };
    }
  }

  let hasLaterSafetyCheck = false;
  for (const safetyCheck of safetyChecks) {
    if (safetyCheck.equipmentId !== equipment.id) continue;

    requireUtcTimestamp(safetyCheck.recordedAt);
    if (latestCompletedRepair && safetyCheck.recordedAt > latestCompletedRepair.completedAt) {
      hasLaterSafetyCheck = true;
    }
  }

  if (latestCompletedRepair && !hasLaterSafetyCheck) {
    reasons.push(`Completed repair ${latestCompletedRepair.id} needs a later safety check`);
  }

  for (const reservation of reservations) {
    if (reservation.equipmentId !== equipment.id || reservation.status !== 'confirmed') continue;

    requireDateRange(reservation.pickupOn, reservation.returnOn);
    if (pickupOn < reservation.returnOn && reservation.pickupOn < returnOn) {
      reasons.push(
        `Confirmed reservation ${reservation.id} overlaps ${reservation.pickupOn} to ${reservation.returnOn}`,
      );
    }
  }

  if (reasons.length > 0) {
    return { available: false, explanation: `${equipment.name} is unavailable: ${reasons.join('; ')}.` };
  }

  return { available: true, explanation: `${equipment.name} is available for the requested dates.` };
};
