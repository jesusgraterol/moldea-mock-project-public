function requireEvidence(source, passage, path) {
  if (!source.includes(passage)) {
    throw new Error(`Evidence changed in ${path}: expected passage missing: ${passage}`);
  }
}

export function reviewEquipment(caseReport, catalog) {
  requireEvidence(caseReport, 'the door revision on the label is unreadable', 'records/hs-214.md');
  requireEvidence(caseReport, 'HC240-24-0816', 'records/hs-214.md');
  requireEvidence(caseReport, 'has not supplied a measured cabinet temperature', 'records/hs-214.md');
  requireEvidence(caseReport, 'moisture appeared after staff cleaned the door', 'records/hs-214.md');
  requireEvidence(catalog, 'The `GS-240-A` gasket fits the original Rev A channel', 'catalog/hc-240.md');
  requireEvidence(catalog, 'The `GS-240-B` gasket fits the later Rev B channel', 'catalog/hc-240.md');
  requireEvidence(catalog, 'doors may have been replaced in service', 'catalog/hc-240.md');
  requireEvidence(catalog, 'The reported timing after cleaning does not identify a cause', 'catalog/hc-240.md');

  return {
    id: 'equipment',
    name: 'Equipment desk',
    scope: 'Fit and reported symptoms',
    state: 'Needs evidence',
    findings: [
      { text: 'The dealer photo identifies an HC-240, serial HC240-24-0816, but its door revision is unreadable.', source: 'records/hs-214.md' },
      { text: 'GS-240-A fits Rev A and GS-240-B fits Rev B. Model and serial alone cannot establish the installed door, because service replacements are possible.', source: 'catalog/hc-240.md' },
      { text: 'Door-edge moisture began after cleaning, according to the store. That timing does not establish a cause; no measured cabinet temperature was supplied.', source: 'records/hs-214.md · catalog/hc-240.md' }
    ],
    questions: [
      'Can the dealer send a clear door-label or gasket-channel photo to establish the revision?',
      'What is the measured cabinet temperature, and is the cabinet holding the store’s required safe temperature?'
    ],
    internalNote: 'If the cabinet is not holding a safe temperature, flag the store’s food-safety and equipment-escalation procedures. No diagnosis or repair instruction is established here.',
    handoff: {
      statement: 'We need to confirm the door assembly revision before recommending a gasket kit. The model and serial alone do not establish which kit fits.',
      request: 'Please send a clear photo of the door label or gasket channel and a measured cabinet temperature.'
    }
  };
}

export function reviewClaims(caseReport, claims, warranty) {
  requireEvidence(caseReport, '27 September 2026', 'records/hs-214.md');
  requireEvidence(claims, '12 January 2026', 'records/hs-214-claims.md');
  requireEvidence(claims, 'authorized dealer', 'records/hs-214-claims.md');
  requireEvidence(claims, 'tear near the lower corner', 'records/hs-214-claims.md');
  requireEvidence(claims, 'there is no evidence establishing what caused the tear', 'records/hs-214-claims.md');
  requireEvidence(warranty, 'manufacturing defects reported within 12 months of the invoice', 'policies/parts-warranty.md');
  requireEvidence(warranty, 'Documented cleaning damage is excluded', 'policies/parts-warranty.md');

  return {
    id: 'claims',
    name: 'Claims desk',
    scope: 'Warranty and claim evidence',
    state: 'Assessment open',
    findings: [
      { text: 'An authorized-dealer invoice dated 12 January 2026 was supplied. The 27 September report falls within the policy’s 12-month reporting period.', source: 'records/hs-214-claims.md · policies/parts-warranty.md' },
      { text: 'A tear near the gasket’s lower corner was reported. The evidence does not establish manufacturing defect or cleaning damage.', source: 'records/hs-214-claims.md' },
      { text: 'The policy covers manufacturing defects and excludes documented cleaning damage. Staff must decide whether this individual claim qualifies.', source: 'policies/parts-warranty.md' }
    ],
    questions: [
      'What evidence establishes the cause of the tear?',
      'Has claims staff completed the eligibility decision?'
    ],
    handoff: {
      statement: 'We have the invoice and report of a torn gasket. Our claims team will assess eligibility; warranty coverage has not been confirmed.',
      request: 'If available, please include a clear photo of the torn area.'
    }
  };
}

export function reviewFulfillment(fulfillment) {
  requireEvidence(fulfillment, '26 September 2026', 'records/hs-214-fulfillment.md');
  requireEvidence(fulfillment, 'four `GS-240-B` kits at the East depot', 'records/hs-214-fulfillment.md');
  requireEvidence(fulfillment, 'none reserved for HS-214', 'records/hs-214-fulfillment.md');
  requireEvidence(fulfillment, 'three to five business days after dispatch', 'records/hs-214-fulfillment.md');
  requireEvidence(fulfillment, 'does not establish current availability or a dispatch date', 'records/hs-214-fulfillment.md');

  return {
    id: 'fulfillment',
    name: 'Fulfillment desk',
    scope: 'Stock and shipment',
    state: 'Confirmation needed',
    findings: [
      { text: 'The 26 September snapshot listed four GS-240-B kits at the East depot; none was reserved for HS-214.', source: 'records/hs-214-fulfillment.md' },
      { text: 'The normal route takes roughly three to five business days after dispatch. The snapshot does not establish current availability or a dispatch date.', source: 'records/hs-214-fulfillment.md' }
    ],
    questions: [
      'Which kit is needed once the door revision is confirmed?',
      'What is current stock, and can a kit be reserved?',
      'What dispatch date and delivery estimate can staff actually confirm?'
    ],
    handoff: {
      statement: 'Once the correct kit is identified, we will confirm availability and shipment timing. The available record does not confirm a reservation or dispatch date for this case.',
      request: null
    }
  };
}
