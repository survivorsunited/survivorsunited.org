$ErrorActionPreference='Stop'
. ([scriptblock]::Create((Get-Content "$PSScriptRoot/../../static/setup/windows.ps1" -Raw)))
function Assert($ok,$message) {if (!$ok) {throw $message}}
Assert ($JavaArguments -eq '-Xmx8G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M') 'Java arguments do not match issue 43'
$fixture=Join-Path "$env:LOCALAPPDATA/Temp" ('su-java-path-'+[guid]::NewGuid().ToString('N'))
$fixture=[IO.Path]::GetFullPath($fixture)
New-Item -ItemType Directory "$fixture/jdk/bin", "$fixture/backup" | Out-Null
$java=[IO.Path]::GetFullPath((Join-Path "$fixture/jdk/bin" 'java.exe'))
$javaw=[IO.Path]::GetFullPath((Join-Path "$fixture/jdk/bin" 'javaw.exe'))
[IO.File]::WriteAllText($java,'console'); [IO.File]::WriteAllText($javaw,'gui')
New-Item -ItemType Junction -Path "$fixture/javapath" -Target "$fixture/jdk/bin" | Out-Null
Assert ((Resolve-JavaExecutable "$fixture/javapath/java.exe") -eq $java) 'Parent junction not resolved'
Assert ((Get-GameJava "$fixture/javapath/java.exe") -eq $javaw) 'Linked Java must select physical sibling javaw'
$profile=Join-Path $fixture 'launcher_profiles.json'
[IO.File]::WriteAllText($profile,'{"profiles":{"old":{"name":"Keep me"}}}')
Set-Profile $profile $fixture "$fixture/javapath/java.exe" "$fixture/backup"
$data=Get-Content $profile -Raw|ConvertFrom-Json
Assert ($data.profiles.'survivors-united-1.21.11'.javaDir -eq $javaw) 'Profile contains linked Java path'
Assert ($data.profiles.'survivors-united-1.21.11'.javaArgs -eq $JavaArguments) 'Requested arguments missing'
$rejected=$false; try {Assert-PlainPath "$fixture/javapath"}catch{$rejected=$true}
Assert $rejected 'Data path protection was weakened'
$missing=$false; try {Resolve-JavaExecutable "$fixture/missing.exe"}catch{$missing=$true}
Assert $missing 'Missing Java accepted'
# Reuse detection must return the physical path before any pack download/Fabric install.
$oldHome=$env:JAVA_HOME
try {
 $env:JAVA_HOME=$fixture
 New-Item -ItemType Junction -Path "$fixture/bin" -Target "$fixture/jdk/bin" | Out-Null
 function Read-JavaVersion {param($Java); 'openjdk version "22.0.2"'}
 function Read-Host {return ''}
 Assert ((Get-Java21 $fixture) -eq $java) 'Existing linked Java not reused'
} finally {$env:JAVA_HOME=$oldHome}
Write-Host "Linked Java detection, GUI selection, profile arguments and data path protection passed: $fixture"
