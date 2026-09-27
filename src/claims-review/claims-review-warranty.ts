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
 * @returns The preliminary 12-month reporting-window classification.
 * @throws
 * - Warranty dates must be valid YYYY-MM-DD values.
 */
export const screenWarrantyReportingWindow = (
  invoiceDate: string,
  reportDate: string,
): WarrantyWindowScreen => {
  const invoice = parseDateOnly(invoiceDate);
  const report = parseDateOnly(reportDate);

  // a leap-day invoice has two plausible next-year anniversaries
  if (invoice.getUTCMonth() === 1 && invoice.getUTCDate() === 29) {
    const nextYear = invoice.getUTCFullYear() + 1;
    const februaryEnd = new Date(Date.UTC(nextYear, 1, 28));
    const marchStart = new Date(Date.UTC(nextYear, 2, 1));

    if (report.getTime() === februaryEnd.getTime() || report.getTime() === marchStart.getTime()) {
      return 'boundary-review';
    }

    return report >= invoice && report < februaryEnd ? 'within-period' : 'outside-period';
  }

  const anniversary = new Date(invoice);
  anniversary.setUTCFullYear(invoice.getUTCFullYear() + 1);

  if (report.getTime() === anniversary.getTime()) {
    return 'boundary-review';
  }

  return report >= invoice && report < anniversary ? 'within-period' : 'outside-period';
};
