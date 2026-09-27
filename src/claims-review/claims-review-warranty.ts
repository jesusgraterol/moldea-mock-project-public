// preliminary reporting-period result; staff still decide claim qualification
type WarrantyWindowScreen = 'within-period' | 'outside-period' | 'boundary-review';

const parseDateOnly = (dateText: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    throw new Error('Warranty dates must be valid YYYY-MM-DD values.');
  }

  const date = new Date(`${dateText}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateText) {
    throw new Error('Warranty dates must be valid YYYY-MM-DD values.');
  }

  return date;
};

/**
 * Screens the reporting period without deciding defect cause or claim eligibility.
 * @param invoiceDate The invoice date in YYYY-MM-DD form.
 * @param reportDate The date the defect was reported in YYYY-MM-DD form.
 * @param reportingMonths The applicable 12- or 18-month policy window.
 * @returns The preliminary reporting-window classification.
 * @throws
 * - Warranty dates must be valid YYYY-MM-DD values.
 */
export const screenWarrantyReportingWindow = (
  invoiceDate: string,
  reportDate: string,
  reportingMonths: 12 | 18,
): WarrantyWindowScreen => {
  const invoice = parseDateOnly(invoiceDate);
  const report = parseDateOnly(reportDate);

  const targetMonthIndex =
    invoice.getUTCFullYear() * 12 + invoice.getUTCMonth() + reportingMonths;
  const targetYear = Math.floor(targetMonthIndex / 12);
  const targetMonth = targetMonthIndex % 12;
  const lastTargetDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const anniversary = new Date(
    Date.UTC(targetYear, targetMonth, Math.min(invoice.getUTCDate(), lastTargetDay)),
  );

  if (report.getTime() === anniversary.getTime()) {
    return 'boundary-review';
  }

  // a missing target day leaves the last day and following first day for staff interpretation
  if (invoice.getUTCDate() > lastTargetDay) {
    const nextMonthStart = new Date(Date.UTC(targetYear, targetMonth + 1, 1));

    if (report.getTime() === nextMonthStart.getTime()) {
      return 'boundary-review';
    }
  }

  return report >= invoice && report < anniversary ? 'within-period' : 'outside-period';
};
