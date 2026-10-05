#!/bin/bash
set -euo pipefail
source "$(dirname "$0")/../../static/setup/mac.sh"
closed() { :; }
work=$(mktemp -d); work=$(cd "$work" && pwd -P)
root="$work/root"; mkdir "$root" "$work/restore"
file="$root/launcher_ui_state.json"
cat > "$file" <<'JSON'
#$
Internal launcher state
$#
{"data":{"UiEvents":"{\"hidePlayerSafetyDisclaimer\":{\"other-profile\":true},\"hasSeenDialog\":{\"news\":true}}","UiSettings":"unchanged"},"formatVersion":1}
JSON
cp "$file" "$work/original"
set_launcher_acknowledgement "$root" "$work" <<< ''
/usr/bin/osascript -l JavaScript - "$file" <<'JS'
ObjC.import('Foundation');
function run(args) {
  const raw=ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError(args[0],$.NSUTF8StringEncoding,null));
  const d=JSON.parse(raw.slice(raw.indexOf('{'))), e=JSON.parse(d.data.UiEvents);
  if (!e.hidePlayerSafetyDisclaimer['fabric-loader-0.19.5-1.21.11_survivors-united-1.21.11'] || !e.hidePlayerSafetyDisclaimer['other-profile'] || !e.hasSeenDialog.news || d.data.UiSettings !== 'unchanged' || raw.indexOf('#$\nInternal launcher state\n$#\n') !== 0) throw Error('Preservation failed');
}
JS
cmp "$work/original" "$work/restore/launcher_ui_state.json"
set_launcher_acknowledgement "$root" "$work" < /dev/null
cmp "$work/original" "$work/restore/launcher_ui_state.json"
printf '%s' "$root" > "$work/root.path"; printf '%s' "$root" > "$work/game.path"
restore_setup "$work"
cmp "$work/original" "$file"
set_launcher_acknowledgement "$root" "$work" <<< n
cmp "$work/original" "$file"
printf 'unknown future format' > "$file"
set_launcher_acknowledgement "$root" "$work" <<< ''
[ "$(cat "$file")" = 'unknown future format' ]
printf 'Mac warning acknowledgement, consent, preservation and restore passed: %s\n' "$work"
