import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { appendEvent, readLastEvents, rotateIfNeeded } from '../src/data/eventlog.js';

describe('eventlog', () => {
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

  describe('appendEvent', () => {
    it('creates events.jsonl if it does not exist', () => {
      appendEvent({ type: 'commit', timestamp: '2026-04-01T12:00:00Z', deltas: {} });
      const filePath = path.join(tmpDir, 'events.jsonl');
      assert.ok(fs.existsSync(filePath));
    });

    it('appends valid JSON line', () => {
      const event = { type: 'commit', timestamp: '2026-04-01T12:00:00Z', deltas: { wisdom: 2 } };
      appendEvent(event);
      const content = fs.readFileSync(path.join(tmpDir, 'events.jsonl'), 'utf-8');
      const parsed = JSON.parse(content.trim());
      assert.equal(parsed.type, 'commit');
      assert.equal(parsed.deltas.wisdom, 2);
    });

    it('appends multiple events as separate lines', () => {
      appendEvent({ type: 'commit', timestamp: '2026-04-01T12:00:00Z', deltas: {} });
      appendEvent({ type: 'feed', timestamp: '2026-04-01T12:05:00Z', deltas: {} });
      const lines = fs.readFileSync(path.join(tmpDir, 'events.jsonl'), 'utf-8').trim().split('\n');
      assert.equal(lines.length, 2);
      assert.equal(JSON.parse(lines[0]).type, 'commit');
      assert.equal(JSON.parse(lines[1]).type, 'feed');
    });
  });

  describe('readLastEvents', () => {
    it('returns empty array if no log exists', () => {
      const events = readLastEvents(20);
      assert.deepEqual(events, []);
    });

    it('returns last N events', () => {
      for (let i = 0; i < 5; i++) {
        appendEvent({ type: 'commit', timestamp: `2026-04-01T12:0${i}:00Z`, index: i, deltas: {} });
      }
      const events = readLastEvents(3);
      assert.equal(events.length, 3);
      assert.equal(events[0].index, 2);
      assert.equal(events[2].index, 4);
    });

    it('returns all events if fewer than N', () => {
      appendEvent({ type: 'commit', timestamp: '2026-04-01T12:00:00Z', deltas: {} });
      const events = readLastEvents(20);
      assert.equal(events.length, 1);
    });
  });

  describe('rotateIfNeeded', () => {
    it('does not rotate when under threshold', () => {
      for (let i = 0; i < 5; i++) {
        appendEvent({ type: 'commit', timestamp: '2026-04-01T12:00:00Z', deltas: {} });
      }
      const rotated = rotateIfNeeded(10);
      assert.equal(rotated, false);
    });

    it('rotates when at threshold', () => {
      const logPath = path.join(tmpDir, 'events.jsonl');
      const lines = [];
      for (let i = 0; i < 10; i++) {
        lines.push(JSON.stringify({ type: 'commit', index: i, deltas: {} }));
      }
      fs.writeFileSync(logPath, lines.join('\n') + '\n');

      const rotated = rotateIfNeeded(10);
      assert.equal(rotated, true);

      const files = fs.readdirSync(tmpDir);
      assert.ok(files.some(f => f.startsWith('events-') && f.endsWith('.jsonl.old')));

      if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf-8').trim();
        assert.equal(content, '');
      }
    });
  });
});
