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
for major in 17 21 22 25; do
  [ "$(java_major "openjdk version \"$major.0.2\"")" = "$major" ]
done
[ -z "$(java_major 'not a Java runtime')" ]
mkdir -p "$fixture/existing-java/bin"
cat > "$fixture/existing-java/bin/java" <<'JAVA'
#!/bin/bash
printf 'openjdk version "22.0.2"\n' >&2
JAVA
chmod +x "$fixture/existing-java/bin/java"
JAVA_HOME="$fixture/existing-java"
existing=$(find_existing_java)
[ "$existing" = "$JAVA_HOME/bin/java" ]
choose_existing_java "$existing" <<< ''
[ "$JAVA_SELECTION" = "$existing" ]
choose_existing_java "$existing" <<< n
[ -z "$JAVA_SELECTION" ]
printf 'Mac Java version detection, Java 22 reuse by default and specific Java 21 choice verified.\n'

confirm 'Initial setup defaults to Yes' <<< ''
