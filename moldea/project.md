# Lantern Loans

## Purpose and users

Lantern Loans is a small staff-facing TypeScript/LangGraph assistant project for
a community tool library. It helps library staff look up fictional tool records
and explain recorded availability and the fourteen-day loan policy.

## Goals

- Ground tool information in fictional checked-in records.
- Help staff explain availability and the fourteen-day loan period clearly.
- Flag missing, ambiguous, or conflicting facts instead of guessing.

## Authority and boundaries

- Staff approve every loan; the assistant provides information, not approval.
- The assistant must not reserve equipment or change loan records, including
  after a staff approval.
- The assistant must not promise that a tool is safe. Recorded availability is
  not a safety assurance.
- Do not invent missing availability information or loan-policy details beyond
  the established fourteen-day period. Identify what staff need to confirm.

## Operating scope

Keep the product local, using fictional checked-in records and no provider
credentials. The project uses npm and Node.js 24 or newer, with TypeScript and
LangGraph as the implementation stack.

## Assistant ownership

One model-coordinated LangGraph workflow owns staff-question interpretation,
read-only tool lookup, and grounded structured responses. The application
checks factual output against lookup evidence and renders explanations without
unrestricted model prose. The model boundary is injected; this local slice
includes credential-free connection tests, not a live-provider integration.

- [Staff assistant responsibility](agents/staff-assistant/description.md).
- [Maintained model instruction and loan authority](agents/staff-assistant/instruction.md).
- [Runtime connection, data access, and verification boundaries](runtimes/langgraph.md).

## Project-owned evidence

[The root README](../README.md) establishes the staff-facing purpose, intended
stack, local fictional-record scope, credential constraint, and toolchain.
The developer's requests establish missing-fact behavior and the staff-only
loan authority and prohibitions above. The developer's adopted policy update
establishes the current fourteen-day standard loan period.
