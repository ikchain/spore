import fs from 'node:fs';
import path from 'node:path';
import { getSporeDir } from './state.js';

const LOG_FILE = 'events.jsonl';
const MAX_ARCHIVES = 3;

function getLogPath() {
  return path.join(getSporeDir(), LOG_FILE);
}

export function appendEvent(event) {
  const dir = getSporeDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const line = JSON.stringify(event) + '\n';
  fs.appendFileSync(getLogPath(), line, 'utf-8');
}

export function readLastEvents(n) {
  const logPath = getLogPath();
  if (!fs.existsSync(logPath)) return [];

  const content = fs.readFileSync(logPath, 'utf-8').trim();
  if (!content) return [];

  const lines = content.split('\n');
  const lastLines = lines.slice(-n);
  return lastLines.map(line => JSON.parse(line));
}

export function rotateIfNeeded(threshold = 10000) {
  const logPath = getLogPath();
  if (!fs.existsSync(logPath)) return false;

  const content = fs.readFileSync(logPath, 'utf-8').trim();
  if (!content) return false;

  const lineCount = content.split('\n').length;
  if (lineCount < threshold) return false;

  const date = new Date().toISOString().slice(0, 10);
  const archiveName = `events-${date}.jsonl.old`;
  const archivePath = path.join(getSporeDir(), archiveName);
  fs.renameSync(logPath, archivePath);

  fs.writeFileSync(logPath, '', 'utf-8');

  cleanArchives();

  return true;
}

function cleanArchives() {
  const dir = getSporeDir();
  const archives = fs.readdirSync(dir)
    .filter(f => f.startsWith('events-') && f.endsWith('.jsonl.old'))
    .sort()
    .reverse();

  for (const archive of archives.slice(MAX_ARCHIVES)) {
    fs.unlinkSync(path.join(dir, archive));
  }
}
