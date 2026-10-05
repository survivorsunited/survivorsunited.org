#!/bin/bash
set -euo pipefail
source "$(dirname "$0")/../../static/setup/mac.sh"
work=$(mktemp -d)
cat > "$work/release.json" <<'JSON'
{"draft":false,"prerelease":false,"tag_name":"test","assets":[{"name":"modpack-1.21.11.zip","browser_download_url":"https://github.com/survivorsunited/minecraft-mods-manager/releases/download/test/modpack-1.21.11.zip"},{"name":"release-hashes.txt","browser_download_url":"https://github.com/survivorsunited/minecraft-mods-manager/releases/download/test/release-hashes.txt"}]}
JSON
resolve_pack_release "$work/release.json" > "$work/resolved"
grep -q '^test$' "$work/resolved"
hash=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
printf '%s  modpack-1.21.11.zip\r\n' "$hash" > "$work/hashes"
[ "$(pack_hash "$work/hashes")" = "$hash" ]
cat "$work/hashes" "$work/hashes" > "$work/duplicate"
if pack_hash "$work/duplicate"; then exit 1; fi
printf '%s  other.zip\n' "$hash" > "$work/missing"
if pack_hash "$work/missing"; then exit 1; fi
sed 's/"prerelease":false/"prerelease":true/' "$work/release.json" > "$work/prerelease"
if resolve_pack_release "$work/prerelease" 2>/dev/null; then exit 1; fi
sed 's@github.com/@example.com/@g' "$work/release.json" > "$work/untrusted"
if resolve_pack_release "$work/untrusted" 2>/dev/null; then exit 1; fi
sed 's/modpack-1.21.11.zip/other.zip/g' "$work/release.json" > "$work/no-pack"
if resolve_pack_release "$work/no-pack" 2>/dev/null; then exit 1; fi
if [ "${1:-}" = --live ]; then latest_pack "$work"; fi
printf 'Mac release selection checks passed. Evidence: %s\n' "$work"
