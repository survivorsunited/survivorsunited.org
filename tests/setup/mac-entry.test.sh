#!/bin/bash
set -euo pipefail
script="$(dirname "$0")/../../static/setup/mac.sh"
# Check the exact bash -c entry style without installs, downloads or a Mac.
uname() { if [ "$1" = -s ]; then printf 'Darwin\n'; else printf 'x86_64\n'; fi; }
sysctl() { printf '0\n'; }
pgrep() { printf '%s\n' "$$"; }
export -f uname sysctl pgrep
bash -c "$(cat "$script")" -- --check-only
