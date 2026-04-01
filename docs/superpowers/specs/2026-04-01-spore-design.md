# Spore — Evolutionary Terminal Companion

**Date:** 2026-04-01
**Status:** Approved
**Version:** 1.0 MVP

## Overview

Spore is a persistent, evolving companion that lives in your terminal. It starts as a simple spore and evolves based on real development activity — commits, errors, test results, session patterns. It has stats that change, a personality that shifts, ASCII art that transforms, and memory that persists across sessions.

This spec covers the v1.0 MVP. Features marked "post-MVP" are documented for roadmap clarity but excluded from initial implementation.

## Architecture

Event-pipeline architecture with modular components:

```
CLI Commands → Event Processor → Stat Engine → Evolution Engine → State Persistence
                    ↑                                                ↓
              Git Hooks / Adapters (post-MVP)                 Dialogue Engine
```

All stat changes flow through a central event processor. Event sources (git hooks, CLI commands) produce typed events. The stat engine applies deltas. The evolution engine checks stage thresholds. The dialogue engine selects contextual lines.

### Module Boundaries

| Module | Responsibility | Depends on |
|--------|---------------|------------|
| `cli/commands` | Parse argv, route to handlers, render output | core/*, data/*, dialogue/*, sprites/* |
| `cli/renderer` | ASCII art display, stat bars, color output | cli/colors |
| `cli/colors` | ANSI escape code helpers | nothing |
| `core/events` | Event type definitions, event processing pipeline | core/stats, core/evolution, data/* |
| `core/stats` | Apply stat deltas with diminishing returns, clamp 0-100 | nothing |
| `core/evolution` | Stage threshold evaluation, transition logic | nothing |
| `data/state` | Atomic read/write of companion.json | nothing |
| `data/eventlog` | Append JSONL, rotation at 10K lines, read last N | nothing |
| `data/backup` | Weekly backup creation and cleanup | data/state |
| `dialogue/engine` | Select dialogue lines by stage + stats + trigger | dialogue/lines |
| `dialogue/lines` | All dialogue content organized by stage | nothing |
| `sprites/ascii` | ASCII art strings per evolution stage | nothing |
| `hooks/git` | Generate and install git post-commit hooks | core/events |

### Data Flow: `spore status`

1. `cli/commands` receives "status" command
2. `data/state` reads `~/.spore/companion.json`
3. `sprites/ascii` returns sprite for current stage
4. `cli/renderer` renders sprite + stat bars
5. `dialogue/engine` selects a line for trigger="status" given current stage and stats
6. Output to stdout

### Data Flow: Git post-commit hook

1. Git executes `~/.spore/hooks/post-commit` (or project-local hook)
2. Hook runs `spore event commit` (internal CLI command)
3. `core/events` processes the "commit" event type
4. `core/stats` applies deltas: PATIENCE +3, CHAOS -1, WISDOM +2
5. `core/evolution` checks if stage transition thresholds are met
6. `data/state` writes updated companion.json atomically
7. `data/eventlog` appends event to events.jsonl
8. If stage changed: outputs evolution message to stderr (visible in terminal)

## Stats System

Five stats, each integer 0-100.

### Stats

| Stat | Rises when | Falls when |
|------|-----------|------------|
| DEBUGGING | Errors resolved, tests pass | (passive decay: none) |
| PATIENCE | Steady commits, focused work | Long sessions without commits |
| CHAOS | Many files changed, rapid edits, errors | Focused sessions, commits |
| WISDOM | Time passes, commits accumulate | (never falls) |
| SNARK | Repeated errors, long idle sessions | Errors resolved, `spore feed` |

### Event → Stat Delta Table

| Event | DEBUG | PATIENCE | CHAOS | WISDOM | SNARK |
|-------|-------|----------|-------|--------|-------|
| `commit` | — | +3 | -1 | +2 | — |
| `commit_fast` (<30min since last) | — | +5 | -3 | +1 | -1 |
| `error_resolved` | +5 | +1 | — | +1 | -2 |
| `error_repeated` (same error 3x) | +1 | -3 | +4 | — | +8 |
| `session_long` (>2h no commit) | — | -5 | +6 | — | +3 |
| `files_created` (>3 new files) | — | — | +4 | — | — |
| `test_pass` | +3 | +2 | -1 | +2 | — |
| `feed` | — | +3 | -1 | — | -2 |

### Diminishing Returns

When a stat is above 80, positive deltas are halved (rounded down, minimum 1). When below 20, negative deltas are halved. This prevents stats from pinning at extremes and makes the middle range more dynamic.

Formula:
```
effective_delta = delta
if (delta > 0 && current_stat >= 80) effective_delta = max(1, floor(delta / 2))
if (delta < 0 && current_stat <= 20) effective_delta = min(-1, ceil(delta / 2))
result = clamp(current_stat + effective_delta, 0, 100)
```

## Evolution Stages

Five stages with distinct personality and ASCII sprite.

| Stage | Threshold | Personality |
|-------|-----------|-------------|
| SPORE | Starting stage | Curious, innocent, simple observations |
| SPRITE | Any stat ≥ 20, WISDOM ≥ 10 | Starting to understand code, playful, slightly mischievous |
| WRAITH | 3+ stats ≥ 40, WISDOM ≥ 25 | Personality formed, has opinions about your code, dry wit |
| SPECTER | 4+ stats ≥ 60, WISDOM ≥ 50, age ≥ 30 days | Experienced, references past events, sardonic humor |
| PHANTOM | All stats ≥ 75, WISDOM ≥ 90, age ≥ 90 days | Omniscient, mildly condescending, existential commentary |

Evolution is one-directional. Once a stage is reached, it cannot regress. Evolution is checked after every stat change.

PHANTOM is intentionally hard to reach. WISDOM grows ~2 per commit, requiring ~45 commits minimum just for the base stat. Combined with the 90-day age requirement and all stats ≥ 75, it represents months of consistent use.

## Persistence

All data stored in `~/.spore/`.

### Directory Structure

```
~/.spore/
├── companion.json          # Current companion state
├── events.jsonl            # Event log (append-only, rotates at 10K lines)
├── backups/
│   └── companion-YYYY-MM-DD.json
└── obituaries/
    └── YYYY-MM-DD-HH-MM-SS.json   # Reset companions
```

### companion.json Schema

```json
{
  "version": 1,
  "name": "Spore",
  "born": "2026-04-01T12:00:00.000Z",
  "stage": "spore",
  "stageHistory": [
    { "stage": "spore", "date": "2026-04-01T12:00:00.000Z" }
  ],
  "stats": {
    "debugging": 0,
    "patience": 50,
    "chaos": 0,
    "wisdom": 0,
    "snark": 10
  },
  "totalCommits": 0,
  "totalSessions": 0,
  "totalEvents": 0,
  "worstBugDay": null,
  "worstBugDayCount": 0,
  "topProject": null,
  "topProjectCommits": 0,
  "projects": {},
  "lastCommit": null,
  "lastActive": "2026-04-01T12:00:00.000Z",
  "errorStreak": 0
}
```

Initial stats: PATIENCE starts at 50 (benefit of the doubt), SNARK at 10 (slight attitude from birth). All others at 0.

### events.jsonl Format

One JSON object per line:
```json
{"type":"commit","timestamp":"2026-04-01T12:30:00.000Z","project":"/home/user/app","deltas":{"patience":3,"chaos":-1,"wisdom":2}}
```

### Atomic Writes

State writes use write-to-temp-then-rename pattern:
1. Write to `companion.json.tmp`
2. `fs.renameSync()` to `companion.json`

This prevents corruption from interrupted writes.

### Event Log Rotation

When `events.jsonl` exceeds 10,000 lines:
1. Rename to `events-YYYY-MM-DD.jsonl.old`
2. Create fresh `events.jsonl`
3. Keep max 3 archived files, delete oldest

### Backups

On first event of each week (checked by comparing dates):
1. Copy `companion.json` to `backups/companion-YYYY-MM-DD.json`
2. Keep max 8 backups, delete oldest

## CLI Commands (MVP)

Binary name: `spore`. Package name: `spore-cli`.

### `spore status`

Displays:
1. ASCII sprite for current stage
2. Stage name and age
3. Stat bars (visual, 20-char wide)
4. Contextual dialogue line

Example output:
```
    .·.
   (   )        SPORE  (born 2 days ago)
    `·´
              DEBUG  ████░░░░░░░░░░░░░░░░  18
              PATIENCE ██████████░░░░░░░░░░  50
              CHAOS  ██░░░░░░░░░░░░░░░░░░   8
              WISDOM ░░░░░░░░░░░░░░░░░░░░   2
              SNARK  ██░░░░░░░░░░░░░░░░░░  10

  "What's a segfault? Is it like a earthquake but for code?"
```

### `spore stats`

Shows evolution history with dates, total commits, sessions, age, top project, worst bug day.

### `spore log`

Shows last 20 events from `events.jsonl` in human-readable format:
```
[2026-04-01 10:30] commit  PATIENCE +3  CHAOS -1  WISDOM +2
[2026-04-01 09:15] error_repeated  PATIENCE -3  CHAOS +4  SNARK +8
```

### `spore feed`

Applies feed event (+PATIENCE, -CHAOS, -SNARK). Shows a grateful dialogue line. Rate-limited to once per 10 minutes.

### `spore reset`

1. Prompts for confirmation (reads stdin)
2. Saves current state to `obituaries/` with cause of death, final stats, age, stage
3. Creates fresh companion.json with default state

### `spore install-hooks`

1. Checks current directory is a git repo
2. Creates/appends to `.git/hooks/post-commit`
3. Hook script calls `spore event commit --project=$(pwd)`
4. Makes hook executable

### `spore event <type>` (internal)

Not user-facing (undocumented). Called by hooks and adapters. Processes an event, updates stats, checks evolution, persists state.

## Dialogue System

### Structure

Each dialogue line has:
- `stage`: which evolution stage it belongs to
- `trigger`: event type that can show this line (status, commit, error, evolution, long_session, feed, first_commit_of_day)
- `condition`: optional function over stats (e.g., `snark > 60`)
- `text`: the dialogue string

### Selection Algorithm

1. Filter lines by current stage
2. Filter by trigger type
3. Filter by condition (if present, must return true)
4. Random selection from remaining candidates
5. If no candidates with conditions match, fall back to lines without conditions

### Line Count

Minimum 15 lines per stage across all triggers = 75 lines minimum. Target ~100 lines total for a rich experience.

### Tone Guidelines

- SPORE: Innocent curiosity. "What does `npm` stand for? Never Properly Maintained?"
- SPRITE: Playful understanding. "Another commit! I'm starting to understand this... I think."
- WRAITH: Dry opinions. "I've seen your code. I have... opinions."
- SPECTER: Sardonic wisdom. "Remember March 15th? I do. We don't talk about March 15th."
- PHANTOM: Existential condescension. "I've transcended the need for semicolons. You haven't."

Special triggers for memorable events:
- First commit of the day: encouraging or sarcastic depending on SNARK
- Error streak (3+): escalating commentary
- Evolution moment: dramatic one-liner about transformation
- Long session: philosophical musing about time

## ASCII Sprites

Five sprites, max 8 lines tall × 20 chars wide. Must render correctly in monospace terminals with UTF-8 support.

```
SPORE:              SPRITE:             WRAITH:
    .·.               ∴ ∵                ╭─╮
   (   )             ╱ ◯ ╲              ─┤◈├─
    `·´             │ ═══ │             ╭┤ ├╮
                     ╲   ╱              │╰─╯│
                      `─´               ╰┬─┬╯
                                         │ │

SPECTER:            PHANTOM:
   ╔═══╗              ░░▓▓░░
  ║ ◉ ◉ ║            ░▓╔══╗▓░
  ║  ▽  ║            ▓║ ◆◆ ║▓
  ╚═╤═╤═╝            ▓║ ═══ ║▓
  ░═╡ ╞═░            ░▓╚══╝▓░
  ░ │ │ ░              ░░▓▓░░
    ╧ ╧                 ░░░░
```

## Project Structure

```
spore/
├── bin/
│   └── spore.js                  # Shebang entry point
├── src/
│   ├── index.js                  # CLI entry: parse argv, route commands
│   ├── cli/
│   │   ├── commands.js           # Command handlers
│   │   ├── renderer.js           # ASCII + stat bar rendering
│   │   └── colors.js             # ANSI color helpers
│   ├── core/
│   │   ├── events.js             # Event processing pipeline
│   │   ├── stats.js              # Stat delta application
│   │   └── evolution.js          # Stage threshold checks
│   ├── data/
│   │   ├── state.js              # companion.json read/write
│   │   ├── eventlog.js           # JSONL append/read/rotate
│   │   └── backup.js             # Weekly backup logic
│   ├── dialogue/
│   │   ├── engine.js             # Dialogue selection
│   │   └── lines.js              # All dialogue lines
│   ├── sprites/
│   │   └── ascii.js              # Sprites per stage
│   └── hooks/
│       └── git.js                # Git hook installer
├── test/
│   ├── stats.test.js
│   ├── evolution.test.js
│   ├── events.test.js
│   ├── dialogue.test.js
│   ├── state.test.js
│   └── eventlog.test.js
├── package.json
├── LICENSE
├── README.md
├── README.es.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    └── PULL_REQUEST_TEMPLATE.md
```

## package.json Key Fields

```json
{
  "name": "spore-cli",
  "version": "1.0.0",
  "description": "An evolutionary terminal companion that grows with your development habits",
  "bin": { "spore": "./bin/spore.js" },
  "engines": { "node": ">=18.0.0" },
  "files": ["bin/", "src/", "LICENSE", "README.md"],
  "license": "MIT",
  "keywords": ["cli", "terminal", "companion", "developer-tools", "ascii-art"]
}
```

Node 18+ for built-in test runner and stable fs promises.

## Testing Strategy

- Test runner: `node:test` (built-in)
- Assertions: `node:assert`
- Coverage: `c8` (devDependency only)
- Target: 80%+ coverage on core modules

Key test areas:
- `stats.js`: delta application, diminishing returns, clamping
- `evolution.js`: stage thresholds, one-directional progression
- `events.js`: event processing, stat modifications
- `dialogue/engine.js`: filtering, condition evaluation, fallback behavior
- `data/state.js`: atomic writes, corruption recovery
- `data/eventlog.js`: append, rotation, read-last-N

All tests use a temp directory for `~/.spore/` to avoid touching real state.

## Post-MVP Roadmap

These features are excluded from v1.0 but documented for future contributors:

- **`spore export` / `spore import`**: Serialize/deserialize companion for machine migration
- **`spore watch`**: File watcher for active projects (tracks file changes, build errors)
- **Adapter system**: `spore adapter <name>` for eslint, jest, tsc, etc.
- **Silent mode**: `SPORE_SILENT=1` env var for CI/CD
- **Configurable dialogue packs**: Community-contributed dialogue themes
- **Multi-companion**: Multiple companions for different projects
