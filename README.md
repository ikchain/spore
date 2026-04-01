# Spore

**An evolutionary terminal companion that grows with your coding habits.**

[![npm version](https://img.shields.io/npm/v/spore-cli.svg)](https://www.npmjs.com/package/spore-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

---

```
    .·.      SPORE  (born today)
   (   )
    `·'      DEBUGGING  ██████████░░░░░░░░░░   52
             PATIENCE   ███████████████░░░░░   74
             CHAOS      ████████░░░░░░░░░░░░   38
             WISDOM     █████████████░░░░░░░   65
             SNARK      ██████░░░░░░░░░░░░░░   29

  "Still compiling. Probably fine."
```

---

## What is Spore?

Spore is a terminal companion that watches you code and evolves alongside you. Every commit you push, every test you pass, every bug you fight through — it all shapes your companion's personality and pushes it toward the next evolutionary stage.

It starts as a humble spore. Given enough commits, patience, and chaos, it might one day become a Phantom.

## Features

- **5 Evolution Stages** — SPORE → SPRITE → WRAITH → SPECTER → PHANTOM, each with a unique ASCII sprite and personality
- **5 Stats System** — DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK tracked across your real dev activity
- **Git Hook Integration** — auto-records commits via `post-commit` hook with a single setup command
- **Contextual Dialogue** — 80+ lines that shift based on your stage and current stats
- **Diminishing Returns** — stats near extremes are harder to push, keeping things balanced
- **Persistent State** — stored in `~/.spore/` as plain JSON, survives reboots and reinstalls
- **Event Log** — JSONL audit trail with automatic rotation
- **Weekly Backups** — automatic snapshots so you never lose your companion's history
- **Zero Runtime Dependencies** — pure Node.js, nothing to break
- **NO_COLOR Support** — respects the terminal standard for colorless output

---

## Installation

```bash
npm install -g spore-cli
```

Requires Node.js 18 or higher.

---

## Quick Start

```bash
# See your companion
spore status

# Check detailed stats and history
spore stats

# Connect Spore to a git repo (one-time setup per project)
spore install-hooks

# Feed your companion manually
spore feed

# Browse recent events
spore log
```

After installing hooks, every `git commit` in that repo automatically triggers a `commit` event and updates your companion's stats.

---

## Commands

| Command | Description |
|---|---|
| `spore status` | Display your companion with current stats and a contextual line |
| `spore stats` | Show evolution history, commit count, and lifetime statistics |
| `spore log` | List the 20 most recent recorded events |
| `spore feed` | Give your companion a manual boost (10-minute cooldown) |
| `spore reset` | Reset your companion to a fresh state (saves an obituary) |
| `spore install-hooks` | Install the git post-commit hook in the current repository |
| `spore event <type>` | Manually trigger an event (see event types below) |

### Event Types

Events can be triggered manually via `spore event <type>`:

| Event | Effect |
|---|---|
| `commit` | Normal commit — rewards PATIENCE and WISDOM |
| `commit_fast` | Rapid commits — bigger PATIENCE boost, reduced CHAOS |
| `error_resolved` | Bug squashed — rewards DEBUGGING |
| `error_repeated` | Same bug, again — punishes PATIENCE, spikes CHAOS and SNARK |
| `session_long` | Long session — drains PATIENCE, feeds CHAOS and SNARK |
| `files_created` | New files — bumps CHAOS |
| `test_pass` | Tests green — rewards DEBUGGING, PATIENCE, and WISDOM |
| `feed` | Manual feed — recovers PATIENCE, softens SNARK |

---

## Evolution Stages

Your companion evolves as your stats develop. Each stage requires higher stats and, for later stages, a minimum number of days of existence.

| Stage | Sprite | Personality |
|---|---|---|
| SPORE | `.·. / (   ) / \`·'` | Quiet. Minimal. Just woke up. |
| SPRITE | `∴ ∵ / ╱◯╲ / │═══│` | Curious and a bit scattered. Starting to have opinions. |
| WRAITH | `╭─╮ / ─┤◈├─ / ╰┬─┬╯` | Sharp. Watching. Not entirely friendly. |
| SPECTER | `╔═══╗ / ║◉ ◉║ / ╚═╤═╤═╝` | Calculated. Dry wit. Has seen things. |
| PHANTOM | `░░▓▓░░ / ▓║◆◆║▓ / ░░▓▓░░` | Transcendent. Dense with experience. Rarely impressed. |

### Evolution Thresholds

Evolution is not just about time — it requires your stats to reflect real development activity:

- **SPRITE**: 1 stat above 20, WISDOM ≥ 10
- **WRAITH**: 3 stats above 40, WISDOM ≥ 25
- **SPECTER**: 4 stats above 60, WISDOM ≥ 50, companion age ≥ 30 days
- **PHANTOM**: all 5 stats above 75, WISDOM ≥ 90, companion age ≥ 90 days

---

## Stats System

| Stat | What it reflects |
|---|---|
| DEBUGGING | Your ability to find and fix problems |
| PATIENCE | Consistent, measured work over time |
| CHAOS | Turbulence in your session patterns |
| WISDOM | Accumulated experience and quality |
| SNARK | Built-up frustration from repeated errors and long sessions |

All stats live in the 0–100 range. Stats near the extremes (above 80 or below 20) have diminishing returns — the closer you are to the limit, the harder it is to push further.

---

## How It Works

Spore is driven by an **event system**. When something happens in your development environment — a commit, a test passing, a bug resolved — an event fires and updates your stats according to a delta table.

The git hook integration is the primary event source. After running `spore install-hooks` in a repo, every `git commit` calls `spore event commit` automatically. Other events can be triggered manually or by future integrations.

State is persisted immediately after every event. Nothing is lost between sessions.

---

## Storage

Spore keeps everything in `~/.spore/`:

| File | Contents |
|---|---|
| `companion.json` | Live companion state (stats, stage, history) |
| `events.jsonl` | Append-only event log with timestamps and deltas |
| `backups/` | Weekly automatic snapshots of `companion.json` |
| `obituaries/` | Saved states from past companions after `reset` |

The format is plain JSON — human-readable and easy to inspect.

---

## Configuration

| Variable | Default | Description |
|---|---|---|
| `SPORE_DIR` | `~/.spore` | Override the data directory |
| `NO_COLOR` | _(unset)_ | Disable all ANSI color output |

Example:

```bash
SPORE_DIR=/tmp/spore-test spore status
```

---

## Roadmap

Post-MVP features planned for future releases:

- **Export / Import** — serialize your companion to a portable file, share it or restore it
- **Watch Mode** — passive background monitoring (filesystem, shell history)
- **Adapters** — hooks for CI runners, editors (Neovim, VS Code), test frameworks
- **Silent Mode** — suppress all output for scripting contexts
- **Multi-companion** — manage separate companions per project

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, code style, and PR guidelines.

Good first issues include implementing the export/import feature, building an editor adapter, and adding the watch command.

---

## License

MIT — see [LICENSE](LICENSE).

---

## Philosophy

Every tool you use every day should feel like it belongs to you.

Most developer tools are transactional. You invoke them, they respond, and both parties forget the interaction ever happened. Spore is the opposite. It accumulates. It remembers. Your debugging streaks, your 2am chaos sessions, the week you finally cleared the bug backlog — all of it leaves a mark.

The goal is not gamification. There are no points to optimize, no leaderboards to climb. The goal is a small, persistent presence in your terminal that reflects how you actually work. Something that grows with you rather than against you.

Your companion is yours. It starts the day you install it and evolves at its own pace. No two will look the same.
