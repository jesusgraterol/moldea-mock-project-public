export const TURNAROUND_MINUTES = 30;
const turnaroundMs = TURNAROUND_MINUTES * 60_000;

function checkRoom(room, request, bookings) {
  const reasons = [];
  if (room.capacity < request.attendees) {
    reasons.push({ code: 'capacity', capacity: room.capacity, attendees: request.attendees });
  }
  const missing = request.equipment.filter((item) => !room.equipment.includes(item));
  if (missing.length > 0) reasons.push({ code: 'equipment', missing });

  const start = Date.parse(request.start);
  const end = Date.parse(request.end);
  for (const booking of bookings) {
    if (booking.roomId !== room.id) continue;
    const bookedStart = Date.parse(booking.start);
    const bookedEnd = Date.parse(booking.end);
    if (start < bookedEnd && end > bookedStart) {
      reasons.push({ code: 'overlap', booking });
    } else {
      const gapMs = end <= bookedStart ? bookedStart - end : start - bookedEnd;
      if (gapMs < turnaroundMs) reasons.push({ code: 'turnaround', booking, gapMs });
    }
  }
  return { room, reasons };
}

// Inputs must have passed validation. Requests never become bookings for later requests.
export function planAvailability({ rooms, bookings, requests }) {
  return requests.map((request) => ({
    request,
    rooms: rooms.map((room) => checkRoom(room, request, bookings)),
  }));
}
