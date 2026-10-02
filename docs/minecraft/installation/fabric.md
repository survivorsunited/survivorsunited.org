---
title: Install Fabric
sidebar_position: 3
description: Download, run, configure and verify Fabric for Survivors United.
---

# Install Fabric Minecraft Loader

Fabric Loader lets Minecraft run the Survivors United mods. **Fabric API is already in the modpack**, but you still install Fabric Loader using the included installer.

## (1) Download and extract the installer

[Download Survivors United modpack 1.21.11 ZIP](https://github.com/survivorsunited/minecraft-mods-manager/releases/download/release-2026.10.02-1.21.11-r3/modpack-1.21.11.zip).

- **Windows:** in Downloads, right-click the ZIP → **Extract All → Extract**.
- **Mac:** in Finder → Downloads, double-click the ZIP. If already extracted, open the folder.

Open the extracted folder's **install** folder. It includes:

- `fabric-installer-1.1.0.exe` for Windows.
- `fabric-installer-1.1.0.jar` for Mac, or for running with Java on either computer.

## (2) Open the installer

Close Minecraft and its launcher first.

- **Windows:** double-click `fabric-installer-1.1.0.exe`.
- **Mac:** double-click `fabric-installer-1.1.0.jar`.

### Command option — Windows PowerShell

Open the extracted **install** folder in File Explorer, right-click an empty area, and choose **Open in Terminal**. Run:

```powershell
java -jar .\fabric-installer-1.1.0.jar
```

### Command option — Mac Terminal

Type `cd ` in Terminal, drag the extracted **install** folder from Finder into the Terminal window, and press Return. Then run:

```bash
java -jar ./fabric-installer-1.1.0.jar
```

### WSL — use Windows Java

Open the extracted **install** folder in your WSL terminal, then run:

```bash
powershell.exe -NoProfile -Command 'java -jar .\fabric-installer-1.1.0.jar'
```

Use Windows Java and the Windows game folder when setting up the Windows launcher.

## (3) Configure and install

1. Select the **Client** tab.
2. Set **Minecraft Version** to **1.21.11**.
3. Set **Loader Version** to **0.19.5**.
4. Leave the installation location as the launcher folder.
5. Tick **Create profile**.
6. Click **Install** and wait for the success message.
7. Close the installer.

**Upgrading from 1.21.8?** Do this too: your old Fabric profile still launches the old game version.

### Install directly from the command line

From the extracted **install** folder, with Minecraft and the launcher closed:

**Windows PowerShell:**

```powershell
java -jar .\fabric-installer-1.1.0.jar client -dir "$env:APPDATA\.minecraft" -mcversion 1.21.11 -loader 0.19.5
```

**Mac Terminal:**

```bash
java -jar ./fabric-installer-1.1.0.jar client -dir "$HOME/Library/Application Support/minecraft" -mcversion 1.21.11 -loader 0.19.5
```

**WSL, targeting the Windows launcher:**

```bash
powershell.exe -NoProfile -Command 'java -jar .\fabric-installer-1.1.0.jar client -dir "$env:APPDATA\.minecraft" -mcversion 1.21.11 -loader 0.19.5'
```

Set a custom **Game Directory** on the new launcher profile after installation. Fabric's install location remains the launcher folder above.

## (4) Verify the profile

1. Open **Minecraft Launcher → Minecraft: Java Edition**.
2. Open the profile selector next to **Play**.
3. Look for **fabric-loader** and **1.21.11**.
4. If missing, open **Installations** and enable **Modded**.
5. Install the mods before pressing Play.

![Java Edition, Fabric profile selector and Play button highlighted](/img/minecraft/fabric-selection.png)

The existing screenshot shows **1.21.5**. It demonstrates the button positions; choose **1.21.11** for this setup.

## Troubleshooting

**The JAR will not open:** run `java -version` and check Java 21. Use the `java -jar` command above to see the error in the terminal.

**Wrong profile/version:** rerun the installer with the exact versions above, then choose the new profile.

**Mac blocks the downloaded installer:** open System Settings → Privacy & Security and use the approval for this installer if offered, then reopen it.

## Next step

[Install or Update Mods](/docs/minecraft/mods/installation), then [Connect to Server](/docs/minecraft/server/connection). Use the [Setup Wizard](/docs/minecraft/installation) for the complete guided process.
