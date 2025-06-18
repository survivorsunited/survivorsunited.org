---
sidebar_position: 3
title: Install Fabric
description: How to install the Fabric mod loader for Minecraft
---

# Install Fabric Minecraft Loader

Fabric is a lightweight mod loader that allows you to run mods in Minecraft. It's required for the Survivors United server.

## Download Fabric Installer

Download `fabric-installer-1.0.3.jar` from:  
[/install/fabric-installer-1.0.3.jar](/install/fabric-installer-1.0.3.jar)

## Installation Steps

### Step 1: Run the Installer

If your computer recognizes `.jar` files:
1. Double-click the downloaded `fabric-installer-1.0.3.jar` file
2. The installer will open automatically

If your computer doesn't recognize `.jar` files:
1. Open Command Prompt
2. Navigate to the folder containing the installer
3. Run this command:
```cmd
Java -jar fabric-installer-1.0.3.jar
```

### Step 2: Configure Installation

1. **Minecraft Version**: Select "1.21.5"
2. **Loader Version**: Select the latest Fabric version
3. **Install Location**: Leave as default (your Minecraft installation)
4. **Create Profile**: Check this option
5. Click "Install"

### Step 3: Verify Installation

1. Open the Minecraft Launcher
2. Look for a new profile called "Fabric (1.21.5)" or similar
3. Make sure this profile is selected before launching

![Fabric Selection](/img/minecraft/fabric-selection.png)

## Alternative Installation Methods

### Using CurseForge
1. Download and install CurseForge
2. Create a new Fabric modpack
3. CurseForge will handle the Fabric installation

### Using MultiMC
1. Download and install MultiMC
2. Create a new instance
3. Select Fabric as the mod loader
4. MultiMC will download and install Fabric

## Troubleshooting

### Installer Won't Run
- Make sure Java is installed and in your PATH
- Try running as administrator
- Check that the file downloaded completely

### No Fabric Profile
- Check that the installation completed successfully
- Try running the installer again
- Check the Minecraft launcher settings

### Version Mismatch
- Make sure you're installing Fabric for Minecraft 1.21.5
- Check that your Minecraft version matches
- Update Minecraft to the latest version if needed

## What Fabric Does

Fabric provides:
- **Mod Loading**: Allows mods to be loaded into Minecraft
- **API**: Provides interfaces for mods to interact with the game
- **Compatibility**: Ensures mods work together properly
- **Performance**: Lightweight compared to other mod loaders

## Next Steps

Once Fabric is installed, proceed to [Install Mods](/docs/minecraft/mods/installation). 