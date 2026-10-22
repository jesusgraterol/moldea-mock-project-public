/** Formats a dish price in cents as a menu label, rounding up to the nearest 50 cents. */
export const priceLabel = (cents) => {
  if (cents === null) return 'Market price';
  if (!Number.isInteger(cents) || cents < 0) throw new Error(`Invalid price: ${cents}`);
  const rounded = Math.ceil(cents / 50) * 50;
  return `$${(rounded / 100).toFixed(2)}`;
};
