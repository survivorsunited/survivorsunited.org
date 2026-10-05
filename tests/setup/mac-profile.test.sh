#!/bin/bash
set -euo pipefail
source "$(dirname "$0")/../../static/setup/mac.sh"
test_tmp=$(cd "${TMPDIR:-/tmp}" && pwd -P)
fixture=$(mktemp -d "$test_tmp/su-profile-test-XXXXXXXX")
mkdir "$fixture/backup"
printf '%s' '{"profiles":{"old":{"name":"Keep me","javaArgs":"-Xmx2G"}},"settings":{"keep":true}}' > "$fixture/launcher_profiles.json"
cp "$fixture/launcher_profiles.json" "$fixture/original.json"
set_profile "$fixture/launcher_profiles.json" "$fixture/game with spaces" /java21/bin/java "$fixture/backup"
cmp -s "$fixture/original.json" "$fixture/backup/launcher_profiles.json"
/usr/bin/osascript -l JavaScript - "$fixture/launcher_profiles.json" <<'JS'
ObjC.import('Foundation');
function run(args) {
 const text=$.NSString.stringWithContentsOfFileEncodingError(args[0], $.NSUTF8StringEncoding,null);
 const data=JSON.parse(ObjC.unwrap(text));
 if(data.profiles['survivors-united-1.21.11'].javaArgs!=='-Xmx8G') throw Error('8 GB maximum heap missing');
 if(data.profiles.old.javaArgs!=='-Xmx2G' || !data.settings.keep) throw Error('Existing profile or settings changed');
 return 'Mac profile: 8 GB heap, existing settings and original backup verified.';
}
JS
# Repeat setup should not open Launcher or prompt when profile files already exist.
closed() { :; }
open() { printf 'Unexpected Launcher open\n' >&2; return 1; }
prepare_launcher "$fixture" /Applications/Minecraft.app
confirm_launcher 'Default Yes' <<< ''
if confirm_launcher 'Explicit No' <<< n; then printf 'No was accepted\n'; exit 1; fi
checks=0
closed() { checks=$((checks+1)); [ "$checks" -ge 2 ]; }
wait_launcher_closed <<< ''
[ "$checks" -eq 2 ]
closed() { :; }
fresh="$fixture/fresh"
mkdir "$fresh"
open() { :; }
confirm_launcher() { printf '%s' '{"profiles":{}}' > "$fresh/launcher_profiles.json"; }
prepare_launcher "$fresh" /Applications/Minecraft.app
launcher_profiles_ready "$fresh"
printf '%s' '{"profiles":[]}' > "$fresh/launcher_profiles.json"
if launcher_profiles_ready "$fresh"; then printf 'Invalid profile accepted\n'; exit 1; fi
printf 'Mac Launcher readiness, existing setup, retry, default Yes and cancellation verified.\n'
