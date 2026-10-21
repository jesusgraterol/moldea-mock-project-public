import type { EquipmentRequest, Handoff, HandoffFacts, InventoryRecord } from "./contracts.ts";

const UrgencyThresholdMs = 48 * 60 * 60 * 1000;

// ISO UTC inputs are already validated. Compare their whole seconds and decimal
// fractions separately so Date.parse cannot round a sub-millisecond boundary.
function compareUtc(left: string, right: string, offsetMs = 0): number {
  function parts(timestamp: string) {
    const dot = timestamp.indexOf(".");
    return dot === -1
      ? { whole: Date.parse(timestamp), fraction: "" }
      : { whole: Date.parse(`${timestamp.slice(0, dot)}Z`), fraction: timestamp.slice(dot + 1, -1) };
  }
  const a = parts(left);
  const b = parts(right);
  const difference = a.whole - b.whole - offsetMs;
  if (difference !== 0) return Math.sign(difference);
  const width = Math.max(a.fraction.length, b.fraction.length);
  const leftFraction = a.fraction.padEnd(width, "0");
  const rightFraction = b.fraction.padEnd(width, "0");
  return leftFraction === rightFraction ? 0 : leftFraction < rightFraction ? -1 : 1;
}

export function assessRequest(request: EquipmentRequest, record: InventoryRecord | null): HandoffFacts {
  const missingFacts: string[] = [];
  let recommendationAction: HandoffFacts["recommendationAction"] = "verify-inventory";

  if (record === null) {
    missingFacts.push(`No supplied inventory record matches item ${request.itemId}.`);
  } else {
    if (record.availability === "unknown") missingFacts.push("Inventory availability is unknown.");
    if (record.quantityAvailable === null) missingFacts.push("Available quantity has not been observed.");
    if (record.observedAt === null) {
      missingFacts.push("Inventory observation timestamp is missing.");
    } else if (compareUtc(record.observedAt, request.referenceAt) > 0) {
      missingFacts.push("Inventory observation is after the supplied reference timestamp.");
    }

    // Any missing observation keeps stock unknown, even if a raw label says available/unavailable.
    if (missingFacts.length === 0) {
      recommendationAction = record.availability === "available" && record.quantityAvailable !== null
        && record.quantityAvailable >= request.quantity ? "review-for-dispatch" : "do-not-dispatch";
    }
  }

  return {
    requestId: request.id,
    recommendationAction,
    supportingInventoryRecordIds: record === null ? [] : [record.id],
    missingFacts,
    // Overdue requests also remain urgent; no host clock or rounding is involved.
    urgency: compareUtc(request.neededAt, request.referenceAt, UrgencyThresholdMs) <= 0 ? "urgent" : "routine",
    requiresStaffApproval: true,
  };
}

export function assertGroundedHandoff(handoff: Handoff, facts: HandoffFacts): void {
  if (handoff.requestId !== facts.requestId
    || handoff.recommendation.action !== facts.recommendationAction
    || handoff.urgency !== facts.urgency
    || JSON.stringify(handoff.supportingInventoryRecordIds) !== JSON.stringify(facts.supportingInventoryRecordIds)
    || JSON.stringify(handoff.missingFacts) !== JSON.stringify(facts.missingFacts)) {
    throw new Error("Handoff contradicts the supplied request or inventory evidence.");
  }
}
