#!/bin/bash
# Survivors United macOS setup. Requires the macOS-provided Bash 3.2 or newer.
set -eEuo pipefail
MC_VERSION=1.21.11
LOADER_VERSION=0.19.5
PACK_URL=https://github.com/survivorsunited/minecraft-mods-manager/releases/download/release-2026.10.02-1.21.11-r3/modpack-1.21.11.zip
PACK_HASH=bcb3fcf4815edd3cac38a6c9258802758b05b0c92fe6f5260370bd064d8ccabc
SERVER=minecraft.survivorsunited.org
say() { printf '[Survivors United] %s\n' "$*"; }
fail() { say "STOPPED: $*" >&2; return 1; }
confirm() {
  local answer
  printf '%s [y/N] ' "$1"
  read -r answer
  case "$answer" in y|Y|yes|YES) ;; *) fail 'Stopped at your request. Run again when ready.';; esac
}
plain_path() {
  local path="$1"
  while [ "$path" != / ] && [ -n "$path" ]; do
    [ ! -L "$path" ] || { fail "Linked folders are not supported: $path. Use the manual wizard."; return 1; }
    path=$(dirname "$path")
  done
}
closed() {
  local pid
  for pid in $(pgrep -f '(/Minecraft.app/|net.minecraft.client|fabricmc.*KnotClient)' || true); do
    # bash -c includes the script text in its own command line.
    if [ "$pid" != "$$" ] && [ "$pid" != "$PPID" ]; then
      fail 'Close Minecraft and Minecraft Launcher, then run again. Nothing will be force-closed.'
      return 1
    fi
  done
}
verified_download() {
  local url="$1" target="$2" expected="$3" actual
  case "$url" in https://*) ;; *) fail 'Download URL must use HTTPS.'; return 1;; esac
  say "Downloading $url"
  curl --fail --location --proto '=https' --proto-redir '=https' --retry 2 --output "$target" "$url"
  actual=$(shasum -a 256 "$target" | awk '{print $1}')
  [ "$actual" = "$expected" ] || { fail "Download verification failed: $target. No mods replaced."; return 1; }
  say 'SHA256 verified.'
}
# Stage and verify all files before moving the current mods folder. Never delete a backup.
set_mods() {
  local pack="$1" game="$2" stage backup source dest found=0
  plain_path "$game" || return 1
  plain_path "$game/mods" || return 1
  [ ! -e "$game/mods" ] || [ -d "$game/mods" ] || { fail 'mods is not a folder.'; return 1; }
  [ -d "$pack/mods/optional" ] || { fail 'Optional client mods folder is missing.'; return 1; }
  stage=$(mktemp -d "$game/mods.su-staging-XXXXXXXX")
  backup="$game/mods.su-backup-$(date +%Y%m%d-%H%M%S)-$(basename "$stage")"
  for source in "$pack/mods/"*.jar "$pack/mods/optional/"*.jar; do
    [ -f "$source" ] || continue
    dest="$stage/$(basename "$source")"
    [ ! -e "$dest" ] || { fail 'Duplicate mod filename. Old mods remain in place.'; return 1; }
    cp -p "$source" "$dest"
    cmp -s "$source" "$dest" || { fail 'Copy verification failed. Old mods remain in place.'; return 1; }
    found=$((found + 1))
  done
  [ "$found" -gt 0 ] || { fail 'No client mods found. Old mods remain in place.'; return 1; }
  closed || return 1
  plain_path "$game/mods" || return 1
  if [ -d "$game/mods" ]; then
    mv "$game/mods" "$backup"
    say "Old mods backed up to $backup"
  fi
  if ! mv "$stage" "$game/mods"; then
    if [ -d "$backup" ] && [ ! -e "$game/mods" ]; then mv "$backup" "$game/mods"; fi
    fail 'Could not activate new mods. Old mods restored where possible.'
    return 1
  fi
  say "Installed and verified $found client mods. Worlds, config, maps and settings are untouched."
}
json_value() {
  /usr/bin/osascript -l JavaScript - "$1" "$2" <<'JS'
ObjC.import('Foundation');
function run(args) {
  const text = $.NSString.stringWithContentsOfFileEncodingError(args[0], $.NSUTF8StringEncoding, null);
  if (!text) throw new Error('Could not read JSON');
  let value = JSON.parse(ObjC.unwrap(text));
  for (const key of args[1].split('.')) value = value[key];
  if (typeof value !== 'string') throw new Error('Missing metadata value');
  return value;
}
JS
}
set_profile() {
  local file="$1" game="$2" java="$3" backup="$4"
  plain_path "$file"
  cp -p "$file" "$backup/$(basename "$file")"
  /usr/bin/osascript -l JavaScript - "$file" "$game" "$java" <<'JS'
ObjC.import('Foundation');
function run(args) {
  const file = args[0];
  const text = $.NSString.stringWithContentsOfFileEncodingError(file, $.NSUTF8StringEncoding, null);
  if (!text) throw new Error('Could not read launcher profiles');
  const data = JSON.parse(ObjC.unwrap(text));
  if (!data.profiles || typeof data.profiles !== 'object') throw new Error('Launcher profiles missing');
  data.profiles['survivors-united-1.21.11'] = {
    name:'Survivors United 1.21.11', type:'custom',
    lastVersionId:'fabric-loader-0.19.5-1.21.11', gameDir:args[1], javaDir:args[2]
  };
  if (!$(JSON.stringify(data, null, 2)).writeToFileAtomicallyEncodingError(file, true, $.NSUTF8StringEncoding, null)) throw new Error('Could not save launcher profile');
  return 'Launcher profile saved; existing profiles preserved.';
}
JS
}
main() {
  local root="$HOME/Library/Application Support/minecraft" game='' check=0 arch work java='' candidate package_url package_hash launcher mount
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --check-only) check=1; shift;;
      --game-directory) [ "$#" -ge 2 ] || { fail 'Missing Game Directory.'; return 1; }; game="$2"; shift 2;;
      *) fail "Unknown option: $1"; return 1;;
    esac
  done
  [ "$(uname -s)" = Darwin ] || { fail 'This script is for macOS. Use the Windows script on Windows.'; return 1; }
  arch=$(uname -m)
  if [ "$(sysctl -in sysctl.proc_translated 2>/dev/null || true)" = 1 ]; then arch=arm64; fi
  case "$arch" in arm64) arch=aarch64;; x86_64) arch=x64;; *) fail 'Unsupported Mac processor.'; return 1;; esac
  say "Target: Minecraft $MC_VERSION, Fabric $LOADER_VERSION, Mac $arch"
  say "Default Minecraft folder: $root"
  if [ "$check" = 1 ]; then
    say 'CHECK ONLY: no downloads, installations or file changes.'
    [ ! -d "$root" ] || say 'Minecraft folder exists.'
    /usr/libexec/java_home -v 21 2>/dev/null || true
    closed
    return
  fi
  confirm 'Proceed with Launcher/Java setup, Fabric installation and a backed-up mod replacement?'
  plain_path "$HOME/Library/Application Support/SurvivorsUnited"
  mkdir -p "$HOME/Library/Application Support/SurvivorsUnited"
  work=$(mktemp -d "$HOME/Library/Application Support/SurvivorsUnited/setup-XXXXXXXX")
  exec > >(tee -a "$work/setup.log") 2>&1
  say "Log and retained downloads: $work"
  say '(1/6) Checking Minecraft Launcher.'
  launcher=/Applications/Minecraft.app
  if [ ! -d "$launcher" ]; then launcher="$HOME/Applications/Minecraft.app"; fi
  if [ ! -d "$launcher" ]; then
    say 'Downloading the official launcher. Installing in your Applications folder; no administrator password needed.'
    curl --fail --location --proto '=https' --proto-redir '=https' --output "$work/Minecraft.dmg" https://launcher.mojang.com/download/Minecraft.dmg
    mount="$work/launcher-mount"
    mkdir "$mount"
    hdiutil attach "$work/Minecraft.dmg" -readonly -nobrowse -mountpoint "$mount"
    if ! codesign --verify --deep --strict "$mount/Minecraft.app"; then hdiutil detach "$mount"; fail 'Launcher signature verification failed.'; return 1; fi
    plain_path "$HOME/Applications"
    mkdir -p "$HOME/Applications"
    if ! ditto "$mount/Minecraft.app" "$HOME/Applications/Minecraft.app"; then hdiutil detach "$mount"; return 1; fi
    hdiutil detach "$mount"
    launcher="$HOME/Applications/Minecraft.app"
  fi
  open "$launcher"
  say 'Sign in with the account that owns Java Edition. Launch once to the main menu, then close the game and launcher.'
  confirm 'Have you reached the Java Edition main menu and closed both the game and launcher?'
  closed
  plain_path "$root"
  [ -f "$root/launcher_profiles.json" ] || { fail 'Launcher profiles missing. Complete the first Java Edition launch and rerun.'; return 1; }
  if [ -z "$game" ]; then
    printf 'If your old profile uses a custom Game Directory, enter it. Otherwise press Return [%s]: ' "$root"
    read -r game
    game=${game:-$root}
  fi
  case "$game" in /*) ;; *) fail 'Game Directory must be a full path beginning with /.'; return 1;; esac
  plain_path "$game"
  [ -d "$game" ] || { fail 'Game Directory does not exist. Check the old profile path.'; return 1; }
  game=$(cd "$game" && pwd -P)
  say "Mods will go in: $game"
  confirm 'Is this the Game Directory you want to install/update?'
  say '(2/6) Checking or downloading Java 21.'
  candidate=$(/usr/libexec/java_home -v 21 2>/dev/null || true)
  if [ -n "$candidate" ] && "$candidate/bin/java" -version 2>&1 | grep -q 'version "21[.\"]'; then java="$candidate/bin/java"; fi
  if [ -z "$java" ]; then
    say 'Installing a private Java 21 runtime for this setup; system Java stays unchanged.'
    curl --fail --location --proto '=https' --proto-redir '=https' --output "$work/java-metadata.json" "https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=$arch&image_type=jdk&os=mac&vendor=eclipse"
    package_url=$(json_value "$work/java-metadata.json" 0.binary.package.link)
    package_hash=$(json_value "$work/java-metadata.json" 0.binary.package.checksum)
    verified_download "$package_url" "$work/java21.tar.gz" "$package_hash"
    mkdir "$work/java21"
    tar -xzf "$work/java21.tar.gz" -C "$work/java21"
    java=$(find "$work/java21" -path '*/Contents/Home/bin/java' -type f)
    [ -n "$java" ] && [ "$(printf '%s\n' "$java" | wc -l | tr -d ' ')" = 1 ] || { fail 'Java runtime missing or ambiguous.'; return 1; }
  fi
  "$java" -version
  "$java" -version 2>&1 | grep -q 'version "21[.\"]' || { fail 'Java 21 verification failed.'; return 1; }
  say '(3/6) Downloading and verifying the pinned modpack.'
  verified_download "$PACK_URL" "$work/modpack.zip" "$PACK_HASH"
  unzip -q "$work/modpack.zip" -d "$work/pack"
  say '(4/6) Installing Fabric into the launcher folder.'
  closed
  plain_path "$root/versions"
  plain_path "$root/libraries"
  "$java" -jar "$work/pack/install/fabric-installer-1.1.0.jar" client -dir "$root" -mcversion "$MC_VERSION" -loader "$LOADER_VERSION" -noprofile
  [ -f "$root/versions/fabric-loader-$LOADER_VERSION-$MC_VERSION/fabric-loader-$LOADER_VERSION-$MC_VERSION.json" ] || { fail 'Fabric version verification failed.'; return 1; }
  set_profile "$root/launcher_profiles.json" "$game" "$java" "$work"
  say '(5/6) Staging new mods, verifying each copy, and backing up the old folder.'
  set_mods "$work/pack" "$game"
  say '(6/6) Setup complete. Open Launcher and choose Survivors United 1.21.11, then Play.'
  printf '%s' "$SERVER" | pbcopy
  say "In the game: Multiplayer > Add Server > Survivors United > $SERVER > Done > Join Server."
  say 'Server address copied. Your account and connection are checked when you launch and join; this script never asks for a password.'
}
if [ "${BASH_SOURCE[0]:-$0}" = "$0" ]; then
  trap 'say "STOPPED at line $LINENO. Keep the log and any backup folders; use the manual wizard or ask Discord for help." >&2' ERR
  main "$@"
fi
