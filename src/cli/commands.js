import { loadState, saveState, createDefaultState, getSporeDir } from '../data/state.js';
import { processEvent } from '../core/events.js';
import { readLastEvents } from '../data/eventlog.js';
import { selectDialogue } from '../dialogue/engine.js';
import { getSprite } from '../sprites/ascii.js';
import { renderStatus, renderLog, renderEvolution } from './renderer.js';
import { bold, dim, red, green, cyan, yellow, magenta, white } from './colors.js';
import { createBackupIfNeeded } from '../data/backup.js';
import { STAT_NAMES } from '../core/stats.js';
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

export function live() {
  const REFRESH_MS = 3000;
  const CLEAR = '\x1b[2J\x1b[H';
  const HIDE_CURSOR = '\x1b[?25l';
  const SHOW_CURSOR = '\x1b[?25h';

  process.stdout.write(HIDE_CURSOR);
  process.on('SIGINT', () => { process.stdout.write(SHOW_CURSOR + '\n'); process.exit(0); });
  process.on('SIGTERM', () => { process.stdout.write(SHOW_CURSOR + '\n'); process.exit(0); });

  const STAT_COLORS_MAP = { debugging: green, patience: cyan, chaos: red, wisdom: magenta, snark: yellow };
  let lastStage = null;

  function draw() {
    const state = loadState();
    const sprite = getSprite(state.stage);

    let trigger = 'status';
    if (lastStage && lastStage !== state.stage) trigger = 'evolution';
    lastStage = state.stage;

    const dialogue = selectDialogue(state.stage, trigger, state.stats);
    const events = readLastEvents(3);

    const ageMs = Date.now() - new Date(state.born).getTime();
    const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
    const ageStr = ageDays === 0 ? 'today' : ageDays === 1 ? '1 day' : `${ageDays} days`;

    const W = 52;
    const hr   = dim('  ├' + '─'.repeat(W) + '┤');
    const top  = dim('  ╭' + '─'.repeat(W) + '╮');
    const bot  = dim('  ╰' + '─'.repeat(W) + '╯');
    const pad  = (content, rawLen) => {
      const space = W - rawLen;
      return dim('  │') + ' ' + content + ' '.repeat(Math.max(0, space - 1)) + dim(' │');
    };
    const empty = dim('  │') + ' '.repeat(W) + dim('│');

    const out = [];
    out.push('');
    out.push(top);
    out.push(empty);

    // Title
    const titleText = `${state.stage.toUpperCase()}  born ${ageStr} ago  ·  ${state.totalCommits} commits`;
    out.push(pad(bold(state.stage.toUpperCase()) + dim(`  born ${ageStr} ago  ·  ${state.totalCommits} commits`), titleText.length));
    out.push(empty);

    // Sprite centered
    const sw = Math.max(...sprite.map(l => l.length));
    for (const sl of sprite) {
      const offset = Math.floor((W - sw) / 2 - 1);
      const centered = ' '.repeat(offset) + sl;
      out.push(pad(centered, centered.length));
    }

    out.push(empty);
    out.push(hr);
    out.push(empty);

    // Stats
    for (const name of STAT_NAMES) {
      const value = state.stats[name];
      const filled = Math.round((value / 100) * 16);
      const emptyB = 16 - filled;
      const bar = '█'.repeat(filled) + '░'.repeat(emptyB);
      const colorFn = STAT_COLORS_MAP[name] || white;
      const label = name.toUpperCase().padEnd(10);
      const rawLen = 2 + 10 + 1 + 16 + 2 + 3;
      out.push(pad(`  ${label} ${colorFn(bar)}  ${bold(String(value).padStart(3))}`, rawLen));
    }

    out.push(empty);
    out.push(hr);
    out.push(empty);

    // Dialogue with word wrap
    const dq = `"${dialogue}"`;
    const maxDqW = W - 6;
    if (dq.length > maxDqW) {
      const breakAt = dq.lastIndexOf(' ', maxDqW);
      const p1 = dq.slice(0, breakAt > 0 ? breakAt : maxDqW);
      const p2 = dq.slice(breakAt > 0 ? breakAt + 1 : maxDqW);
      out.push(pad(`  ${dim(p1)}`, p1.length + 2));
      out.push(pad(`  ${dim(p2)}`, p2.length + 2));
    } else {
      out.push(pad(`  ${dim(dq)}`, dq.length + 2));
    }

    out.push(empty);

    // Last event
    if (events.length > 0) {
      const e = events[events.length - 1];
      const ts = new Date(e.timestamp).toISOString().slice(11, 16);
      const deltas = Object.entries(e.deltas || {})
        .map(([k, v]) => `${k.slice(0, 3).toUpperCase()}${v > 0 ? '+' : ''}${v}`)
        .join(' ');
      const evtText = `last: ${ts} ${e.type} ${deltas}`;
      out.push(pad(`  ${dim(evtText)}`, evtText.length + 2));
      out.push(empty);
    }

    out.push(bot);
    out.push(dim('  ctrl+c to exit'));
    out.push('');

    process.stdout.write(CLEAR + out.join('\n'));
  }

  draw();
  setInterval(draw, REFRESH_MS);
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
