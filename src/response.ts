import { AssistantError } from "./errors.js";
import { ModelResponseSchema, type LookupResult, type StaffResponse } from "./schemas.js";

export function groundResponse(value: unknown, lookup: LookupResult | null): StaffResponse {
  const parsed = ModelResponseSchema.safeParse(value);
  if (!parsed.success) {
    throw new AssistantError("INVALID_RESPONSE", "Model response violated the information-only schema; no answer was generated.");
  }
  const response = parsed.data;
  const expectedRecords = lookup?.records ?? [];
  const factualFieldsMatch = response.lookupStatus === (lookup?.status ?? "not_requested")
    && response.records.length === expectedRecords.length
    && response.records.every((record, index) => {
      const expected = expectedRecords[index];
      return expected && record.id === expected.id && record.name === expected.name
        && record.availability === expected.availability && record.source === expected.source;
    });
  const requiredFlags: StaffResponse["missingFacts"] = [];
  if (lookup?.status === "ambiguous" || lookup?.status === "not_found") requiredFlags.push("tool_identity");
  if (expectedRecords.some((record) => record.availability === "unknown")) requiredFlags.push("availability");
  const flagsMatch = requiredFlags.every((flag) => response.missingFacts.includes(flag))
    && response.missingFacts.every((flag) => flag === "due_date" || flag === "policy_details" || requiredFlags.includes(flag))
    && new Set(response.missingFacts).size === response.missingFacts.length;
  if (!factualFieldsMatch || !flagsMatch || (response.requestType === "tool_question" && !lookup)) {
    throw new AssistantError("UNGROUNDED_RESPONSE", "Model response did not match lookup evidence or omitted missing facts; ask staff to confirm manually.");
  }
  return response;
}

export function formatStaffResponse(response: StaffResponse): string {
  // Only validated fields are rendered. No unrestricted model prose is shown.
  const lines = ["Fictional records only; this is not live inventory."];
  if (response.requestType === "outside_scope") {
    lines.push("I can explain records and policy, but cannot reserve, approve, issue, or change a loan, or guarantee tool safety.");
  }
  if (response.lookupStatus === "ambiguous") {
    lines.push(`Multiple tools match: ${response.records.map((record) => `${record.name} (${record.id})`).join(", ")}. Staff must confirm which tool.`);
  } else if (response.lookupStatus === "not_found") {
    lines.push("No matching tool record was found. Staff must confirm the tool identity.");
  } else if (response.lookupStatus === "found") {
    for (const record of response.records) {
      const availability = record.availability === "unknown"
        ? "availability is unknown; staff must confirm it"
        : record.availability === "on_loan" ? "recorded as on loan" : "recorded as available";
      lines.push(`${record.name} (${record.id}): ${availability}. Source: ${record.source}.`);
    }
  }
  lines.push(`The standard loan period is ${response.loanPeriodDays} days. Staff approve every loan. Source: ${response.policySource}.`);
  if (response.missingFacts.includes("due_date")) lines.push("No due date is supplied; staff must confirm it.");
  if (response.missingFacts.includes("policy_details")) lines.push("Additional policy details are not supplied; staff must confirm them.");
  lines.push("Availability is not a safety assurance; tool safety has not been assessed.");
  return lines.join("\n");
}
