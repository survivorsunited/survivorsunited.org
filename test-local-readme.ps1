#!/usr/bin/env pwsh
# Test parsing local README and generating supported-mods.md

Write-Host "🧪 Testing local README parsing..." -ForegroundColor Cyan
Write-Host ""

$sampleReadme = "docs\README-1.21.8.md"
$outputFile = "docs\supported-mods.md"

if (-not (Test-Path $sampleReadme)) {
    Write-Host "❌ Sample README not found: $sampleReadme" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Reading: $sampleReadme" -ForegroundColor Yellow
$content = Get-Content $sampleReadme -Raw

# Parse mods
$lines = $content -split "`r?`n"
$inTable = $false
$headerFound = $false
$mods = @()

foreach ($line in $lines) {
    if ($line -match "## Mods Table") {
        $inTable = $true
        Write-Host "✅ Found 'Mods Table' section" -ForegroundColor Green
        continue
    }
    
    if ($inTable -and $line -match "^\|") {
        if ($line -match "---") {
            $headerFound = $true
            continue
        }
        
        if ($headerFound -and $line -match "Mandatory") {
            $parts = $line -split "\|" | ForEach-Object { $_.Trim() }
            if ($parts.Length -ge 7) {
                $mod = @{
                    Name = $parts[1]
                    ID = $parts[2]
                    Version = $parts[3]
                    Description = $parts[4]
                    Category = $parts[5]
                    Type = $parts[6]
                }
                $mods += $mod
            }
        }
        
        if ($line -match "^## " -and $line -notmatch "Mods Table") {
            break
        }
    }
}

Write-Host "📊 Found $($mods.Count) mandatory mods" -ForegroundColor Green

# Group by category
$categories = @{}
foreach ($mod in $mods) {
    $cat = $mod.Category
    if (-not $categories.ContainsKey($cat)) {
        $categories[$cat] = @()
    }
    $categories[$cat] += $mod
}

Write-Host "📦 Categories: $($categories.Keys.Count)" -ForegroundColor Green
Write-Host ""

# Generate output
$categoryOrder = @(
    "Core & Utility",
    "World & Exploration",
    "Multiplayer & Server",
    "Infrastructure",
    "Recycling",
    "Inventory Enhancements",
    "Performance",
    "Shaders",
    "Storage",
    "Protection",
    "Admin",
    "Miscellaneous"
)

$output = @"
---
sidebar_position: 4
title: Supported Mods
description: Complete list of mods supported on the Survivors United server
---

# Supported Mods

This setup supports a curated collection of Fabric-compatible mods. These mods enhance gameplay, improve performance, support anti-cheat enforcement, and add helpful features for exploration, inventory, multiplayer, and server stability.

## Mandatory Mods ($($mods.Count) total)

This list is automatically synchronized from the latest modpack release. All mods listed here are required to connect to the Survivors United server.

"@

foreach ($category in $categoryOrder) {
    if ($categories.ContainsKey($category)) {
        $output += "`n## $category`n`n"
        foreach ($mod in $categories[$category]) {
            $output += "- **$($mod.Name)** – $($mod.Version) – $($mod.Description)`n"
        }
        $output += "`n"
    }
}

# Add any remaining categories
foreach ($cat in $categories.Keys) {
    if ($categoryOrder -notcontains $cat) {
        $output += "`n## $cat`n`n"
        foreach ($mod in $categories[$cat]) {
            $output += "- **$($mod.Name)** – $($mod.Version) – $($mod.Description)`n"
        }
        $output += "`n"
    }
}

$output += @"

> **Note:** This list is automatically updated from the latest modpack release. For the complete list with all details including licenses, homepages, and contact information, see the [modpack README](https://github.com/survivorsunited/minecraft-mods-manager/releases/latest).

## Mod Categories Explained

### Core and Utility Mods
These are the foundation mods that other mods depend on. They provide essential libraries and APIs that enable the functionality of other mods.

### World, Maps & Exploration
These mods enhance your ability to explore and navigate the world. They provide maps, waypoints, and tools for understanding your surroundings.

### Storage & Inventory Enhancements
These mods improve how you manage your items and storage. They provide better inventory management, storage solutions, and item handling.

### Multiplayer & Server Features
These mods add features specifically for multiplayer gameplay, including land claims, party systems, and server-specific functionality.

### Performance & Protection
These mods improve game performance and provide server protection. They optimize rendering, reduce memory usage, and prevent cheating.

### Miscellaneous
These are fun or utility mods that don't fit into other categories but add interesting features to the game.

## Key Mod Features

### Map Mods
- **Xaero's World Map**: Full-screen world map with waypoints and land claim display
- **Xaero's Minimap**: On-screen minimap showing nearby entities and items
- **Journeymap**: Alternative map system with real-time updates and waypoint management

### Storage Mods
- **Tom's Simple Storage**: Simple but effective storage system
- **Traveler's Backpack**: Upgradeable backpacks with special features
- **Inventory Management**: Tools for sorting and organizing items

### Performance Mods
- **Sodium**: Dramatically improves rendering performance
- **Iris**: Enables shader support for better graphics
- **FerriteCore**: Reduces memory usage for better stability

### Server Features
- **Open Parties and Claims**: Land claiming and party system
- **InertiaAntiCheat**: Required for server access
- **Styled Chat**: Enhanced chat system

## Mod Updates

### How Updates Work
- **Automatic Updates**: Server mods are updated regularly
- **Client Updates**: Download new modpacks from the shared Google Drive
- **Version Compatibility**: All mods are tested for compatibility
- **Backup System**: Old versions are kept as backups

### Update Process
1. **Server Update**: Server mods are updated first
2. **Client Notification**: Players are notified of required updates
3. **New Modpack**: Updated modpack is uploaded to Google Drive
4. **Client Download**: Players download and install the new modpack
5. **Verification**: Players verify they can connect to the server

## Troubleshooting Mods

### Common Issues
- **Missing Mods**: Ensure you have all required mods installed
- **Version Mismatch**: Make sure your mod versions match the server
- **Conflicts**: Check for conflicting mods or keybinds
- **Performance**: Some mods may impact performance on lower-end systems

### Getting Help
- **Discord Support**: Ask for help in the #minecraft-support channel
- **Mod Documentation**: Check individual mod documentation
- **Community Help**: Other players can often help with mod issues
- **Server Staff**: Contact moderators for server-specific issues

## Adding New Mods

### Request Process
If you want to suggest a new mod:
1. **Check Compatibility**: Ensure it's Fabric-compatible
2. **Server Impact**: Consider performance and server impact
3. **Community Vote**: Mods are voted on by the community
4. **Testing**: New mods are tested before implementation
5. **Documentation**: Mod guides are updated when new mods are added

### Mod Guidelines
- **Fabric Only**: Only Fabric-compatible mods are supported
- **Performance**: Mods should not significantly impact performance
- **Balance**: Mods should not provide unfair advantages
- **Stability**: Mods should be stable and well-maintained

Remember, these mods are carefully selected to provide the best experience for the Survivors United community. They enhance gameplay while maintaining server stability and fairness.
"@

Write-Host "💾 Writing to: $outputFile" -ForegroundColor Yellow
$output | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host ""
Write-Host "✅ Generated $outputFile with $($mods.Count) mods in $($categories.Keys.Count) categories" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Refresh your browser to see the updated page!" -ForegroundColor Cyan

