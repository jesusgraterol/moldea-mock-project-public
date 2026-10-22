# Pricing

Dish prices appear at the end of the allergen and price line. Labels come from `src/price-labels.js`: prices are shown in dollars and round up to the nearest 50 cents. Whole-dollar prices omit the decimal part, so 1,175 cents shows as `$12`; other prices keep two decimals, so 1,210 cents shows as `$12.50`. A dish without a fixed price shows `Market price`.
