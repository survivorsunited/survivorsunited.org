---
title: Automatic Setup
description: Verbose PowerShell and Bash setup scripts for Windows and Mac.
hide_table_of_contents: true
---

import {AutomaticSetup} from '@site/src/components/InstallWizard';

For most players, start with the [Setup Wizard](/docs/minecraft/installation) and choose your computer, then Manual or Automatic.

## Windows

<AutomaticSetup computer="windows" />

## Mac

<AutomaticSetup computer="mac" />

## Technical reference

The scripts pin Minecraft 1.21.11, Fabric Loader 0.19.5, and the SHA256 of the Survivors United GitHub pack. Java downloads are verified against Adoptium's published SHA256. Windows uses WinGet's Mojang launcher package; Mac uses Mojang's signed launcher from its official download endpoint. Private Java runtimes do not change system Java or PATH.

Profiles use the selected Game Directory and Java 21. Existing launcher profiles are preserved and backed up. Client JARs from both pack folders are staged and verified before the old mods folder is moved. A failed activation attempts to restore the old folder. The script stops for running Minecraft/Launcher processes or linked paths rather than closing applications or following those paths.

A script cannot verify Java Edition ownership without the user's sign-in, or confirm a successful game launch and server connection. Those checks remain interactive. No worlds are opened or upgraded by the script. Downloads and logs are retained for troubleshooting; keep the private Java folder because the new profile refers to it.

If you need to undo a mod update, close the game and launcher, move the new mods folder aside, and rename your dated old-mods backup to `mods`. Restore the backed-up launcher profile JSON if needed. Do not delete worlds or settings.

Script interface: Windows `-CheckOnly` / `-GameDirectory 'full path'`; Mac `--check-only` / `--game-directory 'full path'`. Check-only does not download or alter files.

Fabric's [installer CLI documentation](https://wiki.fabricmc.net/install#cli_installation) describes the client installation options. Java metadata comes from the [Adoptium API](https://api.adoptium.net/q/swagger-ui/).
