#!/bin/bash
set -euo pipefail
source "$(dirname "$0")/../../static/setup/mac.sh"
closed() { :; }
fixture=$(mktemp -d /tmp/su-setup-test-XXXXXXXX)
pack="$fixture/pack"
game="$fixture/game with spaces"
mkdir -p "$pack/mods/optional" "$game/mods" "$game/saves" "$game/config"
printf new-client > "$pack/mods/client.jar"
printf optional-client > "$pack/mods/optional/optional.jar"
printf old-client > "$game/mods/old.jar"
printf world-kept > "$game/saves/world.dat"
printf config-kept > "$game/config/config.json"
set_mods "$pack" "$game"
[ -f "$game/mods/client.jar" ] && [ -f "$game/mods/optional.jar" ] && [ ! -f "$game/mods/old.jar" ]
[ "$(cat "$game/saves/world.dat")" = world-kept ]
[ "$(cat "$game/config/config.json")" = config-kept ]
[ "$(find "$game" -path '*/mods.su-backup-*/old.jar' | wc -l)" -eq 1 ]
set_mods "$pack" "$game"
[ "$(find "$game" -maxdepth 1 -type d -name 'mods.su-backup-*' | wc -l)" -eq 2 ]
cp "$pack/mods/client.jar" "$pack/mods/optional/client.jar"
if set_mods "$pack" "$game"; then printf 'Duplicate filename accepted\n'; exit 1; fi
[ -f "$game/mods/client.jar" ]
mkdir "$fixture/linked-parent"
ln -s "$game" "$fixture/linked-parent/linked-game"
if plain_path "$fixture/linked-parent/linked-game"; then printf 'Linked path accepted\n'; exit 1; fi
curl() {
  local output=''
  while [ "$#" -gt 0 ]; do
    if [ "$1" = --output ]; then output="$2"; shift 2; else shift; fi
  done
  printf corrupt-download > "$output"
}
if verified_download https://example.test/archive "$fixture/download" 0000000000000000000000000000000000000000000000000000000000000000; then
  printf 'Corrupt download accepted\n'; exit 1
fi
say "All Bash mod/backup fixtures passed. Evidence retained: $fixture"
# Force only activation to fail, then confirm the old folder returns.
rollback_game="$fixture/rollback game"
mkdir -p "$rollback_game/mods" "$fixture/clean-pack/mods/optional"
printf rollback-old > "$rollback_game/mods/old.jar"
printf main > "$fixture/clean-pack/mods/client.jar"
mv() {
  case "$1" in */mods.su-staging-*) return 1;; *) command mv "$@";; esac
}
if set_mods "$fixture/clean-pack" "$rollback_game"; then printf 'Expected activation failure\n'; exit 1; fi
[ "$(cat "$rollback_game/mods/old.jar")" = rollback-old ]
say 'Bash activation failure restored the original mods.'
