// source files and canonical instruction supplied to the draft invoker
export interface IDealerReplyInvocation {
  instructions: string;
  caseSource: {
    path: '/records/hs-214.md';
    markdown: string;
  };
  productSource: {
    path: '/catalog/hc-240.md';
    markdown: string;
  };
}

// staff-facing result of the current source-only invocation
export interface IDealerReplyResult {
  mode: 'deterministic-preview';
  dealerDraft: string;
  verificationNotes: string[];
}

// replaceable invocation boundary; no provider implementation is installed
export type IDealerReplyInvoker = (
  invocation: IDealerReplyInvocation,
) => Promise<IDealerReplyResult>;

// staff invokes the prepared HS-214 capability through this boundary
export interface IDealerReplyAgent {
  /**
   * Loads the current instruction and sources, then invokes the draft boundary.
   * @returns The staff-reviewable dealer draft and verification notes.
   * @throws
   * - The dealer-reply instruction is empty.
   * - An HS-214 source is empty.
   * - An HS-214 preview input changed and must be reviewed.
   */
  invoke(): Promise<IDealerReplyResult>;
}
