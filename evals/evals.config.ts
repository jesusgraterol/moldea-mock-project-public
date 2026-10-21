import { defineEvalConfig } from 'eve/evals';

// No judge, reporters, tool stubs, provider credentials, or external services.
export default defineEvalConfig({ maxConcurrency: 1, timeoutMs: 30_000 });
