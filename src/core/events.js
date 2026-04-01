import { applyEventDeltas } from './stats.js';
import { checkEvolution } from './evolution.js';
import { loadState, saveState } from '../data/state.js';
import { appendEvent, rotateIfNeeded } from '../data/eventlog.js';

export const EVENT_DELTAS = {
  commit: { patience: 3, chaos: -1, wisdom: 2 },
  commit_fast: { patience: 5, chaos: -3, wisdom: 1, snark: -1 },
  error_resolved: { debugging: 5, patience: 1, wisdom: 1, snark: -2 },
  error_repeated: { debugging: 1, patience: -3, chaos: 4, snark: 8 },
  session_long: { patience: -5, chaos: 6, snark: 3 },
  files_created: { chaos: 4 },
  test_pass: { debugging: 3, patience: 2, chaos: -1, wisdom: 2 },
  feed: { patience: 3, chaos: -1, snark: -2 },
};

const FAST_COMMIT_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

export function processEvent(type, options = {}) {
  const state = loadState();
  const now = new Date();

  // Determine effective event type
  let effectiveType = type;
  if (type === 'commit' && state.lastCommit) {
    const elapsed = now.getTime() - new Date(state.lastCommit).getTime();
    if (elapsed < FAST_COMMIT_THRESHOLD_MS) {
      effectiveType = 'commit_fast';
    }
  }

  // Get deltas for this event type
  const deltas = EVENT_DELTAS[effectiveType] || {};

  // Apply stat changes
  state.stats = applyEventDeltas(state.stats, deltas);

  // Update counters
  state.totalEvents++;
  if (type === 'commit') {
    state.totalCommits++;
    state.lastCommit = now.toISOString();
  }

  // Track project
  if (options.project && type === 'commit') {
    state.projects[options.project] = (state.projects[options.project] || 0) + 1;
    if (state.projects[options.project] > state.topProjectCommits) {
      state.topProject = options.project;
      state.topProjectCommits = state.projects[options.project];
    }
  }

  // Track error streak
  if (type === 'error_repeated') {
    state.errorStreak++;
    const today = now.toISOString().slice(0, 10);
    if (state.errorStreak > state.worstBugDayCount) {
      state.worstBugDay = today;
      state.worstBugDayCount = state.errorStreak;
    }
  } else if (type === 'error_resolved') {
    state.errorStreak = 0;
  }

  // Check evolution
  const ageDays = Math.floor((now.getTime() - new Date(state.born).getTime()) / (1000 * 60 * 60 * 24));
  const newStage = checkEvolution(state.stage, state.stats, ageDays);
  let evolved = false;
  if (newStage) {
    state.stage = newStage;
    state.stageHistory.push({ stage: newStage, date: now.toISOString() });
    evolved = true;
  }

  // Persist
  saveState(state);
  appendEvent({
    type: effectiveType,
    timestamp: now.toISOString(),
    project: options.project || null,
    deltas,
  });
  rotateIfNeeded();

  return { state, evolved, deltas, effectiveType };
}
