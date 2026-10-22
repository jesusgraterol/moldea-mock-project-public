// loan periods in days by tool category
export const LOAN_DAYS = { hand: 7, power: 3 };

// most tools a member may hold at once
export const MAX_ACTIVE_LOANS = 3;

// days overdue after which a member is suspended
export const SUSPENSION_OVERDUE_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns the due date for a tool lent on the given day. */
export const dueDate = (tool, lentOn) => {
  const days = LOAN_DAYS[tool.category];
  if (days === undefined) throw new Error(`Unknown tool category: ${tool.category}`);
  return new Date(lentOn.getTime() + days * DAY_MS);
};

/** Returns how many whole days a loan is overdue on the given day, or 0. */
export const daysOverdue = (loan, today) =>
  Math.max(0, Math.floor((today.getTime() - loan.dueOn.getTime()) / DAY_MS));

/** Decides whether a member may borrow another tool. */
export const canBorrow = (activeLoans, today) => {
  if (activeLoans.length >= MAX_ACTIVE_LOANS) return { allowed: false, reason: 'limit' };
  if (activeLoans.some((loan) => daysOverdue(loan, today) > SUSPENSION_OVERDUE_DAYS)) {
    return { allowed: false, reason: 'suspended' };
  }
  return { allowed: true, reason: null };
};
