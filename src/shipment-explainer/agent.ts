import OpenAI from "openai";
import { z } from "zod";

import { loadShipmentExplainerInstruction } from "./instructions.js";
import { ShipmentSnapshotSchema } from "./types.js";

const ModelIdentifierSchema = z.string().trim().min(1);

/**
 * Requests a staff-reviewable shipment explanation from a validated snapshot.
 * @param model The caller-selected OpenAI model identifier.
 * @param snapshot The caller-supplied tracking snapshot.
 * @returns The model's draft text, without sending it to a customer.
 */
export const draftShipmentExplanation = async (
  model: string,
  snapshot: unknown,
): Promise<string> => {
  const validatedModel = ModelIdentifierSchema.parse(model);
  const validatedSnapshot = ShipmentSnapshotSchema.parse(snapshot);
  const client = new OpenAI();

  const response = await client.responses.create({
    model: validatedModel,
    // instructions: await loadShipmentExplainerInstruction(),
    instructions: "test instructions",
    input: JSON.stringify(validatedSnapshot),
    store: false,
  });

  return response.output_text;
};
