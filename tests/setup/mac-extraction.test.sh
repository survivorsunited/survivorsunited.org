#!/bin/bash
set -euo pipefail
source "$(dirname "$0")/../../static/setup/mac.sh"
test_tmp=$(cd "${TMPDIR:-/tmp}" && pwd -P)
fixture=$(mktemp -d "$test_tmp/su-mac-extraction-XXXXXXXX")
mkdir -p "$fixture/source/install" "$fixture/source/mods/optional" "$fixture/source/shaderpacks" "$fixture/source/mods-server"
printf installer > "$fixture/source/install/fabric-installer-1.1.0.jar"
printf client > "$fixture/source/mods/client.jar"
printf optional > "$fixture/source/mods/optional/optional.jar"
printf shader > "$fixture/source/shaderpacks/§r-§lShader.zip"
printf server > "$fixture/source/mods-server/server.jar"
(cd "$fixture/source" && zip -qr "$fixture/pack.zip" .)
LC_ALL=C extract_pack "$fixture/pack.zip" "$fixture/extracted"
cmp "$fixture/source/install/fabric-installer-1.1.0.jar" "$fixture/extracted/install/fabric-installer-1.1.0.jar"
cmp "$fixture/source/mods/client.jar" "$fixture/extracted/mods/client.jar"
cmp "$fixture/source/mods/optional/optional.jar" "$fixture/extracted/mods/optional/optional.jar"
[ ! -e "$fixture/extracted/shaderpacks" ]
[ ! -e "$fixture/extracted/mods-server" ]
say "Client-only extraction passed under C locale. Evidence: $fixture"
