import fs from 'node:fs';
import path from 'node:path';
import { getSporeDir } from './state.js';

const MAX_BACKUPS = 8;

export function createBackupIfNeeded() {
  const dir = getSporeDir();
  const statePath = path.join(dir, 'companion.json');
  if (!fs.existsSync(statePath)) return false;

  const backupDir = path.join(dir, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const now = new Date();
  const weekStart = getWeekStart(now);
  const backups = fs.readdirSync(backupDir).filter(f => f.endsWith('.json')).sort();

  for (const backup of backups) {
    const dateStr = backup.replace('companion-', '').replace('.json', '');
    const backupDate = new Date(dateStr);
    if (!isNaN(backupDate.getTime()) && getWeekStart(backupDate) === weekStart) {
      return false;
    }
  }

  const dateStr = now.toISOString().slice(0, 10);
  const backupPath = path.join(backupDir, `companion-${dateStr}.json`);
  fs.copyFileSync(statePath, backupPath);

  const allBackups = fs.readdirSync(backupDir).filter(f => f.endsWith('.json')).sort();
  for (const old of allBackups.slice(0, -MAX_BACKUPS)) {
    fs.unlinkSync(path.join(backupDir, old));
  }

  return true;
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}
