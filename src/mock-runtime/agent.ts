import { readFile } from "node:fs/promises";
import type { z } from "zod";

const repositoryRoot = new URL("../../", import.meta.url);

export const readRepositoryText = async (path: string): Promise<string> =>
  readFile(new URL(path.replace(/^\//, ""), repositoryRoot), "utf8");

export interface MockTool {
  readonly name: string;
  readonly inputSchema: z.ZodType;
  readonly outputSchema: z.ZodType;
  readonly execute: (input: unknown) => unknown;
}

export interface MockSkill {
  readonly name: string;
  readonly path: string;
}

export interface MockAgentDefinition {
  readonly id: string;
  readonly inputSchema: z.ZodType;
  readonly outputSchema: z.ZodType;
  readonly loadInstruction: () => Promise<string>;
  readonly variables: () => Readonly<Record<string, string>>;
  readonly tools: readonly MockTool[];
  readonly skills: readonly MockSkill[];
  readonly exampleOutputPath: string;
}

/** Validates local fixture input and returns a checked-in example; performs no provider call. */
export const createMockAgent = (definition: MockAgentDefinition) => ({
  ...definition,
  async preview(input: unknown) {
    definition.inputSchema.parse(input);
    const template = await definition.loadInstruction();
    const variables = definition.variables();
    const instruction = template.replace(/\{\{([A-Z][A-Z0-9_]*)\}\}/g, (_, name: string) => {
      const value = variables[name];
      if (value === undefined) throw new Error(`Missing fixture variable: ${name}`);
      return value;
    });
    const output = definition.outputSchema.parse(JSON.parse(await readRepositoryText(definition.exampleOutputPath)));
    return { fixtureOnly: true, agentId: definition.id, instruction, output };
  },
});
