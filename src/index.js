import * as commands from './cli/commands.js';

const COMMANDS = {
  status: () => commands.status(),
  stats: () => commands.stats(),
  log: () => commands.log(),
  feed: () => commands.feed(),
  reset: () => commands.reset(),
  event: (args) => commands.event(args),
  'install-hooks': () => commands.installHooks(),
};

const HELP = `
  Usage: spore <command>

  Commands:
    status          Show companion sprite, stats, and dialogue
    stats           Show evolution history and statistics
    log             Show recent events
    feed            Feed your companion (calms it down)
    reset           Reset companion (saves obituary)
    install-hooks   Install git post-commit hook in current repo

  Options:
    --help, -h      Show this help message
    --version, -v   Show version
`;

export async function run(args) {
  const command = args[0] || 'status';

  if (command === '--help' || command === '-h') {
    process.stdout.write(HELP);
    return;
  }

  if (command === '--version' || command === '-v') {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, join } = await import('node:path');
    const dir = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(join(dir, '..', 'package.json'), 'utf-8'));
    process.stdout.write(`spore v${pkg.version}\n`);
    return;
  }

  const handler = COMMANDS[command];
  if (!handler) {
    process.stderr.write(`Unknown command: ${command}\nRun "spore --help" for usage.\n`);
    process.exit(1);
  }

  await handler(args.slice(1));
}
