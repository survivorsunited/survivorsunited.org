---
sidebar_position: 1
title: Install Java
description: How to install Java for Minecraft and mods
---

# Install Java

To run mods, you'll need at least **Java 21** installed. We recommend using Java 22.

## Installation Method

Run this in PowerShell to install Java:

```powershell
winget install --id=Oracle.JDK.22 -e
```

## Verification

After installation, you can verify Java is installed by running:

```powershell
java -version
```

You should see output similar to:
```
java version "22.x.x" 2024-xx-xx
Java(TM) SE Runtime Environment (build 22.x.x+xx-xx)
Java HotSpot(TM) 64-Bit Server VM (build 22.x.x+xx-xx, mixed mode, sharing)
```

## Alternative Installation Methods

### Manual Download
If the winget command doesn't work, you can:
1. Visit [Oracle's Java download page](https://www.oracle.com/java/technologies/downloads/)
2. Download Java 22 for Windows
3. Run the installer manually

### Using Chocolatey
If you have Chocolatey installed:
```powershell
choco install openjdk22
```

## System Requirements

- **Windows**: Windows 10 or later (64-bit)
- **RAM**: At least 4GB available
- **Storage**: ~500MB free space

## Troubleshooting

### Java Not Found
If you get "java is not recognized" after installation:
1. Restart your terminal/PowerShell
2. Check that Java is in your PATH environment variable
3. Try restarting your computer

### Version Conflicts
If you have multiple Java versions installed:
1. Check which version is being used: `java -version`
2. Set JAVA_HOME environment variable to point to Java 22
3. Ensure Java 22 is first in your PATH

## Next Steps

Once Java is installed, proceed to [Install Minecraft](/docs/minecraft/installation/minecraft). 