import { readRepositoryText } from "../../mock-runtime/agent.js";

/** Reads the declared exact fixture mirror. */
export const loadDeliveryInvestigatorInstruction = (): Promise<string> =>
  readRepositoryText("/fixtures/instruction-mirrors/delivery-investigator.md");
