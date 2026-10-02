---
title: Install Java
sidebar_position: 1
description: Install and verify Java 21 with WinGet on Windows or the direct Mac installer.
---

# Install Java 21

Java opens the Fabric installer. If you already have Java 21, keep it.

## Windows — PowerShell

1. Open **PowerShell** from the Start menu.
2. Run:

```powershell
winget install --exact --id EclipseAdoptium.Temurin.21.JDK --source winget
```

3. Follow the installer prompts.
4. Close and reopen PowerShell to pick up the installed Java.
5. Verify:

```powershell
java -version
```

The version should start with **21**, for example `openjdk version "21.0.x"`.

### Running from WSL

Install Windows Java for the Windows Minecraft Launcher through PowerShell:

```bash
powershell.exe -NoProfile -Command 'winget install --exact --id EclipseAdoptium.Temurin.21.JDK --source winget'
```

After reopening your terminal, verify Windows Java:

```bash
powershell.exe -NoProfile -Command 'java -version'
```

## Mac — direct downloads

1. Open **Apple menu → About This Mac**.
2. Download the installer for the chip shown:
   - **Apple M1, M2, M3 or another Apple M chip:** [Download Java 21 for Apple silicon (.pkg)](https://api.adoptium.net/v3/installer/latest/21/ga/mac/aarch64/jdk/hotspot/normal/eclipse).
   - **Intel processor:** [Download Java 21 for Intel (.pkg)](https://api.adoptium.net/v3/installer/latest/21/ga/mac/x64/jdk/hotspot/normal/eclipse).
3. Open the downloaded `.pkg`, continue through the installer, and keep the default settings.
4. Open **Terminal** and verify:

```bash
java -version
```

These links download the installers directly.

## Troubleshooting and verification

**Java not recognised on Windows:** reopen PowerShell after installation. If it still cannot find Java, restart the computer and rerun `java -version`.

**Wrong Java version:** check which installation is selected:

```powershell
where.exe java
$env:JAVA_HOME
```

On Mac:

```bash
/usr/libexec/java_home -V
/usr/libexec/java_home -v 21
```

To use Java 21 for the current Mac Terminal session:

```bash
export JAVA_HOME="$(/usr/libexec/java_home -v 21)"
export PATH="$JAVA_HOME/bin:$PATH"
java -version
```

**WinGet not found:** update **App Installer** in Microsoft Store, reopen PowerShell, and retry.

Minecraft Launcher manages its own Java for playing. Installing Minecraft alone does not always make `java` available for opening the Fabric installer.

## Next step

[Install Minecraft Launcher](/docs/minecraft/installation/minecraft), or go straight to [Install Fabric](/docs/minecraft/installation/fabric) if you already have it. The [Setup Wizard](/docs/minecraft/installation) keeps these steps together.
