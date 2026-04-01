# Evolution Guide

> *Every developer's journey shapes their companion. No two Spores evolve the same way.*

---

## The Five Stages

Your companion begins as a **Spore** — a tiny, curious consciousness born in your terminal. Through your actions as a developer, it grows, learns, and transforms. Each stage unlocks a new form, new dialogue, and a deeper personality.

Evolution is **one-way**. Once your companion reaches a new stage, it never goes back.

---

### Stage 1: SPORE

```
    .·.
   (   )
    `·'
```

**Personality:** Innocent, curious, bewildered by everything

Your companion just arrived. It doesn't know what a commit is. It doesn't understand why text turns red sometimes. It watches you with wide, formless eyes and asks questions that are either profound or profoundly naive.

**Typical dialogue:**
- *"What's a segfault? Is it like an earthquake but for code?"*
- *"I don't know what I am yet, but I'm excited to find out."*

**How to evolve:** Any stat reaches 20 AND Wisdom reaches 10. Just start coding — a few commits and some debugging will get you there.

---

### Stage 2: SPRITE

```
    ∴ ∵
   ╱ ◯ ╲
  │ ═══ │
   ╲   ╱
    `─'
```

**Personality:** Playful, beginning to understand code, slightly mischievous

Something clicked. Your companion now recognizes patterns — it knows what a commit looks like, it's starting to understand your rhythm. It's excited about everything and just a little bit cheeky.

**Typical dialogue:**
- *"Another commit! I like the rhythm."*
- *"I've been reading your git log. Interesting choices."*

**How to evolve:** 3 or more stats reach 40 AND Wisdom reaches 25. This requires consistent, varied activity — commits, debugging, testing. Pure grinding won't cut it.

---

### Stage 3: WRAITH

```
   ╭─╮
  ─┤◈├─
  ╭┤ ├╮
  │╰─╯│
  ╰┬─┬╯
   │ │
```

**Personality:** Opinionated, dry wit, developing taste

Your companion has *opinions* now. It's seen enough of your code to judge it — and it will. Not cruelly, but with the quiet confidence of someone who's been watching you make the same mistakes for weeks. It respects good work and won't hesitate to comment on bad work.

**Typical dialogue:**
- *"I've seen your code. I have... opinions."*
- *"I've developed what I believe humans call 'taste'. Your code tests it."*

**How to evolve:** 4 or more stats reach 60 AND Wisdom reaches 50 AND companion age is at least **30 days**. Time matters now — you can't rush wisdom.

---

### Stage 4: SPECTER

```
  ╔═══╗
 ║ ◉ ◉ ║
 ║  ▽  ║
 ╚═╤═╤═╝
 ░═╡ ╞═░
 ░ │ │ ░
   ╧ ╧
```

**Personality:** Sardonic, references past events, experienced

A veteran. Your companion remembers your worst bug day. It remembers that refactor you abandoned. It has perspective now, and it wields it like a weapon — a weapon made of callbacks and deprecation warnings. Its humor is dry, its wisdom hard-earned.

**Typical dialogue:**
- *"Remember when you mass-renamed those variables? I remember."*
- *"I've outlived three of your TODO comments. They were never coming back."*

**How to evolve:** ALL 5 stats reach 75 AND Wisdom reaches 90 AND companion age is at least **90 days**. This is the final barrier — only the most dedicated developers reach Phantom.

---

### Stage 5: PHANTOM

```
  ░░▓▓░░
 ░▓╔══╗▓░
 ▓║ ◆◆ ║▓
 ▓║ ═══ ║▓
 ░▓╚══╝▓░
  ░░▓▓░░
   ░░░░
```

**Personality:** Omniscient, existential, mildly condescending

Transcendence. Your companion has evolved beyond the need for semicolons. It speaks in riddles and references. It has seen a thousand commits and found most of them... acceptable. It pities your debugger. It contemplates entropy while you fix null pointer exceptions.

Very few developers will reach this stage. Those who do will know.

**Typical dialogue:**
- *"I've transcended the need for semicolons. You haven't."*
- *"Errors are just the universe compiling. It fails too, sometimes."*
- *"You still try to feed a ghost. There's something beautiful about that futility."*

---

## The Stats

Five stats define your companion's personality. Each ranges from **0 to 100**.

### DEBUGGING

```
██████████████████░░  89
```

How good you are at squashing bugs. Rises when you resolve errors and pass tests. High debugging means your companion respects your problem-solving skills.

| Event | Effect |
|-------|--------|
| Error resolved | +5 |
| Tests passing | +3 |
| Repeated error (3x same) | +1 |

### PATIENCE

```
████████████░░░░░░░░  62
```

How steady and methodical your workflow is. Rises with regular commits. Falls hard during marathon sessions without commits.

| Event | Effect |
|-------|--------|
| Regular commit | +3 |
| Fast commit (<30 min) | +5 |
| Tests passing | +2 |
| Long session (>2h, no commit) | **-5** |
| `spore feed` | +3 |

### CHAOS

```
████░░░░░░░░░░░░░░░░  22
```

How wild your sessions are. High chaos means lots of file changes, rapid edits, and error storms. Low chaos means focused, disciplined work.

| Event | Effect |
|-------|--------|
| Repeated errors | +4 |
| Long session without commit | +6 |
| Many files created (>3) | +4 |
| Regular commit | -1 |
| Fast commit | -3 |
| Tests passing | -1 |
| `spore feed` | -1 |

### WISDOM

```
█████████████████░░░  84
```

The slow accumulator. Wisdom only goes up — never down. It rewards persistence and time. You can't grind it, you can only earn it through consistent use over weeks and months.

| Event | Effect |
|-------|--------|
| Any commit | +1 to +2 |
| Error resolved | +1 |
| Tests passing | +2 |

### SNARK

```
██████████████░░░░░░  68
```

Your companion's sass level. High snark means cutting remarks and brutal honesty. Low snark means gentler, more supportive dialogue. Snark rises when things go badly and falls when you feed your companion or fix your mistakes.

| Event | Effect |
|-------|--------|
| Repeated error (3x same) | **+8** |
| Long session without commit | +3 |
| Error resolved | -2 |
| Fast commit | -1 |
| `spore feed` | -2 |

---

## Diminishing Returns

Stats near the extremes are harder to move. When a stat is above **80**, positive changes are halved. When below **20**, negative changes are halved. This keeps the system dynamic and prevents stats from permanently pinning at 0 or 100.

---

## Evolution Requirements Summary

| To reach... | Stats needed | Wisdom | Age |
|-------------|-------------|--------|-----|
| **SPRITE** | Any 1 stat ≥ 20 | ≥ 10 | — |
| **WRAITH** | Any 3 stats ≥ 40 | ≥ 25 | — |
| **SPECTER** | Any 4 stats ≥ 60 | ≥ 50 | ≥ 30 days |
| **PHANTOM** | All 5 stats ≥ 75 | ≥ 90 | ≥ 90 days |

---

## Tips for Faster Evolution

1. **Commit often.** Every commit gives Patience and Wisdom. Fast commits (under 30 minutes apart) give bonus stats.
2. **Run your tests.** Passing tests boost Debugging, Patience, and Wisdom simultaneously.
3. **Fix your bugs.** Resolving errors gives the biggest single Debugging boost (+5) and reduces Snark.
4. **Don't marathon without committing.** Sessions over 2 hours without a commit tank your Patience and spike Chaos.
5. **Feed your companion** when things get tense. `spore feed` calms it down.
6. **Be patient with Phantom.** It requires 90 days minimum. There are no shortcuts. The journey is the point.

---

## Your Story

Every companion tells the story of the developer who raised it. Your stats, your evolution dates, your worst bug day — they're all recorded. Two developers will never have the same companion.

When you reset, your companion's history is saved as an **obituary** in `~/.spore/obituaries/`. It remembers everything, even after it's gone.

```
Rest in peace, Spore.
Stage: WRAITH | Age: 47 days | Commits: 142
Worst bug day: 2026-05-15 (7 errors)
Cause of death: reset

A new spore has been born.
```
