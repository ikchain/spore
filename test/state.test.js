import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { loadState, saveState, createDefaultState, getSporeDir } from '../src/data/state.js';

describe('state', () => {
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

  describe('getSporeDir', () => {
    it('returns SPORE_DIR env var when set', () => {
      assert.equal(getSporeDir(), tmpDir);
    });

    it('returns ~/.spore when env var is not set', () => {
      delete process.env.SPORE_DIR;
      assert.equal(getSporeDir(), path.join(os.homedir(), '.spore'));
    });
  });

  describe('createDefaultState', () => {
    it('creates state with correct initial values', () => {
      const state = createDefaultState();
      assert.equal(state.version, 1);
      assert.equal(state.stage, 'spore');
      assert.equal(state.stats.patience, 50);
      assert.equal(state.stats.snark, 10);
      assert.equal(state.stats.debugging, 0);
      assert.equal(state.stats.chaos, 0);
      assert.equal(state.stats.wisdom, 0);
      assert.equal(state.totalCommits, 0);
      assert.ok(state.born);
      assert.ok(state.stageHistory.length === 1);
      assert.equal(state.stageHistory[0].stage, 'spore');
    });
  });

  describe('saveState / loadState', () => {
    it('saves and loads state round-trip', () => {
      const state = createDefaultState();
      state.stats.debugging = 42;
      saveState(state);
      const loaded = loadState();
      assert.equal(loaded.stats.debugging, 42);
    });

    it('loadState creates default state if file does not exist', () => {
      const state = loadState();
      assert.equal(state.stage, 'spore');
      assert.equal(state.stats.patience, 50);
    });

    it('loadState creates spore directory if it does not exist', () => {
      const subDir = path.join(tmpDir, 'nested');
      process.env.SPORE_DIR = subDir;
      const state = loadState();
      assert.ok(fs.existsSync(subDir));
      assert.equal(state.stage, 'spore');
    });

    it('saveState writes atomically via temp file', () => {
      const state = createDefaultState();
      saveState(state);
      const files = fs.readdirSync(tmpDir);
      assert.ok(!files.some(f => f.endsWith('.tmp')));
      assert.ok(files.includes('companion.json'));
    });
  });
});
