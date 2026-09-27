import { checkAvailability, type IAvailabilityRequest } from '../src/availability/index.ts';

// fictional snapshots from records/equipment.csv, repairs.csv, and reservations.csv
const request: IAvailabilityRequest = {
  equipment: { id: 'TL-T12', name: 'Three-person alpine tent' },
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
    { id: 'RR-91', equipmentId: 'TL-T12', issue: 'Broken pole sleeve', completedOn: null },
    { id: 'RR-92', equipmentId: 'TL-S03', issue: 'Loose fuel valve', completedOn: '2026-10-21' },
  ],
};

console.log(checkAvailability(request));
