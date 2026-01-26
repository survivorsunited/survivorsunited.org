param(
    [int]$TimeoutSeconds = 20
)

$mods = @(
    @{ Name = "Advanced Item Info"; Url = "https://www.curseforge.com/hytale/mods/advanced-item-info" },
    @{ Name = "Better Item Viewer"; Url = "https://www.curseforge.com/hytale/search?search=Better%20Item%20Viewer" },
    @{ Name = "Better Map"; Url = "https://www.curseforge.com/hytale/mods/bettermap" },
    @{ Name = "Better Training Dummy"; Url = "https://www.curseforge.com/hytale/search?search=BetterTrainingDummy" },
    @{ Name = "Better Wardrobes"; Url = "https://www.curseforge.com/hytale/search?search=Better%20Wardrobes" },
    @{ Name = "Chunker"; Url = "https://www.curseforge.com/hytale/search?search=Chunker" },
    @{ Name = "Extended Teleport History"; Url = "https://www.curseforge.com/hytale/search?search=ExtendedTeleportHistory" },
    @{ Name = "EyeSpy"; Url = "https://www.curseforge.com/hytale/mods/eyespy" },
    @{ Name = "Gravestone Plugin"; Url = "https://www.curseforge.com/hytale/search?search=GravestonePlugin" },
    @{ Name = "Healthbar"; Url = "https://www.curseforge.com/hytale/search?search=healthbar" },
    @{ Name = "HyMarkers"; Url = "https://www.curseforge.com/hytale/mods/hymarkers" },
    @{ Name = "Grab From Far"; Url = "https://www.curseforge.com/hytale/search?search=GrabFromFar" },
    @{ Name = "Linceros Level Armors"; Url = "https://www.curseforge.com/hytale/search?search=LincerosLevelArmors" },
    @{ Name = "Linceros Level Tools"; Url = "https://www.curseforge.com/hytale/search?search=LincerosLevelTools" },
    @{ Name = "Lucky Mining"; Url = "https://www.curseforge.com/hytale/mods/lucky-mining" },
    @{ Name = "Miners Helmet"; Url = "https://www.curseforge.com/hytale/search?search=Miners%20Helmet" },
    @{ Name = "More Mounts"; Url = "https://www.curseforge.com/hytale/search?search=More%20Mounts" },
    @{ Name = "Seed Drops"; Url = "https://www.curseforge.com/hytale/search?search=Seed%20Drops" },
    @{ Name = "Ore Glow More"; Url = "https://www.curseforge.com/hytale/search?search=Ore%20Glow%20More" },
    @{ Name = "Mountable Trex and Raptor"; Url = "https://www.curseforge.com/hytale/search?search=Mountable%20Trex%20Raptor" },
    @{ Name = "MultipleHUD"; Url = "https://www.curseforge.com/hytale/mods/multiplehud" },
    @{ Name = "Overstacked"; Url = "https://www.curseforge.com/hytale/mods/overstacked" },
    @{ Name = "Rideable Camel"; Url = "https://www.curseforge.com/hytale/search?search=Rideable%20Camel" },
    @{ Name = "Salvage Everything"; Url = "https://www.curseforge.com/hytale/search?search=Salvage%20Everything" },
    @{ Name = "Totem of Resurrection"; Url = "https://www.curseforge.com/hytale/search?search=Totem%20of%20Resurrection" },
    @{ Name = "Weapon Stats Viewer"; Url = "https://www.curseforge.com/hytale/search?search=WeaponStatsViewer" },
    @{ Name = "WorldProtect"; Url = "https://www.curseforge.com/hytale/search?search=WorldProtect" },
    @{ Name = "WorldProtection"; Url = "https://www.curseforge.com/hytale/search?search=WorldProtection" }
)

$failed = @()

foreach ($mod in $mods) {
    try {
        Invoke-WebRequest -Uri $mod.Url -Method Head -MaximumRedirection 5 -TimeoutSec $TimeoutSeconds -ErrorAction Stop | Out-Null
        Write-Host "OK  - $($mod.Name) -> $($mod.Url)"
    } catch {
        try {
            Invoke-WebRequest -Uri $mod.Url -Method Get -MaximumRedirection 5 -TimeoutSec $TimeoutSeconds -ErrorAction Stop | Out-Null
            Write-Host "OK  - $($mod.Name) -> $($mod.Url)"
        } catch {
            Write-Host "FAIL- $($mod.Name) -> $($mod.Url)" -ForegroundColor Red
            $failed += $mod
        }
    }
}

if ($failed.Count -gt 0) {
    Write-Host "`nFailed URLs:" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host " - $($_.Name): $($_.Url)" -ForegroundColor Red }
    exit 1
}

Write-Host "`nAll mod URLs responded successfully." -ForegroundColor Green
