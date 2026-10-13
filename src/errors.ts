export class AssistantError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "AssistantError";
  }
}
