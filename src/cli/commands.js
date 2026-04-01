import { loadState, saveState, createDefaultState, getSporeDir } from '../data/state.js';
import { processEvent } from '../core/events.js';
import { readLastEvents } from '../data/eventlog.js';
import { selectDialogue } from '../dialogue/engine.js';
import { getSprite } from '../sprites/ascii.js';
import { renderStatus, renderLog, renderEvolution } from './renderer.js';
import { bold, dim, red, green } from './colors.js';
import { createBackupIfNeeded } from '../data/backup.js';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

export function status() {
  const state = loadState();
  createBackupIfNeeded();
  const sprite = getSprite(state.stage);
  const dialogue = selectDialogue(state.stage, 'status', state.stats);
  process.stdout.write(renderStatus(state, sprite, dialogue));
}

export function stats() {
  const state = loadState();
  process.stdout.write(renderEvolution(state));
}

export function log() {
  const events = readLastEvents(20);
  process.stdout.write('\n' + bold('  Recent Events\n\n'));
  process.stdout.write(renderLog(events));
}

export function feed() {
  const state = loadState();

  if (state.lastFeed) {
    const elapsed = Date.now() - new Date(state.lastFeed).getTime();
    if (elapsed < 10 * 60 * 1000) {
      const remaining = Math.ceil((10 * 60 * 1000 - elapsed) / 60000);
      process.stdout.write(dim(`\n  Not hungry yet. Try again in ${remaining} minute(s).\n\n`));
      return;
    }
  }

  const result = processEvent('feed');
  result.state.lastFeed = new Date().toISOString();
  saveState(result.state);

  const dialogue = selectDialogue(result.state.stage, 'feed', result.state.stats);
  process.stdout.write(`\n  ${dialogue}\n\n`);
}

export async function reset() {
  const state = loadState();

  process.stdout.write(`\n  ${red(bold('WARNING:'))} This will reset your companion permanently.\n`);
  process.stdout.write(`  Current: ${bold(state.stage.toUpperCase())} — ${state.totalCommits} commits — born ${state.born.slice(0, 10)}\n\n`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => {
    rl.question('  Type "goodbye" to confirm: ', resolve);
  });
  rl.close();

  if (answer.trim().toLowerCase() !== 'goodbye') {
    process.stdout.write(dim('\n  Reset cancelled.\n\n'));
    return;
  }

  const dir = getSporeDir();
  const obituaryDir = path.join(dir, 'obituaries');
  if (!fs.existsSync(obituaryDir)) {
    fs.mkdirSync(obituaryDir, { recursive: true });
  }

  const now = new Date();
  const filename = now.toISOString().replace(/[:.]/g, '-') + '.json';
  const obituary = {
    ...state,
    causeOfDeath: 'reset',
    deathDate: now.toISOString(),
    finalAge: Math.floor((now.getTime() - new Date(state.born).getTime()) / (1000 * 60 * 60 * 24)),
  };
  fs.writeFileSync(path.join(obituaryDir, filename), JSON.stringify(obituary, null, 2) + '\n');

  const newState = createDefaultState();
  saveState(newState);

  process.stdout.write(green(`\n  Rest in peace, ${state.name}. A new spore has been born.\n\n`));
}

export function event(args) {
  const type = args[0];
  if (!type) {
    process.stderr.write('Usage: spore event <type> [--project <path>]\n');
    process.exit(1);
  }

  const projectIdx = args.indexOf('--project');
  const project = projectIdx !== -1 ? args[projectIdx + 1] : null;

  const result = processEvent(type, { project });

  if (result.evolved) {
    const dialogue = selectDialogue(result.state.stage, 'evolution', result.state.stats);
    process.stderr.write(`\n  ✦ ${bold(result.state.stage.toUpperCase())} — ${dialogue}\n\n`);
  }
}

export function installHooks() {
  const gitDir = path.join(process.cwd(), '.git');
  if (!fs.existsSync(gitDir)) {
    process.stderr.write(red('\n  Error: Not a git repository.\n\n'));
    process.exit(1);
  }

  const hooksDir = path.join(gitDir, 'hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hookPath = path.join(hooksDir, 'post-commit');
  const hookContent = `#!/bin/sh\n# Spore companion — post-commit hook\nif command -v spore >/dev/null 2>&1; then\n  spore event commit --project "$(pwd)" 2>/dev/null || true\nfi\n`;

  if (fs.existsSync(hookPath)) {
    const existing = fs.readFileSync(hookPath, 'utf-8');
    if (existing.includes('spore event commit')) {
      process.stdout.write(dim('\n  Spore hook already installed in this repo.\n\n'));
      return;
    }
    fs.appendFileSync(hookPath, '\n' + hookContent);
  } else {
    fs.writeFileSync(hookPath, hookContent);
  }

  fs.chmodSync(hookPath, 0o755);
  process.stdout.write(green('\n  Spore post-commit hook installed!\n\n'));
}
