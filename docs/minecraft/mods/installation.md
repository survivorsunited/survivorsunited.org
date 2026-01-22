---
sidebar_position: 1
title: Install Mods
description: How to download and install mods for the Survivors United server
---

# Install Mods

To play on the Survivors United server, you need to install the required mods. This guide will walk you through the process.

## Download Mods

:::tip 📦 Download the Latest Modpack

**Click the button below to download the latest modpack for the Survivors United server:**

<div style={{textAlign: 'center', margin: '20px 0'}}>
<a 
  href="${DOWNLOAD_LINK_MODPACK}" 
  style={{
    display: 'inline-block', 
    padding: '14px 28px', 
    fontSize: '18px', 
    fontWeight: 'bold', 
    color: '#fff', 
    backgroundColor: '#25c2a0', 
    textDecoration: 'none', 
    borderRadius: '6px',
    transition: 'background-color 0.2s'
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#21af90'}
  onMouseLeave={(e) => e.target.style.backgroundColor = '#25c2a0'}
>
    <span>⬇️ Download Latest Modpack</span>
</a>
</div>

After downloading, extract the contents into your mods folder: `%appdata%\.minecraft\mods` (create it if it doesn't exist; the folder should contain only `.jar` files).

:::

> **Note:** The modpack includes shader packs in the `shaderpacks/` folder. Extract them to `%appdata%\.minecraft\shaderpacks` if you want to use shaders.

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

1. Right-click the downloaded modpack archive from the link above (`modpack.zip`)
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
2. Download the new modpack using the [site download link](${DOWNLOAD_LINK_MODPACK}) or visit the [Survivors United Mod Manager](../../tools/mod-manager.md)
3. Replace all mods in your mods folder
4. Overwrite existing files when prompted

### Backup Your Mods
Before updating:
1. Copy your current mods folder
2. Rename it to `mods-backup`
3. This way you can restore if something goes wrong

## Next Steps

Once mods are installed, proceed to [Connect to Server](/docs/minecraft/server/connection). 
