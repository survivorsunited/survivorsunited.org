---
sidebar_position: 5
title: FAQ
description: Frequently asked questions and troubleshooting for the Survivors United Minecraft server
---

# Frequently Asked Questions

This page contains answers to common questions about the Survivors United Minecraft server. If you don't find your answer here, please ask in the Discord support channel.

## Installation Questions

### How do I install Java?
Run this command in PowerShell:
```powershell
winget install --id=Oracle.JDK.22 -e
```

### How do I install Minecraft Java Edition?
You have two options:
1. **Xbox App**: Search for Minecraft and install it
2. **Command Line**: Run `winget install -e --id Mojang.MinecraftLauncher`

### Where do I get the Fabric installer?
Download `fabric-installer-1.0.3.jar` from:  
[https://drive.google.com/file/d/1aJLyUVQpBF78CrNiesIKSOuf5Y3MFz-g/view?usp=drive_link](https://drive.google.com/file/d/1aJLyUVQpBF78CrNiesIKSOuf5Y3MFz-g/view?usp=drive_link)

### How do I run the Fabric installer?
If your computer doesn't recognize `.jar` files, run this command:
```cmd
Java -jar fabric-installer-1.0.3.jar
```

## Mod Questions

### Where do I find the mods?
Download the latest modpack from the shared Google Drive:  
[Google Drive – Shared Mods and Shaders](https://drive.google.com/drive/folders/1S6SMU223DnPjUVCfcpRXFlnZUHGfjiqk?usp=drive_link)

### How do I install mods?
1. Find the `mods` folder in the Google Drive
2. Download the latest `modpack-1.21.8.zip` file
3. Extract it into your Minecraft mods folder
4. Overwrite any existing mods

### Where is my Minecraft mods folder?
- **Windows**: Press `Win + R`, type `%appdata%\.minecraft`, press Enter
- **MacOS**: In Finder, press `⇧ + ⌘ + G`, go to `~/Library/Application Support/minecraft`

### How do I install shared shaders for Iris?
1. Open the shared Google Drive
2. Look for the `shaders` folder
3. Copy the entire `shaders` folder into your `.minecraft` folder
4. The `shaders` folder should be at the same level as your `mods` folder

## Server Questions

### What's the server IP address?
The server address is: `server.survivorsunited.org`

### How do I connect to the server?
1. Open Minecraft with Fabric selected
2. Click **Multiplayer**
3. Click **Add Server**
4. Enter:
   - **Server Name**: SurvivorsUnited
   - **Server Address**: `server.survivorsunited.org`

### What version of Minecraft do I need?
Minecraft 1.21.5 with Fabric mods

### Do I need all the mods to join?
Yes, you need all the required mods to connect to the server. Missing mods will cause connection errors.

## Configuration Questions

### How do I change keybinds?
1. Launch Minecraft and click **Options**
2. Go to **Controls**
3. Then **Key Binds**
4. Click on conflicting keys and press new keys to reassign

### Which keybinds commonly conflict?
- **Xaero's World Map**: `M` (change to K or H)
- **Journeymap**: `J` and `N` (change to U or L)
- **Tom's Simple Storage**: `B` (change to F7)
- **Traveler's Backpack**: `B` and `N` (change to Y, P, or G)
- **Open Parties and Claims**: `P` (change to O or I)

### How do I use the maps?
- **Xaero's World Map**: Press the assigned key (default M) for full-screen map
- **Xaero's Minimap**: Shows on-screen minimap
- **Journeymap**: Alternative map system with waypoints

## Error Questions

### I get kicked for "not sending a response to the anti-cheat"
This means you need to update your mods. Download the latest modpack from the Google Drive and replace all mods in your mods folder.

### Minecraft won't start with mods
1. Make sure you have Java 21+ installed
2. Verify Fabric is selected in the launcher
3. Check that all mods are in the correct folder
4. Try removing and reinstalling mods

### I can't connect to the server
1. Check that you have all required mods
2. Verify you're using the correct server IP
3. Make sure your mod versions match the server
4. Try restarting Minecraft

### The game is laggy
1. Try reducing render distance
2. Disable shaders if using Iris
3. Close other programs
4. Check your graphics settings

### Mods aren't working
1. Verify mods are in the correct folder
2. Check that mod versions are compatible
3. Make sure Fabric is selected in launcher
4. Try reinstalling mods

## Community Questions

### How do I join Discord?
Join the appropriate Discord channels:
- **Lobby**: [${DISCORD_LOBBY}](${DISCORD_LOBBY})

### Where can I get help?
- **Discord Support**: #minecraft-support channel
- **Community Help**: Other players in Discord
- **Documentation**: This website and guides

### How do I report a problem?
- **Technical Issues**: Use #minecraft-support Discord channel
- **Player Issues**: Contact moderators through Discord
- **Server Problems**: Report in the support channel

### Can I suggest new mods?
Yes! Check the mod guidelines in the [Supported Mods](/docs/minecraft/supported-mods) page and discuss with the community.

## Performance Questions

### How can I improve performance?
1. **Use Sodium**: Already included in the modpack
2. **Reduce Render Distance**: Lower it in video settings
3. **Disable Shaders**: If using Iris shaders
4. **Close Other Programs**: Free up system resources
5. **Update Graphics Drivers**: Keep drivers current

### What are the minimum system requirements?
- **RAM**: 4GB minimum, 8GB recommended
- **Java**: Version 21 or higher
- **Graphics**: Any modern graphics card
- **Storage**: 2GB free space

### Can I use OptiFine?
No, OptiFine is not compatible with Fabric. Use Sodium and Iris instead for performance and shader support.

## Gameplay Questions

### How do I use land claims?
Use the Open Parties and Claims mod to claim and protect areas. Check the mod documentation for detailed instructions.

### How do I use waypoints?
- **Xaero's World Map**: Right-click on the map to set waypoints
- **Journeymap**: Use the waypoint system in the map interface

### How do I use the storage mods?
- **Tom's Simple Storage**: Place storage blocks and connect them
- **Traveler's Backpack**: Craft and use backpacks for extra storage

### How do I join parties?
Use the Open Parties and Claims mod to create or join parties with other players.

## Still Need Help?

If you couldn't find your answer here:

1. **Check Discord**: Ask in the #minecraft-support channel
2. **Search Documentation**: Look through other pages on this site
3. **Ask the Community**: Other players can often help
4. **Contact Moderators**: For server-specific issues

Remember, the community is here to help! Don't hesitate to ask questions in Discord. 