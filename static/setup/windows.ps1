# Survivors United Windows setup. Compatible with Windows PowerShell 5.1 and PowerShell 7.
[CmdletBinding()]
param([switch]$CheckOnly, [string]$GameDirectory, [string]$RestoreBackup)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$MinecraftVersion = '1.21.11'
$LoaderVersion = '0.19.5'
$ServerAddress = 'minecraft.survivorsunited.org'
$script:RecoveryWork = ''
function Say([string]$Message) { Write-Host "[Survivors United] $Message" }
function Confirm-Step([string]$Message) {
    $answer = Read-Host "$Message [Y/n]"
    if ($answer -and $answer -notmatch '^(y|yes)$') { throw 'Stopped at your request. Run the script again when ready.' }
}
function Assert-PlainPath([string]$Path) {
    $itemPath = [IO.Path]::GetFullPath($Path)
    while ($itemPath) {
        if (Test-Path -LiteralPath $itemPath) {
            if ((Get-Item -LiteralPath $itemPath -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Linked folders are not supported: $itemPath. Use the manual wizard." }
        }
        $parent = [IO.Path]::GetDirectoryName($itemPath)
        if ($parent -eq $itemPath) { break }
        $itemPath = $parent
    }
}
function Assert-Closed {
    $busy = @(Get-CimInstance Win32_Process | Where-Object {
        $_.Name -match '^Minecraft(Launcher)?\.exe$' -or
        ($_.Name -match '^javaw?\.exe$' -and $_.CommandLine -match '(minecraft|fabricmc|KnotClient)')
    })
    if ($busy.Count) { throw 'Close Minecraft and Minecraft Launcher, then run this script again. Nothing will be force-closed.' }
}
function Confirm-LauncherStep([string]$Message) {
    $answer = Read-Host "$Message [Y/n]"
    if ($answer -and $answer -notmatch '^(y|yes)$') { throw 'Stopped at your request. Run the script again when ready.' }
}
function Wait-LauncherClosed {
    while ($true) {
        try { Assert-Closed; return } catch {
            if ($_.Exception.Message -notlike 'Close Minecraft and Minecraft Launcher*') { throw }
            Say 'Minecraft or Launcher is still running. Save and exit any game, then close Launcher completely. If needed, end Minecraft Launcher in Task Manager.'
            Confirm-LauncherStep 'Check again and continue? Press Enter after closing Launcher'
        }
    }
}
function Get-LauncherProfileFiles([string]$Root) {
    foreach ($name in @('launcher_profiles.json','launcher_profiles_microsoft_store.json')) {
        $file = Join-Path $Root $name
        if (Test-Path -LiteralPath $file -PathType Leaf) {
            Assert-PlainPath $file
            try { $data = Get-Content -LiteralPath $file -Raw | ConvertFrom-Json } catch { continue }
            if ($data.PSObject.Properties.Name -contains 'profiles' -and $null -ne $data.profiles -and $data.profiles -is [pscustomobject]) { $file }
        }
    }
}
function Initialize-LauncherProfiles([string]$Root) {
    Assert-PlainPath $Root
    while ($true) {
        $files = @(Get-LauncherProfileFiles $Root)
        if ($files.Count) {
            Say 'Launcher setup files already found. No need to open Launcher again; your account is checked when you press Play.'
            Wait-LauncherClosed
            $files = @(Get-LauncherProfileFiles $Root)
            if ($files.Count) { return $files }
        }
        Say 'Open Minecraft Launcher and sign in with the account that owns Java Edition, then close Launcher. You do not need to press Play first.'
        Confirm-LauncherStep 'Ready to check Launcher setup?'
        Wait-LauncherClosed
        if (!( @(Get-LauncherProfileFiles $Root).Count)) { Say 'Launcher setup files are not ready yet. Open Launcher once, then close it and try again here.' }
    }
}
function Get-VerifiedFile([string]$Url, [string]$Destination, [string]$Hash) {
    # Keep the named checks visible without PowerShell 5.1's per-buffer redraws.
    $ProgressPreference = 'SilentlyContinue'
    if ($Url -notmatch '^https://') { throw 'Download URL must use HTTPS.' }
    Say "Downloading $Url"
    Invoke-WebRequest -UseBasicParsing -Uri $Url -OutFile $Destination
    $actual = (Get-FileHash -LiteralPath $Destination -Algorithm SHA256).Hash
    if ($actual -ne $Hash) { throw "Download verification failed: $Destination. No mods have been replaced." }
    Say 'SHA256 verified.'
}
function Resolve-PackRelease($Release) {
    if ($Release.draft -or $Release.prerelease -or !$Release.tag_name) { throw 'Expected a published stable modpack release.' }
    $name = "modpack-$MinecraftVersion.zip"
    $pack = @($Release.assets | Where-Object { $_.name -eq $name })
    $hashes = @($Release.assets | Where-Object { $_.name -eq 'release-hashes.txt' })
    if ($pack.Count -ne 1 -or $hashes.Count -ne 1) { throw "Latest release does not contain a verified Minecraft $MinecraftVersion pack. No mods have been changed." }
    $prefix = 'https://github.com/survivorsunited/minecraft-mods-manager/releases/download/' + $Release.tag_name + '/'
    if ($pack[0].browser_download_url -ne ($prefix + $name) -or $hashes[0].browser_download_url -ne ($prefix + 'release-hashes.txt')) { throw 'Unexpected modpack release download URL.' }
    return [pscustomobject]@{ Tag = $Release.tag_name; Name = $name; Url = $pack[0].browser_download_url; HashUrl = $hashes[0].browser_download_url }
}
function Get-PackHash([string]$Text, [string]$Name) {
    $pattern = '^([a-fA-F0-9]{64})\s+\*?' + [regex]::Escape($Name) + '\s*$'
    $entries = @($Text -split '\r?\n' | Where-Object { $_ -match $pattern })
    if ($entries.Count -ne 1) { throw 'Release checksum is missing, invalid or duplicated. No mods have been changed.' }
    return [regex]::Match($entries[0], $pattern).Groups[1].Value
}
function Get-LatestPack([string]$Work) {
    $release = Invoke-RestMethod -Uri 'https://api.github.com/repos/survivorsunited/minecraft-mods-manager/releases/latest' -Headers @{ 'User-Agent' = 'SurvivorsUnited-Setup'; Accept = 'application/vnd.github+json' }
    $pack = Resolve-PackRelease $release
    $hashFile = Join-Path $Work 'release-hashes.txt'
    Invoke-WebRequest -UseBasicParsing -Uri $pack.HashUrl -OutFile $hashFile
    $hash = Get-PackHash (Get-Content -LiteralPath $hashFile -Raw) $pack.Name
    Say "Selected latest stable modpack: $($pack.Tag)"
    Get-VerifiedFile $pack.Url (Join-Path $Work 'modpack.zip') $hash
}
function Read-JavaVersion([string]$Java) {
    $ErrorActionPreference = 'Continue'
    & $Java -version 2>&1 | Out-String
}
function Get-JavaMajor([string]$Output) {
    if ($Output -match 'version "(\d+)(?:[.\"+\-])') { return [int]$Matches[1] }
    return 0
}
function Use-ExistingJava([int]$Major, [string]$Java) {
    Say "Compatible Java $Major found: $Java"
    while ($true) {
        $answer = Read-Host 'Keep using existing Java? [Y/n] (n installs a separate Java 21 runtime)'
        if (!$answer -or $answer -match '^(y|yes)$') { return $true }
        if ($answer -match '^(n|no)$') { return $false }
        Say 'Press Enter to keep existing Java, or type n to install Java 21.'
    }
}
function Get-Java21([string]$Work) {
    $candidates = @()
    if ($env:JAVA_HOME) { $candidates += (Join-Path $env:JAVA_HOME 'bin/java.exe') }
    $command = Get-Command java.exe -ErrorAction SilentlyContinue
    if ($command) { $candidates += $command.Source }
    $retained = Join-Path $env:USERPROFILE '.survivorsunited/runtimes'
    if (Test-Path -LiteralPath $retained) {
        $candidates += @(Get-ChildItem -LiteralPath $retained -Filter java.exe -Recurse -File | Where-Object {$_.Directory.Name -eq 'bin'} | Select-Object -ExpandProperty FullName)
    }
    $compatibleFound = $false
    foreach ($candidate in ($candidates | Select-Object -Unique)) {
        if (Test-Path -LiteralPath $candidate) {
            $output = Read-JavaVersion $candidate
            $major = Get-JavaMajor $output
            if ($major -ge 21) {
                $compatibleFound = $true
                if (Use-ExistingJava $major $candidate) { return $candidate }
                break
            }
        }
    }
    if (!$compatibleFound) { Say 'No compatible Java found (Java 21 or newer required).' }
    Say 'Installing a separate Java 21 runtime for Minecraft; system Java stays unchanged.'
    $assets = Invoke-RestMethod -Uri 'https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=windows&vendor=eclipse'
    $package = $assets[0].binary.package
    $archive = Join-Path $Work 'java21.zip'
    Get-VerifiedFile $package.link $archive $package.checksum
    # Store Launcher can redirect AppData paths; keep its executable outside AppData.
    $javaFolder = Join-Path $env:USERPROFILE ('.survivorsunited/runtimes/' + [IO.Path]::GetFileName($Work) + '/java21')
    Assert-PlainPath $javaFolder
    New-Item -ItemType Directory -Path $javaFolder -Force | Out-Null
    Expand-Archive -LiteralPath $archive -DestinationPath $javaFolder
    $java = @(Get-ChildItem -LiteralPath $javaFolder -Filter java.exe -Recurse | Where-Object {$_.Directory.Name -eq 'bin'})
    if ($java.Count -ne 1) { throw 'Java archive did not contain exactly one runtime.' }
    $output = Read-JavaVersion $java[0].FullName
    if ($LASTEXITCODE -ne 0 -or $output -notmatch 'version "21[.\"]') { throw 'Java 21 verification failed.' }
    return $java[0].FullName
}
function Get-ModFiles([string]$Pack) {
    $files = @(Get-ChildItem -LiteralPath (Join-Path $Pack 'mods') -Filter '*.jar' -File)
    $optional = Join-Path $Pack 'mods/optional'
    if (!(Test-Path -LiteralPath $optional -PathType Container)) { throw 'The optional client mods folder is missing.' }
    $files += @(Get-ChildItem -LiteralPath $optional -Filter '*.jar' -File)
    if (!$files.Count) { throw 'The pack contains no client mods.' }
    if (@($files | Group-Object Name | Where-Object Count -gt 1).Count) { throw 'Duplicate mod filenames in the pack. No mods replaced.' }
    return $files
}
function Set-Mods([string]$Pack, [string]$Game, [string]$RecoveryFolder = '') {
    Assert-PlainPath $Game
    $mods = Join-Path $Game 'mods'
    Assert-PlainPath $mods
    if ((Test-Path -LiteralPath $mods) -and !(Test-Path -LiteralPath $mods -PathType Container)) { throw 'The mods path is not a folder.' }
    $files = @(Get-ModFiles $Pack)
    $stamp = (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N').Substring(0,8)
    $stage = Join-Path $Game "mods.su-staging-$stamp"
    $backup = Join-Path $Game "mods.su-backup-$stamp"
    New-Item -ItemType Directory -Path $stage | Out-Null
    foreach ($file in $files) {
        $dest = Join-Path $stage $file.Name
        Copy-Item -LiteralPath $file.FullName -Destination $dest
        if ((Get-FileHash -LiteralPath $dest).Hash -ne (Get-FileHash -LiteralPath $file.FullName).Hash) { throw 'Mod copy verification failed. Old mods remain in place.' }
    }
    Assert-Closed
    Assert-PlainPath $mods
    $moved = $false
    if ($RecoveryFolder) {
        [IO.File]::WriteAllText((Join-Path $RecoveryFolder 'mods-backup.path'), $(if (Test-Path -LiteralPath $mods) {$backup} else {''}))
    }
    try {
        if (Test-Path -LiteralPath $mods) { [IO.Directory]::Move($mods, $backup); $moved = $true; Say "Old mods backed up to $backup" }
        [IO.Directory]::Move($stage, $mods)
    } catch {
        if ($moved -and !(Test-Path -LiteralPath $mods)) { [IO.Directory]::Move($backup, $mods) }
        throw
    }
    Say "Installed and verified $($files.Count) client mods. Worlds, config, maps and settings are untouched."
}
function Set-Profile([string]$File, [string]$Game, [string]$Java, [string]$BackupFolder) {
    Assert-PlainPath $File
    $data = Get-Content -LiteralPath $File -Raw | ConvertFrom-Json
    if (!$data.profiles) { throw 'Launcher profile data is missing. Open Minecraft Launcher once, close it, and retry.' }
    Copy-Item -LiteralPath $File -Destination (Join-Path $BackupFolder ([IO.Path]::GetFileName($File)))
    $profile = [pscustomobject]@{name='Survivors United 1.21.11'; type='custom'; lastVersionId="fabric-loader-$LoaderVersion-$MinecraftVersion"; gameDir=$Game; javaDir=$Java; javaArgs='-Xmx8G'}
    $data.profiles | Add-Member -NotePropertyName 'survivors-united-1.21.11' -NotePropertyValue $profile -Force
    $temp = "$File.su-new-$([Guid]::NewGuid().ToString('N'))"
    [IO.File]::WriteAllText($temp, ($data | ConvertTo-Json -Depth 100), (New-Object Text.UTF8Encoding($false)))
    [IO.File]::Replace($temp, $File, "$File.su-backup-$([Guid]::NewGuid().ToString('N'))")
    Say "Launcher profile saved; original backed up in $BackupFolder"
}
function Ensure-WinGet {
    if (Get-Command winget -ErrorAction SilentlyContinue) { return }
    Say 'WinGet is missing. Installing Microsoft WinGet and its required package provider.'
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
    Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Scope CurrentUser -Force | Out-Null
    Install-Module -Name Microsoft.WinGet.Client -Repository PSGallery -Scope CurrentUser -Force | Out-Null
    Import-Module Microsoft.WinGet.Client
    Repair-WinGetPackageManager -Latest
    $env:PATH += ";$env:LOCALAPPDATA\Microsoft\WindowsApps"
    if (!(Get-Command winget -ErrorAction SilentlyContinue)) { throw 'WinGet installation could not complete. Keep the log for support.' }
}
function Restore-Setup([string]$Work) {
    Assert-Closed
    Assert-PlainPath $Work
    $root = Get-Content -LiteralPath (Join-Path $Work 'root.path') -Raw
    $game = Get-Content -LiteralPath (Join-Path $Work 'game.path') -Raw
    Assert-PlainPath $root
    Assert-PlainPath $game
    $mods = Join-Path $game 'mods'
    Assert-PlainPath $mods
    $record = Join-Path $Work 'mods-backup.path'
    if (Test-Path -LiteralPath $record) {
        $backup = Get-Content -LiteralPath $record -Raw
        $stamp = [Guid]::NewGuid().ToString('N')
        $stage = Join-Path $game "mods.su-restoring-$stamp"
        if ($backup) {
            Assert-PlainPath $backup
            if (Test-Path -LiteralPath $backup -PathType Container) {
                Copy-Item -LiteralPath $backup -Destination $stage -Recurse
                if (Test-Path -LiteralPath $mods) { [IO.Directory]::Move($mods, (Join-Path $game "mods.su-before-restore-$stamp")) }
                try { [IO.Directory]::Move($stage, $mods) } catch {
                    $previous = Join-Path $game "mods.su-before-restore-$stamp"
                    if (!(Test-Path -LiteralPath $mods) -and (Test-Path -LiteralPath $previous)) { [IO.Directory]::Move($previous, $mods) }
                    throw
                }
            } else { Say 'Mods activation already rolled back, or never began; leaving active mods in place.' }
        } elseif (Test-Path -LiteralPath $mods) { [IO.Directory]::Move($mods, (Join-Path $game "mods.su-before-restore-$stamp")) }
    }
    foreach ($name in @('launcher_profiles.json','launcher_profiles_microsoft_store.json')) {
        $saved = Join-Path $Work "restore/$name"
        if (Test-Path -LiteralPath $saved) {
            Assert-PlainPath $saved
            $target = Join-Path $root $name
            Assert-PlainPath $target
            $temp = "$target.su-restoring-$([Guid]::NewGuid().ToString('N'))"
            Copy-Item -LiteralPath $saved -Destination $temp
            [IO.File]::Replace($temp, $target, "$target.su-before-restore-$([Guid]::NewGuid().ToString('N'))")
        }
    }
    Say 'Previous mods and launcher profiles restored. Backups and replaced files retained; worlds and settings untouched.'
}
function Main {
    if ($env:OS -ne 'Windows_NT' -or ![Environment]::Is64BitOperatingSystem) { throw 'This script requires 64-bit Windows. Use the manual wizard on other systems.' }
    $root = Join-Path $env:APPDATA '.minecraft'
    Say "Target: Minecraft $MinecraftVersion, Fabric $LoaderVersion"
    Say "Default Minecraft folder: $root"
    if ($CheckOnly) {
        Say 'CHECK ONLY: no downloads, installations or file changes.'
        Say "Minecraft folder exists: $(Test-Path -LiteralPath $root)"
        Say "WinGet available: $([bool](Get-Command winget -ErrorAction SilentlyContinue))"
        Get-Command java.exe -ErrorAction SilentlyContinue | Select-Object Source | Format-Table
        Assert-Closed
        return
    }
    $cache = Join-Path $env:LOCALAPPDATA 'SurvivorsUnited/setup'
    Assert-PlainPath $cache
    if ($RestoreBackup) { Restore-Setup $RestoreBackup; return }
    $previous = @(Get-ChildItem -LiteralPath $cache -Directory -ErrorAction SilentlyContinue | Where-Object {Test-Path -LiteralPath (Join-Path $_.FullName 'root.path')} | Sort-Object LastWriteTime -Descending)
    if ($previous.Count) {
        Say "Previous setup backup: $($previous[0].FullName)"
        if ((Read-Host 'Install/update now? [Y/n] (n restores the previous setup)') -match '^(n|no|r|restore)$') { Restore-Setup $previous[0].FullName; return }
    }
    Confirm-Step 'Proceed with Launcher/Java setup, Fabric installation and a backed-up mod replacement?'
    $work = Join-Path $cache ([Guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $work -Force | Out-Null
    Start-Transcript -Path (Join-Path $work 'setup.log') | Out-Null
    try {
        Say "Log and retained downloads: $work"
        Say '(1/6) Checking Minecraft Launcher.'
        if (!(Get-AppxPackage -Name Microsoft.4297127D64EC6) -and !(Test-Path -LiteralPath "${env:ProgramFiles(x86)}\Minecraft Launcher\MinecraftLauncher.exe")) {
            Ensure-WinGet
            & winget install --exact --id Mojang.MinecraftLauncher --source winget --accept-source-agreements --accept-package-agreements
            if ($LASTEXITCODE -ne 0) { throw 'Launcher installation did not complete. Install it manually and rerun.' }
        }
        $profileFiles = @(Initialize-LauncherProfiles $root)
        if (!$GameDirectory) {
            Say 'If your old profile uses a custom Game Directory, enter it below. Otherwise press Enter.'
            $GameDirectory = Read-Host "Game Directory [$root]"
            if (!$GameDirectory) { $GameDirectory = $root }
        }
        $game = [IO.Path]::GetFullPath($GameDirectory)
        Assert-PlainPath $game
        if (!(Test-Path -LiteralPath $game -PathType Container)) { throw 'Game Directory does not exist. Check the path in the old launcher profile.' }
        Say "Mods will go in: $game"
        Confirm-LauncherStep 'Is this the Game Directory you want to install/update?'
        New-Item -ItemType Directory -Path (Join-Path $work 'restore') | Out-Null
        foreach ($file in $profileFiles) { Copy-Item -LiteralPath $file -Destination (Join-Path $work "restore/$([IO.Path]::GetFileName($file))") }
        [IO.File]::WriteAllText((Join-Path $work 'game.path'), $game)
        [IO.File]::WriteAllText((Join-Path $work 'root.path'), $root)
        $script:RecoveryWork = $work
        Say '(2/6) Checking or downloading Java 21.'
        $java = Get-Java21 $work
    Say '(3/6) Finding, downloading and verifying the latest stable modpack.'
        $zip = Join-Path $work 'modpack.zip'
    Get-LatestPack $work
        $pack = Join-Path $work 'pack'
        Expand-Archive -LiteralPath $zip -DestinationPath $pack
        Get-ModFiles $pack | Out-Null
        Say '(4/6) Installing Fabric into the launcher folder.'
        Assert-Closed
        Assert-PlainPath (Join-Path $root 'versions')
        Assert-PlainPath (Join-Path $root 'libraries')
        & $java -jar (Join-Path $pack 'install/fabric-installer-1.1.0.jar') client -dir $root -mcversion $MinecraftVersion -loader $LoaderVersion -noprofile
        if ($LASTEXITCODE -ne 0) { throw 'Fabric installer failed. Old mods have not been replaced.' }
        $versionFile = Join-Path $root "versions/fabric-loader-$LoaderVersion-$MinecraftVersion/fabric-loader-$LoaderVersion-$MinecraftVersion.json"
        if (!(Test-Path -LiteralPath $versionFile)) { throw 'Fabric version verification failed.' }
        foreach ($file in $profileFiles) { Set-Profile $file $game $java $work }
        Say '(5/6) Staging new mods, verifying each copy, and backing up the old folder.'
        Set-Mods $pack $game $work
        Say '(6/6) Setup complete. Open Launcher and choose Survivors United 1.21.11, then Play.'
        Say "In the game: Multiplayer > Add Server > Survivors United > $ServerAddress > Done > Join Server."
        Set-Clipboard -Value $ServerAddress
        Say 'The server address has been copied. Your account and connection are checked when you launch and join; this script never asks for a password.'
    } catch {
        Say "Setup failed: $($_.Exception.Message)"
        if ($script:RecoveryWork) {
            Say "Recovery backup: $script:RecoveryWork. Rerun this same command and choose Restore if you prefer to restore later."
            $answer = Read-Host 'Restore your previous mods and launcher profiles now? [Y/n]'
            if (!$answer -or $answer -match '^(y|yes)$') { Restore-Setup $script:RecoveryWork }
        } else { Say 'Your mods and launcher profiles have not been changed.' }
        throw
    } finally { Stop-Transcript | Out-Null }
}
if ($MyInvocation.InvocationName -ne '.') {
    try { Main } catch { Write-Host "[STOPPED] $($_.Exception.Message)" -ForegroundColor Red }
}

