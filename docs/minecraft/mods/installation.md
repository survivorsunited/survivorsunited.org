---
sidebar_position: 1
title: Install Mods
description: How to download and install mods for the Survivors United server
---

# Install Mods

To play on the Survivors United server, you need to install the required mods. This guide will walk you through the process.

## Download Mods

### Step 1: Download the Latest Modpack

Download the latest modpack and extract it into mods folder `%appdata%\.minecraft\mods` (create it if it doesn't exist, folder should just have .jar files):  
[modpack.zip](${DOWNLOAD_LINK_MODPACK})

Learn more about how releases are curated on the [Survivors United Mod Manager](./mod-manager.md) page.

### Step 2: Download Shader Packs

For enhanced graphics these shader packs and put them into shaderpacks folder `%appdata%\.minecraft\shaderpacks` (create it if it doesn't exist, folder should just have .zip files not need to extract these):

**Recommended:**
- **Complementary Unbound** - [/mods/shaderpacks/ComplementaryUnbound_r5.5.1.zip](/mods/shaderpacks/ComplementaryUnbound_r5.5.1.zip)

**Alternative Options:**
- **Complementary Reimagined** - [/mods/shaderpacks/ComplementaryReimagined_r5.5.1.zip](/mods/shaderpacks/ComplementaryReimagined_r5.5.1.zip)
- **BSL Shaders** - [/mods/shaderpacks/BSL_v10.0.zip](/mods/shaderpacks/BSL_v10.0.zip)
- **AstraLex** - [/mods/shaderpacks/§r§lAstra§4§lLex§r§l_By_LexBoosT_§4§lV93.0§r§l.zip](/mods/shaderpacks/§r§lAstra§4§lLex§r§l_By_LexBoosT_§4§lV93.0§r§l.zip)

## Install Mods

### Step 1: Find Your Minecraft Folder

First, you need to locate your Minecraft installation folder:

#### On Windows
1. Press `Win + R` to open the Run dialog
2. Type `%appdata%\.minecraft` and press Enter
3. This will open your Minecraft folder

![Windows Minecraft Folder](/img/minecraft/windows-minecraft-folder.png)

#### On MacOS
1. Open Finder
2. Press `⇧ + ⌘ + G` (Shift + Command + G)
3. Type `~/Library/Application Support/minecraft` and press Enter

### Step 2: Create Mods Folder

1. In your Minecraft folder, look for a folder called `mods`
2. If it doesn't exist, create a new folder called `mods`
3. This is your **Mods Folder** - all mods go here

### Step 3: Extract Mods

1. Right-click the downloaded `client-mod-all-*.zip` file
2. Select "Extract All" or "Extract Here"
3. Extract the contents directly into your **Mods Folder**
4. **Important**: Overwrite any existing mods when prompted

## Verify Installation

### Check Mods Folder
Your mods folder should now contain many `.jar` files, including:
- `fabric-api-*.jar`
- `sodium-*.jar`
- `xaeros-world-map-*.jar`
- And many others

### Launch Minecraft
1. Open the Minecraft Launcher
2. Make sure **Fabric** is selected
3. Click "Play"
4. If everything is installed correctly, Minecraft should start with mods

## Troubleshooting

### Minecraft Won't Start
- Check that Fabric is selected in the launcher
- Verify all mods are in the correct folder
- Check that you have Java 21+ installed
- Try removing and reinstalling mods

### Missing Mods Error
- Make sure you downloaded the complete modpack
- Check that all files were extracted properly
- Verify the mods folder location is correct

### Version Mismatch
- Ensure you're using the latest modpack
- Check that mod versions match the server
- Update your modpack if needed

## Mod Updates

### When Updates Are Available
1. Check the Discord server for update announcements
2. Download the new modpack from Google Drive
3. Replace all mods in your mods folder
4. Overwrite existing files when prompted

### Backup Your Mods
Before updating:
1. Copy your current mods folder
2. Rename it to `mods-backup`
3. This way you can restore if something goes wrong

## Next Steps

Once mods are installed, proceed to [Connect to Server](/docs/minecraft/server/connection). 