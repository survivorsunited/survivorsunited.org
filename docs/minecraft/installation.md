---
title: Install or Update Minecraft
description: Simple Windows and Mac steps to install or update Minecraft and join Survivors United.
sidebar_position: 1
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Minecraft setup

Choose **Windows** or **Mac**, then follow steps **(1)–(7)**. Everything you need is on this page.

You need a Microsoft account that owns **Minecraft: Java Edition** and an internet connection. This guide uses the official Minecraft Launcher.

**Current server version: Minecraft 1.21.11 with Fabric.** Use that exact version, even if the launcher offers something newer.

:::tip Already playing on 1.21.8 or another older version?

Close Minecraft and its launcher before starting. Keep your Minecraft Launcher. Follow the same steps below, skipping (2) if it is already installed and (3) if you already have Java 21. In (4), install Fabric for **1.21.11**. In (5), move the old mods out before copying the new ones. In (6), select the new **1.21.11 Fabric** profile.

Updating the launcher alone does not update Fabric or your mods. These steps also work for a new modpack release on the same Minecraft version.

:::

<Tabs groupId="minecraft-os" defaultValue="windows" queryString values={[
  {label: 'Windows', value: 'windows'},
  {label: 'Mac', value: 'mac'},
]}>
<TabItem value="windows">

## Windows

### (1) Download the modpack

Open the [Survivors United downloads](https://github.com/survivorsunited/minecraft-mods-manager/releases/latest). Under **Assets**, click **modpack-1.21.11.zip**. Choose the modpack ZIP, rather than either “Source code” download.

In **Downloads**, right-click the ZIP → **Extract All** → **Extract**. Keep the extracted folder open; you will use its **mods** folder in (5).

### (2) Install Minecraft Launcher

**Already installed? Go to (3).**

Open the [Minecraft download page](https://www.minecraft.net/en-us/download), choose **Windows**, and open the downloaded installer. Follow its prompts.

Open **Minecraft Launcher**, sign in with the Microsoft account that owns the game, and select **Minecraft: Java Edition**. Launch it once, then quit the game and close the launcher.

### (3) Install Java 21

**Already have Java 21 installed? Go to (4).** Java lets the Fabric installer open.

Open [Java 21 downloads](https://adoptium.net/temurin/releases/?version=21&os=windows&arch=x64&package=jdk). Choose the **Windows x64 .msi** installer. Open the downloaded file and follow the prompts, keeping the default settings.

### (4) Install Fabric for 1.21.11

With the Minecraft Launcher closed, open the [Fabric download page](https://fabricmc.net/use/installer/) and choose **Download for Windows**. Open the downloaded installer.

On the **Client** tab, set **Minecraft Version** to **1.21.11**. Keep the suggested **Loader Version** and default install location, tick **Create profile**, then click **Install**. Close the installer when it reports success.

**Upgrading from 1.21.8? Do this step even if you already have Fabric.** The old Fabric profile still launches the old game version.

### (5) Replace the mods

Press **Windows + R**, paste the following, then press **Enter**:

```text
%appdata%\.minecraft
```

**Already have mods?** Move the existing **mods** folder to your Desktop and rename it **Survivors United old mods** (use a different name if that backup already exists). Keep it until the new setup works. This leaves the old files out of the game without deleting them.

Create a new folder named **mods** inside `.minecraft`. From the extracted download in (1), open **mods**, select the files ending in **.jar**, and copy them into your new **mods** folder. Leave the **optional** subfolder alone for now.

**Check:** opening `%appdata%\.minecraft\mods` should show the `.jar` files directly. There should be no ZIP and no second `mods` folder inside it. Do not double-click the individual `.jar` files.

### (6) Play with the new Fabric profile

Open **Minecraft Launcher** → **Minecraft: Java Edition**. In the profile selector beside **Play**, choose **fabric-loader … 1.21.11**, then click **Play**. The launcher may ask you to confirm that you want to play a modified installation.

If the profile is hidden, open **Installations** and enable **Modded**. Select the profile containing both **Fabric** and **1.21.11**.

### (7) Join the server

In Minecraft, click **Multiplayer** → **Add Server**. Enter **Survivors United** as the name and copy this into **Server Address**:

```text
minecraft.survivorsunited.org
```

Click **Done**, select **Survivors United**, then click **Join Server**. You're ready to play!

</TabItem>
<TabItem value="mac">

## Mac

### (1) Download the modpack

Open the [Survivors United downloads](https://github.com/survivorsunited/minecraft-mods-manager/releases/latest). Under **Assets**, click **modpack-1.21.11.zip**. Choose the modpack ZIP, rather than either “Source code” download.

In Finder → **Downloads**, double-click the ZIP to extract it (if your browser already extracted it, open that folder). Keep the extracted folder open; you will use its **mods** folder in (5).

### (2) Install Minecraft Launcher

**Already installed? Go to (3).**

Open the [Minecraft download page](https://www.minecraft.net/en-us/download), choose **Mac**, and open the downloaded `.dmg`. Drag **Minecraft** into **Applications**, then open it from **Applications**.

Sign in with the Microsoft account that owns the game and select **Minecraft: Java Edition**. Launch it once, then quit the game and quit the launcher.

### (3) Install Java 21

**Already have Java 21 installed? Go to (4).** Java lets the Fabric installer open.

Open **Apple menu → About This Mac**. If you see **Chip: Apple M…**, use the [Mac Apple silicon Java 21 download](https://adoptium.net/temurin/releases/?version=21&os=mac&arch=aarch64&package=jdk). If you see an **Intel processor**, use the [Mac Intel Java 21 download](https://adoptium.net/temurin/releases/?version=21&os=mac&arch=x64&package=jdk).

Choose the **.pkg** installer, open it, and follow the prompts, keeping the default settings.

### (4) Install Fabric for 1.21.11

With the Minecraft Launcher closed, open the [Fabric download page](https://fabricmc.net/use/installer/) and choose **Download installer (Universal/.JAR)**. Open the downloaded installer.

On the **Client** tab, set **Minecraft Version** to **1.21.11**. Keep the suggested **Loader Version** and default install location, tick **Create profile**, then click **Install**. Close the installer when it reports success.

**Upgrading from 1.21.8? Do this step even if you already have Fabric.** The old Fabric profile still launches the old game version.

### (5) Replace the mods

In Finder, press **Shift + Command + G**, paste the following, then press **Return**:

```text
~/Library/Application Support/minecraft
```

**Already have mods?** Move the existing **mods** folder to your Desktop and rename it **Survivors United old mods** (use a different name if that backup already exists). Keep it until the new setup works. This leaves the old files out of the game without deleting them.

Create a new folder named **mods** inside `minecraft`. From the extracted download in (1), open **mods**, select the files ending in **.jar**, and copy them into your new **mods** folder. Leave the **optional** subfolder alone for now.

**Check:** opening `~/Library/Application Support/minecraft/mods` should show the `.jar` files directly. There should be no ZIP and no second `mods` folder inside it. Do not double-click the individual `.jar` files.

### (6) Play with the new Fabric profile

Open **Minecraft Launcher** → **Minecraft: Java Edition**. In the profile selector beside **Play**, choose **fabric-loader … 1.21.11**, then click **Play**. The launcher may ask you to confirm that you want to play a modified installation.

If the profile is hidden, open **Installations** and enable **Modded**. Select the profile containing both **Fabric** and **1.21.11**.

### (7) Join the server

In Minecraft, click **Multiplayer** → **Add Server**. Enter **Survivors United** as the name and copy this into **Server Address**:

```text
minecraft.survivorsunited.org
```

Click **Done**, select **Survivors United**, then click **Join Server**. You're ready to play!

</TabItem>
</Tabs>

## Keep your worlds and settings

Only move the **mods** folder in (5). Leave **saves**, **config**, **resourcepacks**, **shaderpacks**, map folders, and **options.txt** where they are. Do not delete your Minecraft folder or copy the entire download over it.

Before opening an existing single-player world in the newer version, back up **saves** to a separate folder. Opening a world in a newer version can change it permanently. Joining our server does not require opening your single-player worlds.

**Use a custom game folder?** In the launcher, open **Installations → your Fabric profile → Edit** and check **Game Directory**. If you previously set a folder there, use that folder in (5) instead of the default path above. Make sure the new profile uses the intended folder too.

## Stuck on a step?

| What you see | What to do |
| --- | --- |
| **Buy Now** or **Play Demo** | Sign in with the Microsoft account that owns Minecraft: Java Edition. |
| Fabric installer will not open | Complete (3), then try again. On Mac, if macOS blocks the download, follow [Apple's instructions for opening an app from an identified source](https://support.apple.com/en-au/102445). |
| Minecraft folder is missing | Launch Java Edition once in (2), quit, then retry (5). |
| Old version or “incompatible mods” | Check (4) and (6) say **1.21.11**, then check (5) contains only the new pack's mods. |
| Cannot connect to the server | Check the address in (7). If it still fails, ask us for help. |

[Ask for help on Discord](${DISCORD_LOBBY}). Tell us **Windows or Mac**, the **step number**, and the **exact message** you see. A screenshot helps too.
