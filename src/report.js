import { TURNAROUND_MINUTES } from './booking-rules.js';

function roomLabel(room) {
  return `${room.name} (${room.id})`;
}

function explain(reason) {
  switch (reason.code) {
    case 'capacity':
      return `insufficient capacity: ${reason.capacity} seats, ${reason.attendees} required`;
    case 'equipment':
      return `missing equipment: ${reason.missing.join(', ')}`;
    case 'overlap':
      return `overlaps booking ${reason.booking.id} (${reason.booking.start} to ${reason.booking.end})`;
    case 'turnaround':
      return `only ${reason.gapMs / 1000}s turnaround with booking ${reason.booking.id}; at least ${TURNAROUND_MINUTES} minutes required`;
    default:
      throw new Error(`Unknown rejection reason: ${reason.code}`);
  }
}

export function formatReport(plans) {
  const lines = [
    'Cobalt Rooms availability report',
    'Suggestions only. Coordinators must approve every booking; no reservations are created.',
    'Each request is evaluated independently against the supplied bookings.',
  ];
  if (plans.length === 0) lines.push('', 'No requests supplied.');
  for (const { request, rooms } of plans) {
    const suitable = rooms.filter(({ reasons }) => reasons.length === 0);
    const rejected = rooms.filter(({ reasons }) => reasons.length > 0);
    lines.push(
      '',
      `Request ${request.id}: ${request.start} to ${request.end}`,
      `Attendees: ${request.attendees}; equipment: ${request.equipment.join(', ') || 'none'}.`,
      suitable.length > 0
        ? `Suitable rooms: ${suitable.map(({ room }) => roomLabel(room)).join(', ')}.`
        : 'Suitable rooms: none (no room meets all requirements).',
    );
    if (rooms.length === 0) lines.push('No rooms supplied.');
    if (rejected.length === 0) {
      lines.push('Rejected rooms: none.');
    } else {
      lines.push('Rejected rooms:');
      for (const { room, reasons } of rejected) {
        lines.push(`- ${roomLabel(room)}: ${reasons.map(explain).join('; ')}.`);
      }
    }
  }
  return lines.join('\n');
}
