---
title: Automatic Setup
description: Verbose PowerShell and Bash setup scripts for Windows and Mac.
hide_table_of_contents: true
---

import {AutomaticSetup} from '@site/src/components/InstallWizard';

For most players, start with the [Setup Wizard](/docs/minecraft/installation) and choose your computer. Automatic setup is selected by default; Manual is available if you prefer to follow the steps.

## Windows

<AutomaticSetup computer="windows" />

## Mac

<AutomaticSetup computer="mac" />

## Technical reference

The scripts target Minecraft 1.21.11 and Fabric Loader 0.19.5. Each run selects the latest stable Survivors United GitHub modpack release and verifies the pack against that same release's published SHA256. Future modpack releases are picked up automatically. If the release has no matching 1.21.11 pack or valid checksum, setup stops before replacing mods. Moving to another Minecraft version still requires an installer compatibility update. Java downloads are verified against Adoptium's published SHA256. Windows uses WinGet's Mojang launcher package; Mac uses Mojang's signed launcher from its official download endpoint. Private Java runtimes do not change system Java or PATH.

Profiles use the selected Game Directory, Java 21 or newer, and an 8 GB maximum memory allocation. Existing launcher profiles are preserved and backed up. Client JARs from both pack folders are staged and verified before the old mods folder is moved. A failed activation attempts to restore the old folder. The script waits for you to close running Minecraft/Launcher processes and stops for linked paths.

A script cannot verify Java Edition ownership without the user's sign-in, or confirm a successful game launch and server connection. Those checks remain interactive. No worlds are opened or upgraded by the script. Downloads and logs are retained for troubleshooting; keep the private Java folder because the new profile refers to it.

Launcher may show a first-run warning because Fabric modifies Minecraft and may not support all player safety features. During setup, you can press Enter to acknowledge this and remember the choice for the Survivors United installation, or answer **n** to keep the warning. Existing acknowledgements are detected. The original Launcher state is backed up and restored with your previous setup. If your Launcher uses an unsupported state format, tick **Don't warn me again about this installation** and press **Play** once in Launcher.

If setup fails, the script offers to restore your previous mods and launcher profiles. Close the game and launcher before restoring. You can also rerun the same command and choose **Restore** to use the latest setup backup. Restoration keeps the original backup and moves replaced mods aside. Installed Launcher, Java and Fabric files remain available; worlds and settings stay in place.

Script interface: Windows `-CheckOnly` / `-GameDirectory 'full path'` / `-RestoreBackup 'backup folder'`; Mac `--check-only` / `--game-directory 'full path'` / `--restore 'backup folder'`. Check-only does not download or alter files.

Missing Launcher, Java 21, Fabric and the modpack are installed automatically. On Windows, a missing WinGet is installed using [Microsoft's WinGet PowerShell module](https://learn.microsoft.com/en-us/windows/package-manager/winget/) before installing the launcher. Account sign-in and confirming the first game launch still require you.

Fabric's [installer CLI documentation](https://wiki.fabricmc.net/install#cli_installation) describes the client installation options. Java metadata comes from the [Adoptium API](https://api.adoptium.net/q/swagger-ui/).
