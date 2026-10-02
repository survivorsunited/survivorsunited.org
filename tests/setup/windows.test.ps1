param([string]$Script = "$PSScriptRoot/../../static/setup/windows.ps1")
$ErrorActionPreference = 'Stop'
. ([scriptblock]::Create((Get-Content -LiteralPath $Script -Raw)))
function Assert-Closed { }
function Assert([bool]$Condition,[string]$Message) { if (!$Condition) { throw $Message } }
$fixture = Join-Path $env:TEMP ('su-setup-test-' + [Guid]::NewGuid().ToString('N'))
$pack = Join-Path $fixture 'pack'
$game = Join-Path $fixture 'game with spaces'
New-Item -ItemType Directory -Path "$pack/mods/optional", "$game/mods", "$game/saves", "$game/config" -Force | Out-Null
[IO.File]::WriteAllText("$pack/mods/client.jar",'new-client')
[IO.File]::WriteAllText("$pack/mods/optional/optional.jar",'optional-client')
[IO.File]::WriteAllText("$game/mods/old.jar",'old-client')
[IO.File]::WriteAllText("$game/saves/world.dat",'world-kept')
[IO.File]::WriteAllText("$game/config/config.json",'config-kept')
Set-Mods $pack $game
Assert (Test-Path "$game/mods/client.jar") 'Main mod missing'
Assert (Test-Path "$game/mods/optional.jar") 'Optional mod missing'
Assert (!(Test-Path "$game/mods/old.jar")) 'Old mods mixed with new'
$backups = @(Get-ChildItem $game -Directory -Filter 'mods.su-backup-*')
Assert ($backups.Count -eq 1) 'Backup missing'
Assert (Test-Path (Join-Path $backups[0].FullName 'old.jar')) 'Old jar lost'
Assert ((Get-Content "$game/saves/world.dat" -Raw) -eq 'world-kept') 'World changed'
Assert ((Get-Content "$game/config/config.json" -Raw) -eq 'config-kept') 'Config changed'
Set-Mods $pack $game
Assert (@(Get-ChildItem $game -Directory -Filter 'mods.su-backup-*').Count -eq 2) 'Rerun overwrote backup'
Copy-Item "$pack/mods/client.jar" "$pack/mods/optional/client.jar"
$failed = $false
try { Set-Mods $pack $game } catch { $failed = $true }
Assert $failed 'Duplicate jar was accepted'
Assert (Test-Path "$game/mods/client.jar") 'Active mods lost on failure'
$profile = Join-Path $fixture 'launcher_profiles.json'
[IO.File]::WriteAllText($profile,'{"profiles":{"old":{"name":"Keep me"}},"settings":{"keep":true}}')
New-Item -ItemType Directory -Path "$fixture/backup" | Out-Null
Set-Profile $profile $game 'C:\Java21\bin\java.exe' "$fixture/backup"
# Use a separate backup directory so source and backup do not share a path.
$data = Get-Content $profile -Raw | ConvertFrom-Json
Assert ($data.profiles.old.name -eq 'Keep me') 'Existing profile lost'
Assert ($data.settings.keep -eq $true) 'Existing settings lost'
Assert ($data.profiles.'survivors-united-1.21.11'.gameDir -eq $game) 'Custom directory missing'
Assert (Test-Path "$fixture/backup/launcher_profiles.json") 'Profile backup missing'
function Invoke-WebRequest { param($Uri,$OutFile,[switch]$UseBasicParsing); [IO.File]::WriteAllText($OutFile,'corrupt-download') }
$failed = $false
try { Get-VerifiedFile 'https://example.test/archive' "$fixture/download" ('0' * 64) } catch { $failed = $true }
Assert $failed 'Corrupt download was accepted'
Say "All Windows setup fixture checks passed. Evidence retained: $fixture"
# Exercise rollback by making the activation move fail after backup.
$rollbackGame = Join-Path $fixture 'rollback game'
New-Item -ItemType Directory -Path "$rollbackGame/mods" -Force | Out-Null
[IO.File]::WriteAllText("$rollbackGame/mods/old.jar",'rollback-old')
# The staging directory is held open without delete sharing, so its rename fails.
$script:held = $null
function Assert-Closed {
    $staged = @(Get-ChildItem -LiteralPath $rollbackGame -Directory -Filter 'mods.su-staging-*')
    $script:held = [IO.File]::Open((Join-Path $staged[0].FullName 'client.jar'),[IO.FileMode]::Open,[IO.FileAccess]::Read,[IO.FileShare]::Read)
}
# Use a valid pack again.
[IO.File]::Delete("$pack/mods/optional/client.jar")
$failed = $false
try { Set-Mods $pack $rollbackGame } catch { $failed = $true } finally { if ($script:held) { $script:held.Dispose() } }
Assert $failed 'Expected activation failure was not detected'
Assert ((Get-Content "$rollbackGame/mods/old.jar" -Raw) -eq 'rollback-old') 'Rollback failed to restore old mods'
Say 'Windows activation failure restored the original mods.'
