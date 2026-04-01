import { LINES } from './lines.js';

export function selectDialogue(stage, trigger, stats) {
  let candidates = LINES.filter(l => l.stage === stage && l.trigger === trigger);

  if (candidates.length === 0) {
    candidates = LINES.filter(l => l.stage === stage && l.trigger === 'status');
  }

  const withCondition = candidates.filter(l => l.condition && l.condition(stats));
  const withoutCondition = candidates.filter(l => !l.condition);

  const pool = withCondition.length > 0
    ? [...withCondition, ...withoutCondition]
    : withoutCondition;

  if (pool.length === 0) {
    return '...';
  }

  return pool[Math.floor(Math.random() * pool.length)].text;
}
