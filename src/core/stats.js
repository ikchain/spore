export const STAT_NAMES = ['debugging', 'patience', 'chaos', 'wisdom', 'snark'];

export function applyDelta(current, delta) {
  if (delta === 0) return current;

  let effective = delta;

  if (delta > 0 && current >= 80) {
    effective = Math.max(1, Math.floor(delta / 2));
  } else if (delta < 0 && current <= 20) {
    effective = Math.min(-1, Math.ceil(delta / 2));
  }

  return Math.max(0, Math.min(100, current + effective));
}

export function applyEventDeltas(stats, deltas) {
  const result = { ...stats };
  for (const [stat, delta] of Object.entries(deltas)) {
    if (stat in result) {
      result[stat] = applyDelta(result[stat], delta);
    }
  }
  return result;
}
