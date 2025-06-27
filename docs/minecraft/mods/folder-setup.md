---
sidebar_position: 2
title: Folder Setup
description: Understanding Minecraft folder structure and organization
---

# Minecraft Folder Setup

Understanding your Minecraft folder structure is important for installing mods, shaders, and other custom content.

## Minecraft Folder Location

### Windows
```
%appdata%\.minecraft
```
**Quick Access**: Press `Win + R`, type `%appdata%\.minecraft`, press Enter

### MacOS
```
~/Library/Application Support/minecraft
```
**Quick Access**: In Finder, press `⇧ + ⌘ + G`, type the path above

### Linux
```
~/.minecraft
```

## Folder Structure

Your `.minecraft` folder contains several important subfolders:

```
.minecraft/
├── mods/              # Your mods go here
├── shaderpacks/       # Shader packs for Iris, to make Minecraft look awesome
├── resourcepacks/     # Resource packs
├── saves/             # Single-player worlds
├── screenshots/       # Game screenshots
├── logs/              # Game logs
├── crash-reports/     # Crash reports
├── options.txt        # Game settings
├── launcher_profiles.json  # Launcher profiles
└── versions/          # Minecraft versions
```

## Important Folders

### Mods Folder
- **Location**: `.minecraft/mods/`
- **Purpose**: Contains all your mod `.jar` files
- **Contents**: Fabric API, Sodium, Xaero's maps, etc.

### Shaders Folder
- **Location**: `.minecraft/shaders/`
- **Purpose**: Contains shader packs for Iris
- **Contents**: Shader pack folders (e.g., `BSL`, `SEUS`)

### Resource Packs
- **Location**: `.minecraft/resourcepacks/`
- **Purpose**: Custom textures and sounds
- **Contents**: `.zip` files or folders

## Setting Up Your Folders

### Step 1: Create Required Folders

If these folders don't exist, create them:

1. **Mods Folder**
   ```
   .minecraft/mods/
   ```

2. **Shaders Folder** (if using Iris)
   ```
   .minecraft/shaders/
   ```

### Step 2: Organize Your Mods

Your mods folder should contain:
- **Core Mods**: `fabric-api-*.jar`, `sodium-*.jar`
- **Map Mods**: `xaeros-world-map-*.jar`, `journeymap-*.jar`
- **Storage Mods**: `toms-storage-*.jar`, `travelers-backpack-*.jar`
- **Performance Mods**: `ferritecore-*.jar`, `blast-*.jar`

### Step 3: Install Shaders (Optional)

If you want to use shaders:

1. Download shader packs from the shared Google Drive
2. Extract them to `.minecraft/shaders/`
3. Each shader pack should be in its own folder

## File Types Explained

### JAR Files
- **Extension**: `.jar`
- **Purpose**: Java Archive files containing mod code
- **Location**: `mods/` folder
- **Example**: `fabric-api-0.126.0+1.21.5.jar`

### ZIP Files
- **Extension**: `.zip`
- **Purpose**: Compressed archives (modpacks, shaders)
- **Usage**: Extract contents to appropriate folders
- **Example**: `client-mod-all-1.21.5.zip`

### Configuration Files
- **Extension**: `.json`, `.toml`, `.properties`
- **Purpose**: Mod settings and configurations
- **Location**: `config/` folder (created automatically)

## Troubleshooting

### Can't Find Minecraft Folder
- Make sure Minecraft is installed
- Check that you're using the correct path for your OS
- Try searching for `.minecraft` in File Explorer

### Permission Errors
- Run File Explorer as administrator
- Check folder permissions
- Make sure you have write access

### Corrupted Files
- Delete the problematic file/folder
- Re-download from the source
- Check file integrity

## Best Practices

### Organization
- Keep your mods folder organized
- Don't mix different mod versions
- Use descriptive names for custom folders

### Backups
- Regularly backup your mods folder
- Keep a copy of working configurations
- Document any custom changes

### Updates
- Always backup before updating
- Remove old mod versions
- Check compatibility between mods

## Advanced Setup

### Multiple Mod Profiles
You can create different mod configurations:
1. Create separate mod folders (e.g., `mods-server`, `mods-singleplayer`)
2. Swap folders as needed
3. Use launcher profiles for different setups

### Custom Configurations
- Mod settings are stored in `config/` folder
- Each mod has its own configuration file
- Backup configurations when switching setups

## Next Steps

Once your folders are set up correctly, you can:
- [Install Mods](/docs/minecraft/mods/installation)
- [Connect to Server](/docs/minecraft/server/connection)
- [Configure Keybinds](/docs/minecraft/configuration/keybinds) 