/** Formats a dish price in cents, rounding up to 50 cents and omitting whole-dollar cents. */
export const priceLabel = (cents) => {
  if (cents === null) return 'Market price';
  if (!Number.isInteger(cents) || cents < 0) throw new Error(`Invalid price: ${cents}`);
  const rounded = Math.ceil(cents / 50) * 50;
  return `$${(rounded / 100).toFixed(rounded % 100 === 0 ? 0 : 2)}`;
};
