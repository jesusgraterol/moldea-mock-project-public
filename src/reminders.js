import { daysOverdue } from './loan-policy.js';

// days after the due date on which overdue notes go out
export const OVERDUE_NOTE_DAYS = [1, 7];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns the reminder note to send on the given day, or null when none is due. */
export const reminderFor = (loan, today) => {
  const daysUntilDue = Math.round((loan.dueOn.getTime() - today.getTime()) / DAY_MS);
  if (daysUntilDue === 1) {
    return `Hi ${loan.member}, a reminder that the ${loan.tool} is due back tomorrow.`;
  }
  const overdue = daysOverdue(loan, today);
  if (OVERDUE_NOTE_DAYS.includes(overdue)) {
    return `Hi ${loan.member}, the ${loan.tool} is ${overdue} day${overdue === 1 ? '' : 's'} overdue. Please bring it back to the desk.`;
  }
  return null;
};
