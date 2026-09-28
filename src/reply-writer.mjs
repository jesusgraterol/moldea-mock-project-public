const requiredDesks = ['equipment', 'claims', 'fulfillment'];

// This module accepts reviewed desk handoffs only. It never receives source files.
export function buildReplyPreview(reviews) {
  const byDesk = new Map(reviews.map((review) => [review.id, review]));
  for (const id of requiredDesks) {
    if (!byDesk.has(id) || !byDesk.get(id).handoff?.statement) {
      throw new Error(`Missing ${id} desk handoff`);
    }
  }

  const equipment = byDesk.get('equipment').handoff;
  const claims = byDesk.get('claims').handoff;
  const fulfillment = byDesk.get('fulfillment').handoff;

  return {
    status: 'Preview only · manager approval required',
    recipient: 'Ridgeway Foodservice',
    subject: 'HS-214 · HC-240 door gasket inquiry',
    paragraphs: [
      'Hello Ridgeway team,',
      'Thank you for the update about Goldfinch Market’s HC-240.',
      equipment.statement,
      claims.statement,
      fulfillment.statement,
      [equipment.request, claims.request, fulfillment.request].filter(Boolean).join(' '),
      'We will review the additional information and follow up after our staff and manager have confirmed the next step.',
      'Harbor Supply'
    ]
  };
}
