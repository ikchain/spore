export const SPRITES = {
  spore: [
    '    .·.    ',
    '   (   )   ',
    "    `·'    ",
  ],
  sprite: [
    '    ∴ ∵    ',
    '   ╱ ◯ ╲   ',
    '  │ ═══ │  ',
    '   ╲   ╱   ',
    "    `─'    ",
  ],
  wraith: [
    '   ╭─╮    ',
    '  ─┤◈├─   ',
    '  ╭┤ ├╮   ',
    '  │╰─╯│   ',
    '  ╰┬─┬╯   ',
    '   │ │    ',
  ],
  specter: [
    '  ╔═══╗   ',
    ' ║ ◉ ◉ ║  ',
    ' ║  ▽  ║  ',
    ' ╚═╤═╤═╝  ',
    ' ░═╡ ╞═░  ',
    ' ░ │ │ ░  ',
    '   ╧ ╧    ',
  ],
  phantom: [
    '  ░░▓▓░░  ',
    ' ░▓╔══╗▓░ ',
    ' ▓║ ◆◆ ║▓ ',
    ' ▓║ ═══ ║▓',
    ' ░▓╚══╝▓░ ',
    '  ░░▓▓░░  ',
    '   ░░░░   ',
  ],
};

export function getSprite(stage) {
  return SPRITES[stage] || SPRITES.spore;
}
