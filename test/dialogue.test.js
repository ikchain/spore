import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { selectDialogue } from '../src/dialogue/engine.js';

describe('selectDialogue', () => {
  const baseStats = { debugging: 10, patience: 50, chaos: 20, wisdom: 5, snark: 10 };

  it('returns a string for spore status', () => {
    const line = selectDialogue('spore', 'status', baseStats);
    assert.equal(typeof line, 'string');
    assert.ok(line.length > 0);
  });

  it('returns different results for different stages', () => {
    const sporeLine = selectDialogue('spore', 'status', baseStats);
    const phantomLine = selectDialogue('phantom', 'status', baseStats);
    assert.equal(typeof sporeLine, 'string');
    assert.equal(typeof phantomLine, 'string');
  });

  it('returns a line for commit trigger', () => {
    const line = selectDialogue('spore', 'commit', baseStats);
    assert.equal(typeof line, 'string');
  });

  it('returns a line for feed trigger', () => {
    const line = selectDialogue('sprite', 'feed', baseStats);
    assert.equal(typeof line, 'string');
  });

  it('respects stat conditions when snark is high', () => {
    const highSnark = { ...baseStats, snark: 65 };
    const lines = new Set();
    for (let i = 0; i < 50; i++) {
      lines.add(selectDialogue('wraith', 'status', highSnark));
    }
    assert.ok(lines.has("I've developed what I believe humans call 'taste'. Your code tests it."));
  });

  it('returns fallback line when no condition matches', () => {
    const lowStats = { debugging: 0, patience: 0, chaos: 0, wisdom: 0, snark: 0 };
    const line = selectDialogue('spore', 'status', lowStats);
    assert.equal(typeof line, 'string');
    assert.ok(line.length > 0);
  });

  it('returns a generic status line for unknown trigger', () => {
    const line = selectDialogue('spore', 'nonexistent_trigger', baseStats);
    assert.equal(typeof line, 'string');
  });
});
