import { bold, dim, green, yellow, red, cyan, magenta } from './colors.js';
import { STAT_NAMES } from '../core/stats.js';

const BAR_WIDTH = 20;

const STAT_COLORS = {
  debugging: green,
  patience: cyan,
  chaos: red,
  wisdom: magenta,
  snark: yellow,
};

export function renderStatBar(name, value) {
  const filled = Math.round((value / 100) * BAR_WIDTH);
  const empty = BAR_WIDTH - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const colorFn = STAT_COLORS[name] || white;
  const label = name.toUpperCase().padEnd(10);
  return `${label} ${colorFn(bar)}  ${bold(String(value).padStart(3))}`;
}

export function renderStatus(state, sprite, dialogue) {
  const lines = [];
  const spriteLines = [...sprite];

  const ageMs = Date.now() - new Date(state.born).getTime();
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  const ageStr = ageDays === 0 ? 'born today' : ageDays === 1 ? 'born 1 day ago' : `born ${ageDays} days ago`;

  const header = `${bold(state.stage.toUpperCase())}  ${dim(`(${ageStr})`)}`;

  const statBars = STAT_NAMES.map(name => renderStatBar(name, state.stats[name]));

  while (spriteLines.length < statBars.length + 1) {
    spriteLines.push(' '.repeat(spriteLines[0]?.length || 12));
  }

  const spriteWidth = Math.max(...spriteLines.map(l => l.length)) + 4;

  lines.push('');
  lines.push(spriteLines[0].padEnd(spriteWidth) + header);

  for (let i = 0; i < statBars.length; i++) {
    const spriteLine = (spriteLines[i + 1] || '').padEnd(spriteWidth);
    lines.push(spriteLine + statBars[i]);
  }

  for (let i = statBars.length + 1; i < spriteLines.length; i++) {
    lines.push(spriteLines[i]);
  }

  lines.push('');
  lines.push(`  ${dim('"')}${dialogue}${dim('"')}`);
  lines.push('');

  return lines.join('\n');
}

export function renderLog(events) {
  if (events.length === 0) return dim('  No events yet. Start coding!\n');

  return events.map(e => {
    const date = new Date(e.timestamp);
    const dateStr = date.toISOString().slice(0, 16).replace('T', ' ');
    const deltaStr = Object.entries(e.deltas || {})
      .map(([k, v]) => {
        const sign = v > 0 ? '+' : '';
        const name = k.toUpperCase().slice(0, 5);
        return `${name} ${sign}${v}`;
      })
      .join('  ');
    return `  ${dim(`[${dateStr}]`)} ${bold(e.type.padEnd(16))} ${deltaStr}`;
  }).join('\n') + '\n';
}

export function renderEvolution(state) {
  const lines = [];
  lines.push('');
  lines.push(bold('  Evolution History'));
  lines.push('');
  for (const entry of state.stageHistory) {
    const date = new Date(entry.date).toISOString().slice(0, 10);
    lines.push(`  ${dim(date)}  ${bold(entry.stage.toUpperCase())}`);
  }
  lines.push('');
  lines.push(`  ${dim('Total commits:')} ${state.totalCommits}`);
  lines.push(`  ${dim('Total events:')}  ${state.totalEvents}`);
  if (state.topProject) {
    lines.push(`  ${dim('Top project:')}   ${state.topProject} (${state.topProjectCommits} commits)`);
  }
  if (state.worstBugDay) {
    lines.push(`  ${dim('Worst bug day:')} ${state.worstBugDay} (${state.worstBugDayCount} errors)`);
  }
  lines.push('');
  return lines.join('\n');
}
