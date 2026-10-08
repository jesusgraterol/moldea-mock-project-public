import { createMockAgent } from "../../mock-runtime/agent.js";
import { CatalogAdvisorInputSchema, CatalogAdvisorOutputSchema } from "./schemas.js";
import { loadCatalogAdvisorInstruction } from "./instructions.js";
import { provideFixtureVariables } from "./variables.js";
import { searchCatalogTool } from "../../mock-tools/search-catalog.js";
import { readProductDetailsTool } from "../../mock-tools/read-product-details.js";

export const registeredTools = [searchCatalogTool, readProductDetailsTool];
export const registeredSkills = [
  {
    "name": "catalog-comparison",
    "path": "/fixtures/skills/catalog-comparison/SKILL.md"
  }
];

/** Inert explorer example: canonical policy plus predetermined local output. */
export const catalogAdvisorAgent = createMockAgent({
  id: "catalog-advisor",
  inputSchema: CatalogAdvisorInputSchema,
  outputSchema: CatalogAdvisorOutputSchema,
  loadInstruction: loadCatalogAdvisorInstruction,
  variables: provideFixtureVariables,
  tools: registeredTools,
  skills: registeredSkills,
  exampleOutputPath: "/fixtures/explorer/agents/catalog-advisor/output.json",
});
