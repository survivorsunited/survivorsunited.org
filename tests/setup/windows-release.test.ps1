param([switch]$Live)
$ErrorActionPreference = 'Stop'
. ([scriptblock]::Create((Get-Content "$PSScriptRoot/../../static/setup/windows.ps1" -Raw)))
$prefix = 'https://github.com/survivorsunited/minecraft-mods-manager/releases/download/test/'
$release = [pscustomobject]@{ draft=$false; prerelease=$false; tag_name='test'; assets=@(
    [pscustomobject]@{name='modpack-1.21.11.zip'; browser_download_url=($prefix+'modpack-1.21.11.zip')},
    [pscustomobject]@{name='release-hashes.txt'; browser_download_url=($prefix+'release-hashes.txt')}
) }
function Reject($Action) { $failed=$false; try { & $Action | Out-Null } catch { $failed=$true }; if (!$failed) { throw 'Unsafe release fixture accepted' } }
$pack = Resolve-PackRelease $release
$hash = 'a' * 64
if ((Get-PackHash "$hash  modpack-1.21.11.zip`r`n" $pack.Name) -ne $hash) { throw 'Hash parsing failed' }
Reject { Get-PackHash "$hash  other.zip" $pack.Name }
Reject { Get-PackHash "$hash  $($pack.Name)`n$hash  $($pack.Name)" $pack.Name }
Reject { Get-PackHash "invalid  $($pack.Name)" $pack.Name }
$release.prerelease=$true; Reject { Resolve-PackRelease $release }; $release.prerelease=$false
$release.assets[0].browser_download_url='https://example.com/pack.zip'; Reject { Resolve-PackRelease $release }
$release.assets=@(); Reject { Resolve-PackRelease $release }
if ($Live) {
    $work=Join-Path $env:TEMP ('su-latest-pack-test-'+[guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory $work | Out-Null
    Get-LatestPack $work
    Write-Host "Verified live pack retained at $work"
}
Write-Host 'Windows release selection checks passed.'
