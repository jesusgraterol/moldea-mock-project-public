import type { IAlertBatch, INormalizedSignal } from './types.js';

// duration measurements use milliseconds for cross-monitor comparison
const MILLISECONDS_PER_SECOND = 1000;

/**
 * Normalizes recognized duration units while retaining the source event identifier.
 * @param event A raw monitor event with its own value, threshold, and unit.
 * @returns The observation in milliseconds for duration units, or its original unit otherwise.
 */
export const normalizeSignal = (event: IAlertBatch['events'][number]): INormalizedSignal => {
  const isSeconds = event.unit === 's' || event.unit === 'second' || event.unit === 'seconds';
  const isMilliseconds =
    event.unit === 'ms' || event.unit === 'millisecond' || event.unit === 'milliseconds';
  const multiplier = isSeconds ? MILLISECONDS_PER_SECOND : 1;
  const observedValue = event.value * multiplier;
  const threshold = event.threshold * multiplier;

  return {
    rawEventId: event.eventId,
    observedAt: event.observedAt,
    service: event.service,
    signal: event.signal,
    observedValue,
    threshold,
    unit: isSeconds || isMilliseconds ? 'ms' : event.unit,
    isThresholdExceeded: observedValue > threshold,
  };
};
