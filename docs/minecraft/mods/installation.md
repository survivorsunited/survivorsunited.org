---
title: Install or Update Mods
sidebar_position: 1
description: Download, back up and install the Survivors United client mods on Windows or Mac.
---

# Install or Update Mods

Close Minecraft and its launcher before changing mods. Install [Java 21](/docs/minecraft/installation/java) and [Fabric for 1.21.11](/docs/minecraft/installation/fabric) first.

## (1) Download and extract the modpack

[Download Survivors United modpack 1.21.11 ZIP](https://github.com/survivorsunited/minecraft-mods-manager/releases/download/release-2026.10.02-1.21.11-r3/modpack-1.21.11.zip).

- **Windows:** right-click the downloaded ZIP → **Extract All → Extract**.
- **Mac:** double-click the ZIP in Finder → Downloads.

Keep the extracted folder open. The client files are in **mods** and **mods → optional**.

## (2) Find your game folder

### Windows

Press **Windows + R**, enter this path, and press Enter:

```text
%appdata%\.minecraft
```

![Windows Run dialog opening the Minecraft folder](/img/minecraft/windows-minecraft-folder.png)

Or open it from PowerShell:

```powershell
explorer.exe "$env:APPDATA\.minecraft"
```

From WSL:

```bash
powershell.exe -NoProfile -Command 'explorer.exe "$env:APPDATA\.minecraft"'
```

### Mac

In Finder, press **Shift + Command + G**, paste this path, and press Return:

```text
~/Library/Application Support/minecraft
```

Or open it from Terminal:

```bash
open "$HOME/Library/Application Support/minecraft"
```

### Custom Game Directory

If your old launcher profile has a custom folder, read **Installations → old Fabric profile → Edit → Game Directory**. Use that folder for the mods and set the new 1.21.11 profile to it. A blank Game Directory uses the default above.

## (3) Back up the old mods

1. If **mods** exists, move that folder to your Desktop.
2. Rename it **Survivors United old mods**. Use a new name if a backup already exists.
3. Create a new, empty **mods** folder inside the game folder.

Only move **mods**. Keep **saves**, **config**, maps, **options.txt**, and all other settings in place. Keep the backup until you have joined successfully.

First install with no mods folder? Create the empty folder and continue.

## (4) Copy the client files

1. Open the extracted download's **mods** folder.
2. Copy its **.jar files** into your game's empty **mods** folder.
3. Open the download's **mods → optional** folder.
4. Copy its **.jar files** into the same game **mods** folder.

The release's client instructions include both sets. Leave **block**, server files, config and shaders in the download alone.

## (5) Verify and launch

Your game **mods** folder must contain the `.jar` files directly. It must not contain the ZIP or another nested **mods** folder. Do not mix in old mod versions.

1. Open Minecraft Launcher → **Java Edition**.
2. Select the profile with **Fabric** and **1.21.11**.
3. Click **Play** and wait for the main menu.

![Fabric profile selector and Play button](/img/minecraft/fabric-selection.png)

The screenshot shows an older version. Select **1.21.11** for the current setup.

## Troubleshooting

**Minecraft fails to start:** check the selected Fabric version, the actual Game Directory, and both sets of client JARs.

**Missing mods:** make sure you copied the files from both **mods** and **mods/optional**.

**Version mismatch:** use the exact pack above and the matching Fabric profile. Updating the launcher alone does not update your mods.

**Restore a backup:** close the game and launcher, move the new mods folder aside, then move the backed-up old mods folder back as **mods**. Select the old matching Fabric profile if returning to the older game version.

## Next step

[Connect to Server](/docs/minecraft/server/connection). The [Setup Wizard](/docs/minecraft/installation) guides you through the same process, or choose its Automatic option to run the setup script.
