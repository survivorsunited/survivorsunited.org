---
sidebar_position: 3
title: JourneyMap Export Utility
description: Export JourneyMap waypoints to reusable formats for backup or migration.
tags:
  - tooling
  - journey-map
  - automation
---

# JourneyMap Export Utility

The Survivors United JourneyMap Export tool backs up JourneyMap waypoints and recreates them on demand. It reads the `WaypointData.dat` file stored in `.minecraft/journeymap/data/mp/<server>/waypoints/` and produces JSON, CSV, and ready-to-run `/waypoint create …` command scripts. You can find the source on GitHub: [`survivorsunited/journeymap-export`](https://github.com/survivorsunited/journeymap-export).

## Key Features

- **Multiple export formats**: Generates `waypoints.json`, `waypoints.csv`, and `create_waypoints.txt` for flexible reuse.
- **Group-aware exports**: Title-cases group names, preserves prefixes (such as `[Farm]`), and defaults to the "Global" group when none exists.
- **Waystone handling**: Applies optional Y/Z offsets and adds dimension suffixes `(N)` for Nether and `(E)` for End waystones.
- **Compression support**: Reads raw NBT along with GZIP, ZIP, and ZLIB-compressed files.
- **Automation scripts**: Includes PowerShell scripts for one-off backups or continuous export while you play.

## Requirements

- **Java 17+** for compiling and running `WaypointDataDump.java`.
- **PowerShell 5+** on Windows (or PowerShell 7+ on other platforms with adjusted paths) to use the helper scripts.

## Usage Overview

### Clone and Build

```powershell
git clone https://github.com/survivorsunited/journeymap-export.git
cd journeymap-export
```

Compile the Java utility:

```powershell
javac -d out org\survivorsunited\utils\journeymap\WaypointDataDump.java
```

### One-Off Export

Run the exporter against a specific world’s waypoint file:

```powershell
java -cp out org.survivorsunited.utils.journeymap.WaypointDataDump `
  "$env:USERPROFILE\AppData\Roaming\.minecraft\journeymap\data\mp\SERVERFOLDER\waypoints\WaypointData.dat" `
  --out export
```

Outputs appear under `export/` and include JSON, CSV, and command files grouped by waypoint group.

### Continuous Export (Watch Mode)

Running `run.ps1` compiles the tool and watches all discovered JourneyMap worlds:

- Auto-creates `export/<ServerFolder>/` directories.
- Re-exports whenever a `WaypointData.dat` changes (polls every 3 seconds, waits 750 ms after changes).
- Handles new server folders that appear while monitoring.

### Restoring Waypoints

Use the generated `create_waypoints.txt` inside Minecraft (via `/waypoint create …`) to rebuild waypoints grouped and color-coded as exported.

## Customization

The Java source exposes constants for:

- `DEFAULT_PLAYER`: target player name used in generated commands.
- `DEFAULT_GROUP_ID`: fallback group label.
- `Y_OFFSET` / `Z_OFFSET`: coordinate adjustments applied to waystone waypoints.

Adjust these values at the top of `WaypointDataDump.java` to match your preferences before compiling.

## Additional Resources

- GitHub repository and full README: [`survivorsunited/journeymap-export`](https://github.com/survivorsunited/journeymap-export)
