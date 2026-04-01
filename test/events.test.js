import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { processEvent, EVENT_DELTAS } from '../src/core/events.js';
import { createDefaultState, saveState } from '../src/data/state.js';

describe('EVENT_DELTAS', () => {
  it('defines deltas for commit event', () => {
    assert.ok(EVENT_DELTAS.commit);
    assert.equal(EVENT_DELTAS.commit.patience, 3);
    assert.equal(EVENT_DELTAS.commit.chaos, -1);
    assert.equal(EVENT_DELTAS.commit.wisdom, 2);
  });

  it('defines deltas for feed event', () => {
    assert.ok(EVENT_DELTAS.feed);
    assert.equal(EVENT_DELTAS.feed.patience, 3);
    assert.equal(EVENT_DELTAS.feed.snark, -2);
  });

  it('defines deltas for error_repeated event', () => {
    assert.ok(EVENT_DELTAS.error_repeated);
    assert.equal(EVENT_DELTAS.error_repeated.snark, 8);
  });
});

describe('processEvent', () => {
  let tmpDir;
  let originalEnv;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spore-test-'));
    originalEnv = process.env.SPORE_DIR;
    process.env.SPORE_DIR = tmpDir;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.SPORE_DIR;
    } else {
      process.env.SPORE_DIR = originalEnv;
    }
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('applies commit deltas to state', () => {
    const state = createDefaultState();
    saveState(state);

    const result = processEvent('commit');
    assert.equal(result.state.stats.patience, 53);
    assert.equal(result.state.stats.wisdom, 2);
    assert.equal(result.state.totalCommits, 1);
    assert.equal(result.state.totalEvents, 1);
  });

  it('applies feed deltas to state', () => {
    const state = createDefaultState();
    saveState(state);

    const result = processEvent('feed');
    assert.equal(result.state.stats.patience, 53);
    assert.equal(result.state.stats.snark, 9);
  });

  it('detects evolution after stat change', () => {
    const state = createDefaultState();
    state.stats.debugging = 25;
    state.stats.wisdom = 9;
    saveState(state);

    const result = processEvent('commit');
    assert.equal(result.evolved, true);
    assert.equal(result.state.stage, 'sprite');
    assert.equal(result.state.stageHistory.length, 2);
  });

  it('persists state after processing', () => {
    const state = createDefaultState();
    saveState(state);

    processEvent('commit');

    const raw = fs.readFileSync(path.join(tmpDir, 'companion.json'), 'utf-8');
    const loaded = JSON.parse(raw);
    assert.equal(loaded.stats.patience, 53);
    assert.equal(loaded.totalCommits, 1);
  });

  it('appends event to log', () => {
    const state = createDefaultState();
    saveState(state);

    processEvent('commit');

    const logContent = fs.readFileSync(path.join(tmpDir, 'events.jsonl'), 'utf-8').trim();
    const event = JSON.parse(logContent);
    assert.equal(event.type, 'commit');
    assert.ok(event.timestamp);
    assert.ok(event.deltas);
  });

  it('tracks project commits when project is specified', () => {
    const state = createDefaultState();
    saveState(state);

    processEvent('commit', { project: '/home/user/app' });
    const result = processEvent('commit', { project: '/home/user/app' });
    assert.equal(result.state.projects['/home/user/app'], 2);
    assert.equal(result.state.topProject, '/home/user/app');
    assert.equal(result.state.topProjectCommits, 2);
  });

  it('detects fast commit (< 30 min since last)', () => {
    const state = createDefaultState();
    state.lastCommit = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    saveState(state);

    const result = processEvent('commit');
    assert.equal(result.state.stats.patience, 55);
  });

  it('increments errorStreak on error_repeated', () => {
    const state = createDefaultState();
    saveState(state);

    const result = processEvent('error_repeated');
    assert.equal(result.state.errorStreak, 1);
  });

  it('resets errorStreak on error_resolved', () => {
    const state = createDefaultState();
    state.errorStreak = 3;
    saveState(state);

    const result = processEvent('error_resolved');
    assert.equal(result.state.errorStreak, 0);
  });
});
