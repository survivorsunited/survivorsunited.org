---
sidebar_position: 3
title: Install Fabric
description: How to install the Fabric mod loader for Minecraft
---

# Install Fabric Minecraft Loader

Fabric is a lightweight mod loader that allows you to run mods in Minecraft. It's required for the Survivors United server.

:::info 📦 Fabric API Included in Modpack

**Important:** The Fabric API mod is already included in the Survivors United modpack. However, you still need to install the **Fabric Loader** itself before you can use the modpack.

The Fabric Loader is the base mod loader that must be installed separately using the Fabric installer. Once installed, you can then use the modpack which contains Fabric API and all other required mods.

:::

## Download Fabric Installer

Download the latest Fabric installer from the official website:  
[Fabric Installer Download](https://fabricmc.net/use/installer/)

Alternatively, download `fabric-installer-1.0.3.jar` from our site:  
[/install/fabric-installer-1.0.3.jar](/install/fabric-installer-1.0.3.jar)

## Installation Steps

### Step 1: Run the Installer

If your computer recognizes `.jar` files:
1. Double-click the downloaded `fabric-installer-*.jar` file
2. The installer will open automatically

If your computer doesn't recognize `.jar` files:
1. Open Command Prompt or PowerShell
2. Navigate to the folder containing the installer
3. Run this command:
```cmd
java -jar fabric-installer-1.0.3.jar
```

### Step 2: Configure Installation

1. **Minecraft Version**: Select the version required by the latest modpack (check the [Mod Manager page](/docs/tools/mod-manager) for the current version)
2. **Loader Version**: Select the **latest** Fabric loader version (the installer will show the recommended version)
3. **Install Location**: Leave as default (your Minecraft installation)
4. **Create Profile**: Check this option
5. Click "Install"

### Step 3: Verify Installation

1. Open the Minecraft Launcher
2. Look for a new profile called "Fabric (1.21.x)" or similar
3. Make sure this profile is selected before launching

![Fabric Selection](/img/minecraft/fabric-selection.png)

## Next Steps

Once Fabric Loader is installed:
1. Proceed to [Install Mods](/docs/minecraft/mods/installation) to download and install the modpack
2. The modpack includes Fabric API, so you don't need to install it separately
3. Launch Minecraft using the Fabric profile and connect to the server 
