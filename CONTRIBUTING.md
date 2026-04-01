# Contributing to Spore

Thank you for your interest in contributing. Spore is a small project with a clear scope, and every contribution helps make it more useful for developers everywhere.

---

## Ways to Contribute

- **Bug reports** — open an issue describing what happened and how to reproduce it
- **Feature suggestions** — open an issue before writing code for significant new features
- **Code contributions** — fork, branch, and send a pull request
- **Documentation** — fixes, improvements, translations
- **Testing** — try Spore in unusual environments and report what breaks

---

## Development Setup

```bash
# Fork the repo, then clone your fork
git clone https://github.com/your-username/spore.git
cd spore

# Install dev dependencies (only c8 for coverage)
npm install

# Run the test suite
npm test

# Run tests with coverage report
npm run test:coverage

# Try the CLI locally without installing globally
node bin/spore.js status
```

Node.js 18 or higher is required.

---

## Project Structure

```
spore/
├── bin/
│   └── spore.js          # CLI entry point
├── src/
│   ├── cli/
│   │   ├── commands.js   # Command implementations
│   │   ├── colors.js     # ANSI color helpers
│   │   └── renderer.js   # Output formatting
│   ├── core/
│   │   ├── events.js     # Event processor and delta table
│   │   ├── evolution.js  # Stage thresholds and progression
│   │   └── stats.js      # Stat mutation with diminishing returns
│   ├── data/
│   │   ├── state.js      # Companion state load/save
│   │   ├── eventlog.js   # JSONL event log management
│   │   └── backup.js     # Weekly backup logic
│   ├── dialogue/
│   │   └── engine.js     # Dialogue selection
│   ├── sprites/
│   │   └── ascii.js      # ASCII sprites per stage
│   └── index.js
└── test/
    └── *.test.js
```

---

## Code Style

- **ESM modules** — use `import`/`export`, no CommonJS `require()`
- **Zero runtime dependencies** — if you need a library, think twice. If you still need it, open an issue to discuss before implementing
- **Node.js built-ins only** — `node:fs`, `node:path`, `node:readline`, etc.
- **Testing with `node:test`** — built-in test runner, no Jest or Mocha
- **No build step** — the code runs directly; keep it that way
- **Functional where practical** — prefer pure functions and explicit data flow
- **Descriptive names over comments** — code should explain itself

### Formatting

- 2-space indentation
- Single quotes for strings
- Semicolons at line endings
- No trailing whitespace

There is no linter configured yet. Use judgment consistent with the existing code.

---

## Writing Tests

Tests live in `test/` and use Node.js's built-in `node:test` module. Look at existing test files for patterns.

Key rules:
- Every new feature needs tests
- Bug fixes should include a regression test that fails before the fix
- Tests should run in isolation — no shared mutable state between tests
- Use `SPORE_DIR` environment variable to point tests at a temporary directory

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('description of what this tests', () => {
  // arrange
  // act
  // assert
  assert.equal(actual, expected);
});
```

---

## Commit Convention

Commits must follow this format:

```
TYPE: brief description
```

| Type | When to use |
|---|---|
| `FEAT` | New feature or capability |
| `FIX` | Bug fix |
| `DOCS` | Documentation changes only |
| `TEST` | Adding or modifying tests |
| `REFACTOR` | Code restructuring without behavior change |
| `STYLE` | Formatting, whitespace, no logic change |
| `PERF` | Performance improvement |
| `CHORE` | Dependency updates, tooling, maintenance |
| `BUILD` | Changes to build or release process |

Examples:
- `FEAT: add export command for companion state`
- `FIX: correct stat bar rendering for zero values`
- `DOCS: add adapter integration guide`
- `TEST: add coverage for diminishing returns edge cases`

Rules:
- Use imperative present tense ("add", not "added" or "adds")
- Keep the summary under 50 characters
- No period at the end

---

## Pull Request Guidelines

1. **Open an issue first** for significant changes — get alignment before investing time
2. **Branch from `main`** — use a descriptive branch name like `feat/export-import` or `fix/zero-stat-bar`
3. **Keep PRs focused** — one feature or fix per PR; avoid mixing concerns
4. **Tests required** — PRs without tests for new functionality will be asked to add them
5. **Update documentation** if your change affects user-facing behavior
6. **Link to the issue** your PR addresses using `Closes #123` in the description

### PR Description

Use the pull request template. At minimum include:
- What changed and why
- How you tested it
- The issue it closes (if applicable)

---

## Good First Issues

If you are new to the project, these are well-scoped areas to start:

- **Export / Import command** — serialize `companion.json` to a portable format, allow restoring from it
- **Watch command** — passive monitoring mode that listens for filesystem or shell events
- **Editor adapter** — VS Code or Neovim plugin that fires events on save, build, test
- **CI adapter** — trigger events from GitHub Actions or similar
- **Stats display improvements** — more granular rendering, trend indicators

Open an issue to claim one before starting — this avoids duplicate effort.

---

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) Code of Conduct. By participating, you agree to uphold it.

In short: be respectful, assume good intent, focus on the work.

---

## Questions

Open a GitHub issue with the `question` label. There are no bad questions.
