export const POST_COMMIT_HOOK = `#!/bin/sh
# Spore companion — post-commit hook
# Installed by: spore install-hooks
if command -v spore >/dev/null 2>&1; then
  spore event commit --project "$(pwd)" 2>/dev/null || true
fi
`;
