import { checkAvailability, type IAvailabilityRequest } from '../src/availability/index.ts';

// fictional snapshots from records/equipment.csv, repairs.csv, reservations.csv, and safety-checks.csv
const request: IAvailabilityRequest = {
  equipment: { id: 'TL-S03', name: 'Canister stove' },
  pickupOn: '2026-10-24',
  returnOn: '2026-10-27',
  reservations: [
    {
      id: 'RS-271',
      equipmentId: 'TL-P08',
      pickupOn: '2026-10-23',
      returnOn: '2026-10-26',
      status: 'confirmed',
    },
  ],
  repairs: [
    { id: 'RR-91', equipmentId: 'TL-T12', issue: 'Broken pole sleeve', completedAt: null },
    {
      id: 'RR-92',
      equipmentId: 'TL-S03',
      issue: 'Loose fuel valve',
      completedAt: '2026-10-21T14:00:00.000Z',
    },
  ],
  safetyChecks: [],
};

console.log(checkAvailability(request));
console.log(
  checkAvailability({
    ...request,
    safetyChecks: [
      { id: 'SC-01', equipmentId: 'TL-S03', recordedAt: '2026-10-21T14:05:00.000Z' },
    ],
  }),
);
