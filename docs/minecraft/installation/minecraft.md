---
title: Install Minecraft
sidebar_position: 2
description: Install Minecraft Launcher with WinGet on Windows or the direct Mac download.
---

# Install Minecraft Java Edition

Keep an existing launcher when upgrading. Sign in with the account that owns **Minecraft: Java Edition**.

## Windows — WinGet

1. Open **PowerShell**.
2. Install the official launcher:

```powershell
winget install --exact --id Mojang.MinecraftLauncher --source winget
```

3. Follow the installer prompts and open **Minecraft Launcher** from the Start menu.

![Minecraft Launcher in the Xbox app](/img/minecraft/xbox-app-installation.png)

### Running from WSL

Use the Windows package manager through PowerShell:

```bash
powershell.exe -NoProfile -Command 'winget install --exact --id Mojang.MinecraftLauncher --source winget'
```

Open the Windows Minecraft Launcher from the Start menu once installation completes.

## Mac — direct download

1. [Download Minecraft Launcher for Mac (.dmg)](https://launcher.mojang.com/download/Minecraft.dmg).
2. Open the downloaded `.dmg`.
3. Drag **Minecraft** into **Applications**.
4. Open **Minecraft** from Applications.

## First launch — both computers

1. Open Minecraft Launcher.

![Minecraft Launcher signing in](/img/minecraft/minecraft-launcher.png)

2. Sign in with the Microsoft account that owns the game.
3. Select **Minecraft: Java Edition**.
4. Click **Play** and wait for the main menu. Keep single-player worlds closed during setup.
5. Quit the game and close the launcher before installing Fabric.

## Troubleshooting

**Buy Now / Play Demo:** check you used the account that owns Java Edition. Installing the launcher does not purchase a game licence.

**Launcher will not open:** finish the installer, check your internet connection, then reopen it.

**WinGet missing:** update **App Installer** in Microsoft Store and reopen PowerShell.

**Already running 1.21.8:** keep the launcher and your worlds. Install the new Fabric version and replace the mods using the next guides.

## Next step

[Install Fabric](/docs/minecraft/installation/fabric), then [Install or Update Mods](/docs/minecraft/mods/installation). For a single guided path, use the [Setup Wizard](/docs/minecraft/installation).
