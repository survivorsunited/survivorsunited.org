---
sidebar_position: 1
title: Common Errors
description: Troubleshoot common issues and errors when setting up Minecraft with mods
---

# Common Errors and Solutions

This guide covers the most common errors you might encounter when setting up Minecraft with mods and how to fix them.

## Installation and Mod Errors

Use **[Install or Upgrade](/docs/minecraft/installation)** and choose your computer. Each wizard step has its own **Need help with this step?** section.

### Fabric installer will not open

Go to step **(3)** and install Java 21, then open the Fabric installer from the extracted GitHub pack in **(4)**. The Windows installer ends in `.exe`; the Mac installer ends in `.jar`.

### Minecraft will not start, or reports incompatible mods

Check these in order:

1. Fabric is installed for **Minecraft 1.21.11**, with **Loader 0.19.5**.
2. Your old mods are outside the game folder as a backup. Do not mix versions.
3. Both the downloaded **mods** files and the **mods/optional** files are directly in your Minecraft **mods** folder.
4. The launcher profile you selected contains **Fabric** and **1.21.11**.

The wizard walks through these checks in **(4)–(7)**. Keep worlds, maps, and settings in place. If it still fails, send the exact error and your computer type to [Discord support](/docs/minecraft/server/discord).

### Minecraft reports missing mods

Follow steps **(5)** and **(6)** of the wizard to replace the pack cleanly. Keep the old mods as a backup; copy the new `.jar` files from both download locations. Do not copy the ZIP or create a second mods folder inside the first.

## Connection Errors

### "Can't connect to server"
**Error**: Connection timeout or refused

**Solution**:
1. Check your internet connection
2. Verify the server address: `minecraft.survivorsunited.org`
3. Make sure you're using the Fabric profile
4. Check your firewall settings

### "Outdated client" Error
**Error**: `Outdated client! Please use 1.21.11`

**Solution**:
1. Make sure you're using Minecraft 1.21.11
2. Check that Fabric is installed correctly
3. Verify all mods are up to date
4. Try reinstalling Fabric

### "Missing mods on server"
**Error**: `Missing mods on server: [mod1, mod2]`

**Solution**:
1. Use the GitHub download in [Install or Upgrade](/docs/minecraft/installation)
2. Move old mods aside as a backup, then copy the new pack as shown in the wizard
3. Restart Minecraft
4. Check Discord for mod updates

## Performance Issues

### Low FPS
**Problem**: Game runs slowly or stutters

**Solution**:
1. Reduce render distance (8-12 chunks)
2. Turn off shaders temporarily
3. Close other programs
4. Allocate more RAM to Minecraft

**RAM Allocation**:
1. Open Minecraft Launcher
2. Go to Installations → Edit
3. Click "More Options"
4. Set JVM arguments: `-Xmx4G -Xms2G`

### Memory Issues
**Error**: `OutOfMemoryError` or game crashes

**Solution**:
1. Allocate more RAM to Minecraft
2. Reduce render distance
3. Turn off shaders
4. Close other programs

### Shader Performance
**Problem**: Shaders cause low FPS

**Solution**:
1. Use a lower quality shader preset
2. Reduce shadow quality
3. Turn off motion blur
4. Update graphics drivers

## File System Errors

### "Permission denied"
**Error**: Can't create or modify files

**Solution**:
1. Run File Explorer as administrator
2. Check folder permissions
3. Make sure you have write access
4. Try a different location

### "File not found"
**Error**: Can't find Minecraft folder

**Solution**:
1. Make sure Minecraft is installed
2. Use the correct path for your OS:
   - Windows: `%appdata%\.minecraft`
   - Mac: `~/Library/Application Support/minecraft`
   - Linux: `~/.minecraft`

### "Corrupted files"
**Error**: Files won't extract or are corrupted

**Solution**:
1. Re-download the file
2. Check your internet connection
3. Try a different browser
4. Use a different extraction tool

## Launcher Issues

### "Profile not found"
**Error**: Fabric profile doesn't appear

**Solution**:
1. Reinstall Fabric
2. Check that the installation completed
3. Refresh the launcher
4. Try creating a new profile manually

### "Version not found"
**Error**: Minecraft version not available

**Solution**:
1. Update the Minecraft Launcher
2. Download the required version
3. Check your internet connection
4. Try refreshing the launcher

### "Launcher won't start"
**Error**: Minecraft Launcher crashes

**Solution**:
1. Update the launcher
2. Clear launcher cache
3. Reinstall the launcher
4. Check Windows Update

## Advanced Troubleshooting

### Check Logs
1. Open `.minecraft/logs/`
2. Look for `latest.log`
3. Search for error messages
4. Share relevant parts with support

### Clean Installation
If nothing else works:
1. Backup your worlds and screenshots
2. Delete the `.minecraft` folder
3. Reinstall Minecraft
4. Follow the setup guide again

### Mod Conflicts
To identify conflicting mods:
1. Remove half the mods
2. Test if the game works
3. Add mods back one by one
4. Identify the problematic mod

## Getting Help

### Before Asking for Help
1. Check this troubleshooting guide
2. Search the Discord server
3. Check the FAQ page
4. Try the solutions above

### When Asking for Help
Provide:
- Exact error message
- Steps to reproduce the issue
- Your system specifications
- What you've already tried

### Useful Commands
```powershell
# Check Java version
java -version

# Check Minecraft folder
dir %appdata%\.minecraft

# Check mods folder
dir %appdata%\.minecraft\mods
```

## Prevention Tips

### Regular Maintenance
- Keep mods updated
- Backup your worlds regularly
- Clean up old files
- Monitor performance

### Best Practices
- Don't mix mod versions
- Always backup before updates
- Test in single-player first
- Keep your system updated

## Next Steps

If you're still having issues:
- [Check FAQ](/docs/minecraft/faq) for more solutions
- [Join Discord](/docs/minecraft/server/discord) for support
- [Review Installation](/docs/minecraft/installation/java) steps 
