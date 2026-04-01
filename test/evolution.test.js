import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { STAGES, checkEvolution } from '../src/core/evolution.js';

describe('STAGES', () => {
  it('has 5 stages in order', () => {
    assert.deepEqual(STAGES, ['spore', 'sprite', 'wraith', 'specter', 'phantom']);
  });
});

describe('checkEvolution', () => {
  const baseStats = { debugging: 0, patience: 50, chaos: 0, wisdom: 0, snark: 10 };

  it('returns null when no evolution is possible', () => {
    assert.equal(checkEvolution('spore', baseStats, 0), null);
  });

  it('evolves spore to sprite when any stat >= 20 and wisdom >= 10', () => {
    const stats = { ...baseStats, debugging: 25, wisdom: 10 };
    assert.equal(checkEvolution('spore', stats, 0), 'sprite');
  });

  it('does not evolve spore if wisdom < 10', () => {
    const stats = { ...baseStats, debugging: 25, wisdom: 5 };
    assert.equal(checkEvolution('spore', stats, 0), null);
  });

  it('evolves sprite to wraith when 3+ stats >= 40 and wisdom >= 25', () => {
    const stats = { debugging: 45, patience: 50, chaos: 42, wisdom: 25, snark: 10 };
    assert.equal(checkEvolution('sprite', stats, 0), 'wraith');
  });

  it('does not evolve sprite if only 2 stats >= 40', () => {
    const stats = { debugging: 45, patience: 50, chaos: 10, wisdom: 25, snark: 10 };
    assert.equal(checkEvolution('sprite', stats, 0), null);
  });

  it('evolves wraith to specter when 4+ stats >= 60, wisdom >= 50, age >= 30', () => {
    const stats = { debugging: 65, patience: 70, chaos: 62, wisdom: 50, snark: 61 };
    assert.equal(checkEvolution('wraith', stats, 30), 'specter');
  });

  it('does not evolve wraith if age < 30', () => {
    const stats = { debugging: 65, patience: 70, chaos: 62, wisdom: 50, snark: 61 };
    assert.equal(checkEvolution('wraith', stats, 29), null);
  });

  it('evolves specter to phantom when all stats >= 75, wisdom >= 90, age >= 90', () => {
    const stats = { debugging: 80, patience: 85, chaos: 75, wisdom: 90, snark: 76 };
    assert.equal(checkEvolution('specter', stats, 90), 'phantom');
  });

  it('does not evolve specter if one stat < 75', () => {
    const stats = { debugging: 80, patience: 85, chaos: 74, wisdom: 90, snark: 76 };
    assert.equal(checkEvolution('specter', stats, 90), null);
  });

  it('does not evolve specter if wisdom < 90', () => {
    const stats = { debugging: 80, patience: 85, chaos: 75, wisdom: 89, snark: 76 };
    assert.equal(checkEvolution('specter', stats, 90), null);
  });

  it('does not evolve specter if age < 90', () => {
    const stats = { debugging: 80, patience: 85, chaos: 75, wisdom: 90, snark: 76 };
    assert.equal(checkEvolution('specter', stats, 89), null);
  });

  it('returns null for phantom (max stage)', () => {
    const stats = { debugging: 100, patience: 100, chaos: 100, wisdom: 100, snark: 100 };
    assert.equal(checkEvolution('phantom', stats, 365), null);
  });

  it('skips stages if stats meet higher threshold', () => {
    const stats = { debugging: 45, patience: 50, chaos: 42, wisdom: 25, snark: 40 };
    assert.equal(checkEvolution('spore', stats, 0), 'sprite');
  });
});
