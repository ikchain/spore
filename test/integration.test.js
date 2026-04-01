import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

describe('CLI integration', () => {
  let tmpDir;
  const sporeBin = path.resolve('bin/spore.js');

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spore-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function spore(args = [], options = {}) {
    return execFileSync('node', [sporeBin, ...args], {
      encoding: 'utf-8',
      env: { ...process.env, SPORE_DIR: tmpDir, NO_COLOR: '1' },
      timeout: 5000,
      ...options,
    });
  }

  it('shows status for a fresh companion', () => {
    const output = spore(['status']);
    assert.ok(output.includes('SPORE'));
    assert.ok(output.includes('DEBUGGING'));
    assert.ok(output.includes('PATIENCE'));
  });

  it('shows help', () => {
    const output = spore(['--help']);
    assert.ok(output.includes('Usage:'));
    assert.ok(output.includes('status'));
    assert.ok(output.includes('feed'));
  });

  it('shows version', () => {
    const output = spore(['--version']);
    assert.match(output, /spore v\d+\.\d+\.\d+/);
  });

  it('processes a commit event', () => {
    spore(['status']);
    spore(['event', 'commit', '--project', '/test/project']);

    const state = JSON.parse(fs.readFileSync(path.join(tmpDir, 'companion.json'), 'utf-8'));
    assert.equal(state.stats.patience, 53);
    assert.equal(state.stats.wisdom, 2);
    assert.equal(state.totalCommits, 1);
    assert.equal(state.projects['/test/project'], 1);
  });

  it('processes a feed event', () => {
    spore(['status']);
    const output = spore(['feed']);
    assert.ok(output.length > 0);

    const state = JSON.parse(fs.readFileSync(path.join(tmpDir, 'companion.json'), 'utf-8'));
    assert.equal(state.stats.patience, 53);
  });

  it('shows log', () => {
    spore(['status']);
    spore(['event', 'commit']);
    const output = spore(['log']);
    assert.ok(output.includes('commit'));
  });

  it('shows stats', () => {
    spore(['status']);
    const output = spore(['stats']);
    assert.ok(output.includes('Evolution History'));
    assert.ok(output.includes('SPORE'));
  });

  it('evolves when thresholds are met', () => {
    spore(['status']);

    const statePath = path.join(tmpDir, 'companion.json');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
    state.stats.debugging = 25;
    state.stats.wisdom = 9;
    fs.writeFileSync(statePath, JSON.stringify(state));

    // commit gives +2 wisdom → 11, triggers sprite evolution
    try {
      spore(['event', 'commit'], { stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      // evolution message goes to stderr, execFileSync may capture it
    }

    const updatedState = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
    assert.equal(updatedState.stage, 'sprite');
  });

  it('writes event to JSONL log', () => {
    spore(['status']);
    spore(['event', 'commit']);

    const logPath = path.join(tmpDir, 'events.jsonl');
    assert.ok(fs.existsSync(logPath));
    const content = fs.readFileSync(logPath, 'utf-8').trim();
    const event = JSON.parse(content);
    assert.equal(event.type, 'commit');
  });

  it('rejects unknown commands', () => {
    try {
      spore(['notacommand']);
      assert.fail('Should have thrown');
    } catch (err) {
      assert.ok(err.stderr.includes('Unknown command'));
    }
  });
});
