import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { applyDelta, applyEventDeltas, STAT_NAMES } from '../src/core/stats.js';

describe('applyDelta', () => {
  it('applies positive delta to a stat', () => {
    assert.equal(applyDelta(50, 5), 55);
  });

  it('applies negative delta to a stat', () => {
    assert.equal(applyDelta(50, -5), 45);
  });

  it('clamps at 100', () => {
    assert.equal(applyDelta(98, 5), 100);
  });

  it('clamps at 0', () => {
    assert.equal(applyDelta(2, -5), 0);
  });

  it('applies diminishing returns above 80 for positive deltas', () => {
    assert.equal(applyDelta(85, 6), 88);
  });

  it('diminishing returns minimum is 1 for positive', () => {
    assert.equal(applyDelta(90, 1), 91);
  });

  it('applies diminishing returns below 20 for negative deltas', () => {
    assert.equal(applyDelta(15, -6), 12);
  });

  it('diminishing returns minimum is -1 for negative', () => {
    assert.equal(applyDelta(10, -1), 9);
  });

  it('no diminishing returns in normal range', () => {
    assert.equal(applyDelta(50, 8), 58);
    assert.equal(applyDelta(50, -8), 42);
  });

  it('returns unchanged stat for zero delta', () => {
    assert.equal(applyDelta(50, 0), 50);
  });
});

describe('applyEventDeltas', () => {
  it('applies multiple deltas to stats object', () => {
    const stats = { debugging: 10, patience: 50, chaos: 30, wisdom: 5, snark: 20 };
    const deltas = { patience: 3, chaos: -1, wisdom: 2 };
    const result = applyEventDeltas(stats, deltas);
    assert.deepEqual(result, { debugging: 10, patience: 53, chaos: 29, wisdom: 7, snark: 20 });
  });

  it('does not mutate original stats', () => {
    const stats = { debugging: 10, patience: 50, chaos: 30, wisdom: 5, snark: 20 };
    const deltas = { patience: 3 };
    applyEventDeltas(stats, deltas);
    assert.equal(stats.patience, 50);
  });

  it('handles empty deltas', () => {
    const stats = { debugging: 10, patience: 50, chaos: 30, wisdom: 5, snark: 20 };
    const result = applyEventDeltas(stats, {});
    assert.deepEqual(result, stats);
  });
});

describe('STAT_NAMES', () => {
  it('contains all five stat names', () => {
    assert.deepEqual(STAT_NAMES, ['debugging', 'patience', 'chaos', 'wisdom', 'snark']);
  });
});
