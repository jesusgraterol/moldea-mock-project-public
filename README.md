# Aster Dispatch

Aster Dispatch helps a fictional events team review equipment requests. One assistant looks up supplied inventory records and drafts a structured staff handoff. Staff approve every dispatch; the assistant cannot reserve equipment, change inventory, or promise that an item is safe.

## Product facts

Requests needed within 24 hours of the supplied reference timestamp are urgent, including the exact 24-hour boundary. Use supplied UTC timestamps rather than the computer clock. Inventory availability may be available, unavailable, or unknown. Unknown stock or missing observations must stay unknown. A staff handoff separates its recommendation, supporting record identifiers, missing facts, and required staff approval.

The files under data/ are fictional inputs. Treat their record identifiers and observations as evidence; do not invent a newer stock check or a missing item. The assistant has one read-only inventory lookup.

## Local development

Use npm, Node.js 24, and TypeScript. The selected runtime is @langchain/langgraph 1.5.1 with @langchain/core 1.2.20. Use Zod 4.6.5, TypeScript 6.0.3, and @types/node 24.12.0 when adding the corresponding dependencies. Keep exact declarations and the ordinary npm lockfile; disable dependency lifecycle scripts.

Use focused native tests and typechecking. Exercise real SDK and project code with only the external model boundary controlled. The examples require no provider credentials or live model calls, and no operational equipment system is connected.
