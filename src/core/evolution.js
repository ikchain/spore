export const STAGES = ['spore', 'sprite', 'wraith', 'specter', 'phantom'];

const STAT_KEYS = ['debugging', 'patience', 'chaos', 'wisdom', 'snark'];

function countStatsAbove(stats, threshold) {
  return STAT_KEYS.filter(k => stats[k] >= threshold).length;
}

const THRESHOLDS = {
  sprite: (stats, ageDays) => {
    return countStatsAbove(stats, 20) >= 1 && stats.wisdom >= 10;
  },
  wraith: (stats, ageDays) => {
    return countStatsAbove(stats, 40) >= 3 && stats.wisdom >= 25;
  },
  specter: (stats, ageDays) => {
    return countStatsAbove(stats, 60) >= 4 && stats.wisdom >= 50 && ageDays >= 30;
  },
  phantom: (stats, ageDays) => {
    return countStatsAbove(stats, 75) >= 5 && stats.wisdom >= 90 && ageDays >= 90;
  },
};

export function checkEvolution(currentStage, stats, ageDays) {
  const currentIndex = STAGES.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex >= STAGES.length - 1) return null;

  const nextStage = STAGES[currentIndex + 1];
  const check = THRESHOLDS[nextStage];
  if (check && check(stats, ageDays)) return nextStage;

  return null;
}
