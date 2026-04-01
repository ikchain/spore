import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const STATE_FILE = 'companion.json';

export function getSporeDir() {
  return process.env.SPORE_DIR || path.join(os.homedir(), '.spore');
}

export function createDefaultState() {
  const now = new Date().toISOString();
  return {
    version: 1,
    name: 'Spore',
    born: now,
    stage: 'spore',
    stageHistory: [{ stage: 'spore', date: now }],
    stats: {
      debugging: 0,
      patience: 50,
      chaos: 0,
      wisdom: 0,
      snark: 10,
    },
    totalCommits: 0,
    totalSessions: 0,
    totalEvents: 0,
    worstBugDay: null,
    worstBugDayCount: 0,
    topProject: null,
    topProjectCommits: 0,
    projects: {},
    lastCommit: null,
    lastActive: now,
    errorStreak: 0,
  };
}

export function loadState() {
  const dir = getSporeDir();
  const filePath = path.join(dir, STATE_FILE);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const state = createDefaultState();
    saveState(state);
    return state;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function saveState(state) {
  const dir = getSporeDir();

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, STATE_FILE);
  const tmpPath = filePath + '.tmp';

  state.lastActive = new Date().toISOString();
  fs.writeFileSync(tmpPath, JSON.stringify(state, null, 2) + '\n', 'utf-8');
  fs.renameSync(tmpPath, filePath);
}
