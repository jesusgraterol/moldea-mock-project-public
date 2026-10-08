import { readRepositoryText } from "./agent.js";

export const mockRoutes = {
  "shipment": "shipment-explainer",
  "return": "returns-guide",
  "refund": "refund-reviewer",
  "address": "address-change-reviewer",
  "product": "catalog-advisor",
  "risk": "fraud-screener",
  "escalation": "escalation-coordinator",
  "accessibility": "accessibility-editor"
} as const;

/** Routing-facing metadata uses the target handoff description. */
export const loadMockHandoffDescription = async (agentId: string): Promise<string> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(agentId)) throw new Error("Invalid fixture agent ID");
  return readRepositoryText(`/moldea/agents/${agentId}/handoff-description.md`);
};

/** General agent catalog metadata uses the responsibility description. */
export const loadMockAgentDescription = async (agentId: string): Promise<string> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(agentId)) throw new Error("Invalid fixture agent ID");
  return readRepositoryText(`/moldea/agents/${agentId}/description.md`);
};
