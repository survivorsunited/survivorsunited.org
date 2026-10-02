---
sidebar_position: 2
title: Minecraft Folders
description: Find the Minecraft game folder on Windows or Mac and keep worlds and settings safe.
---

# Minecraft Folders

For installation or upgrades, use **[Install or Upgrade](/docs/minecraft/installation)**. Step **(5)** finds your folder and backs up old mods; **(6)** copies the new files. This page is a reference.

## Windows

Press **Windows + R**, paste `%appdata%\.minecraft`, then press **Enter**.

## Mac

In Finder, press **Shift + Command + G**, paste `~/Library/Application Support/minecraft`, then press **Return**.

## Custom game folder

If you chose a different folder in the launcher, open **Installations → your Fabric profile → Edit** and check **Game Directory**. Use that folder instead. A blank Game Directory uses the default location above.

## What to keep

| Folder or file | What it contains | When upgrading |
| --- | --- | --- |
| `mods` | The mod `.jar` files | Move the old folder out as a backup, then create a fresh one for the new pack. |
| `saves` | Single-player worlds | Keep it. Back it up before opening a world in a newer game version. |
| `config` | Mod settings | Keep it. |
| Map folders | Maps and waypoints | Keep them. |
| `options.txt` | Game settings and controls | Keep it. |
| `resourcepacks` | Texture packs | Keep it. |
| `shaderpacks` | Optional shader ZIPs | Keep it. Shaders are not needed to join. |

Copy mod `.jar` files from the downloaded **mods** and **mods/optional** folders directly into the new game **mods** folder. Leave the downloaded **block** folder alone. Do not copy the entire archive over your game folder.

If your game folder does not exist, open Minecraft: Java Edition once, quit it, and try again.