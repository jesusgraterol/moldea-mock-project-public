// Durable policy: ../moldea/context/watering-policy.md

/**
 * Build a local watering proposal without performing any equipment operations.
 *
 * @param {Array<{id: string, moisturePercent: number, requestedLitres: number}>} zones
 * @returns {{zones: Array<{id: string, requestedLitres: number}>, totalLitres: number}}
 * @throws {TypeError} If a record is missing or a fact has an invalid type.
 * @throws {RangeError} If a numeric fact is out of range or the total overflows.
 */
export function planWatering(zones) {
  if (!Array.isArray(zones)) {
    throw new TypeError('zones must be an array');
  }

  const selectedZones = [];
  let totalLitres = 0;

  for (const [index, zone] of zones.entries()) {
    if (zone === null || typeof zone !== 'object' || Array.isArray(zone)) {
      throw new TypeError(`zones[${index}] must be a zone record`);
    }

    const { id, moisturePercent, requestedLitres } = zone;

    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new TypeError(`zones[${index}].id must be a nonempty string`);
    }
    if (!Number.isFinite(moisturePercent)) {
      throw new TypeError(`zones[${index}].moisturePercent must be a finite number`);
    }
    if (moisturePercent < 0 || moisturePercent > 100) {
      throw new RangeError(`zones[${index}].moisturePercent must be from 0 through 100`);
    }
    if (!Number.isFinite(requestedLitres)) {
      throw new TypeError(`zones[${index}].requestedLitres must be a finite number`);
    }
    if (requestedLitres < 0) {
      throw new RangeError(`zones[${index}].requestedLitres must be nonnegative`);
    }

    if (moisturePercent < 20) {
      totalLitres += requestedLitres;
      if (!Number.isFinite(totalLitres)) {
        throw new RangeError('totalLitres must remain finite');
      }
      selectedZones.push({ id, requestedLitres });
    }
  }

  return { zones: selectedZones, totalLitres };
}
