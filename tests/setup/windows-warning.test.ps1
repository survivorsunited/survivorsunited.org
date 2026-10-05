$ErrorActionPreference='Stop'
. ([scriptblock]::Create((Get-Content "$PSScriptRoot/../../static/setup/windows.ps1" -Raw)))
function Assert-Closed {}
function Assert($ok,$message) { if (!$ok) {throw $message} }
function Read-Host {return ''}
$work=Join-Path $env:TEMP ('su-warning-'+[guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory "$work/root", "$work/restore" | Out-Null
$root="$work/root"
$file="$root/launcher_ui_state_microsoft_store.json"
$header="#`$`nInternal launcher state`n`$#`n"
$original=$header+'{"data":{"UiEvents":"{\"hidePlayerSafetyDisclaimer\":{\"other-profile\":true},\"hasSeenDialog\":{\"news\":true}}","UiSettings":"unchanged"},"formatVersion":1}'
[IO.File]::WriteAllText($file,$original)
Set-LauncherAcknowledgement $root $work
$raw=[IO.File]::ReadAllText($file)
$d=$raw.Substring($raw.IndexOf('{'))|ConvertFrom-Json
$events=$d.data.UiEvents|ConvertFrom-Json
Assert $events.hidePlayerSafetyDisclaimer.'fabric-loader-0.19.5-1.21.11_survivors-united-1.21.11' 'SU acknowledgement missing'
Assert $events.hidePlayerSafetyDisclaimer.'other-profile' 'Other acknowledgement lost'
Assert $events.hasSeenDialog.news 'Other UI events lost'
Assert ($d.data.UiSettings -eq 'unchanged') 'UI settings changed'
Assert $raw.StartsWith($header) 'Header lost'
Assert ([IO.File]::ReadAllText("$work/restore/launcher_ui_state_microsoft_store.json") -ceq $original) 'Original backup changed'
function Read-Host {throw 'Already acknowledged should not prompt'}
Set-LauncherAcknowledgement $root $work
Assert ([IO.File]::ReadAllText("$work/restore/launcher_ui_state_microsoft_store.json") -ceq $original) 'Rerun overwrote backup'
[IO.File]::WriteAllText("$work/root.path",$root); [IO.File]::WriteAllText("$work/game.path",$root)
Restore-Setup $work
Assert ([IO.File]::ReadAllText($file) -ceq $original) 'Restore changed original bytes'
function Read-Host {return 'n'}
Set-LauncherAcknowledgement $root $work
Assert ([IO.File]::ReadAllText($file) -ceq $original) 'Explicit No ignored'
[IO.File]::WriteAllText($file,'future unknown format')
Set-LauncherAcknowledgement $root $work
Assert ([IO.File]::ReadAllText($file) -ceq 'future unknown format') 'Unknown format overwritten'
Write-Host "Windows warning acknowledgement, consent, preservation and restore passed: $work"
