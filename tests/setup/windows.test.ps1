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
Assert ($data.profiles.'survivors-united-1.21.11'.javaArgs -eq '-Xmx8G') 'Profile must set an 8 GB maximum heap'
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
function Assert-Closed { }
$restoreGame = Join-Path $fixture 'restore game'
$restoreWork = Join-Path $fixture 'restore work'
New-Item -ItemType Directory -Path "$restoreGame/mods", "$restoreWork/restore" -Force | Out-Null
[IO.File]::WriteAllText("$restoreGame/mods/old.jar", 'restore-old')
[IO.File]::WriteAllText("$restoreGame/launcher_profiles.json", '{"profiles":{"old":{"name":"Original"}}}')
Copy-Item "$restoreGame/launcher_profiles.json" "$restoreWork/restore/launcher_profiles.json"
[IO.File]::WriteAllText("$restoreWork/root.path", $restoreGame)
[IO.File]::WriteAllText("$restoreWork/game.path", $restoreGame)
Set-Mods $pack $restoreGame $restoreWork
[IO.File]::WriteAllText("$restoreGame/launcher_profiles.json", '{"profiles":{"new":{}}}')
Restore-Setup $restoreWork
Assert ((Get-Content "$restoreGame/mods/old.jar" -Raw) -eq 'restore-old') 'Explicit restore lost original mods'
Assert ((Get-Content "$restoreGame/launcher_profiles.json" -Raw) -match 'Original') 'Explicit restore lost original profile'
Assert (@(Get-ChildItem $restoreGame -Directory -Filter 'mods.su-before-restore-*').Count -eq 1) 'Restore did not retain replaced mods'
Assert (@(Get-ChildItem $restoreGame -Directory -Filter 'mods.su-backup-*').Count -eq 1) 'Restore consumed original backup'
# A first install has no prior mods folder: restore moves new mods aside.
[IO.File]::WriteAllText("$restoreWork/mods-backup.path", '')
Restore-Setup $restoreWork
Assert (!(Test-Path "$restoreGame/mods")) 'First install restore left new mods active'
$script:wingetReady = $false
$script:repairCalled = $false
function Get-Command { param($Name,$ErrorAction); if ($Name -eq 'winget' -and $script:wingetReady) { [pscustomobject]@{Source='mock-winget'} } }
function Install-PackageProvider { param($Name,$MinimumVersion,$Scope,[switch]$Force); Assert ($Scope -eq 'CurrentUser') 'Provider install must use current user' }
function Install-Module { param($Name,$Repository,$Scope,[switch]$Force); Assert ($Name -eq 'Microsoft.WinGet.Client') 'Wrong bootstrap module' }
function Import-Module { param($Name) }
function Repair-WinGetPackageManager { param([switch]$Latest); $script:repairCalled = $true; $script:wingetReady = $true }
$oldPath = $env:PATH
try { Ensure-WinGet } finally { $env:PATH = $oldPath }
Assert $script:repairCalled 'Missing WinGet was not bootstrapped'
Say 'Windows explicit restore and missing WinGet bootstrap fixtures passed.'
# A downloaded Java runtime must remain outside AppData so Store Launcher can see it.
function Invoke-RestMethod { param($Uri); @([pscustomobject]@{binary=[pscustomobject]@{package=[pscustomobject]@{link='https://example.test/java.zip';checksum='fixture'}}}) }
function Get-VerifiedFile { param($Url,$Destination,$Hash); [IO.File]::WriteAllText($Destination,'fixture') }
function Expand-Archive { param($LiteralPath,$DestinationPath); New-Item -ItemType Directory -Path "$DestinationPath/jdk/bin" -Force|Out-Null; [IO.File]::WriteAllText("$DestinationPath/jdk/bin/java.exe",'fixture') }
function Read-JavaVersion { param($Java); $global:LASTEXITCODE=0; 'openjdk version "21.0.12"' }
$oldJavaHome=$env:JAVA_HOME
$oldUserProfile=$env:USERPROFILE
try {
    $env:JAVA_HOME=''
    $env:USERPROFILE=Join-Path $fixture 'user home'
    $javaWork=Join-Path $fixture 'java-download-work'
    New-Item -ItemType Directory -Path $javaWork -Force|Out-Null
    $runtime=Get-Java21 $javaWork
    Assert ($runtime.StartsWith([IO.Path]::GetFullPath((Join-Path $env:USERPROFILE '.survivorsunited/runtimes')))) 'Downloaded runtime is not in the durable user runtime folder'
    Assert (!( $runtime.StartsWith($javaWork))) 'Launcher runtime still lives in the AppData setup work folder'
    Assert (Test-Path -LiteralPath $runtime) 'Returned runtime does not exist'
} finally { $env:JAVA_HOME=$oldJavaHome; $env:USERPROFILE=$oldUserProfile }
Say 'Windows downloaded Java runtime location fixture passed.'
# Launcher setup detection must skip questions on repeat runs and retry a busy Launcher in place.
& {
    $root=Join-Path $fixture 'existing launcher'
    New-Item -ItemType Directory -Path $root -Force|Out-Null
    [IO.File]::WriteAllText("$root/launcher_profiles.json",'{"profiles":{}}')
    function Assert-Closed { }
    function Read-Host { param($Prompt); throw 'Existing closed Launcher should not prompt' }
    $files=@(Initialize-LauncherProfiles $root)
    Assert ($files.Count -eq 1) 'Existing Launcher profile not detected'
    [IO.File]::WriteAllText("$root/launcher_profiles_microsoft_store.json",'{"profiles":{}}')
    Assert (@(Get-LauncherProfileFiles $root).Count -eq 2) 'Store Launcher profiles not detected'
    $script:busyChecks=0; $script:retryPrompts=0
    function Assert-Closed { $script:busyChecks++; if($script:busyChecks -eq 1){throw 'Close Minecraft and Minecraft Launcher, then run this script again. Nothing will be force-closed.'} }
    function Read-Host { param($Prompt); $script:retryPrompts++; return '' }
    $files=@(Initialize-LauncherProfiles $root)
    Assert ($script:busyChecks -eq 2 -and $script:retryPrompts -eq 1 -and $files.Count -eq 2) 'Busy Launcher did not retry with Enter as Yes'
    $fresh=Join-Path $fixture 'fresh launcher'
    function Assert-Closed { }
    function Read-Host { param($Prompt); New-Item -ItemType Directory -Path $fresh -Force|Out-Null; [IO.File]::WriteAllText("$fresh/launcher_profiles.json",'{"profiles":{}}'); return '' }
    Assert (@(Initialize-LauncherProfiles $fresh).Count -eq 1) 'First-run Launcher detection failed after confirmation'
    [IO.File]::WriteAllText("$fresh/launcher_profiles.json",'{"profiles":[]}')
    Assert (@(Get-LauncherProfileFiles $fresh).Count -eq 0) 'Invalid profiles accepted'
    function Read-Host { param($Prompt); return 'n' }
    $cancelled=$false
    try { Confirm-LauncherStep 'Continue?' } catch { $cancelled=$true }
    Assert $cancelled 'Explicit No did not stop Launcher retry'
}
Say 'Windows repeat-run detection, first-run readiness, retry, default Yes and cancellation passed.'
