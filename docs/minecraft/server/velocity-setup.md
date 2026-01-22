---
title: Velocity Proxy & Minecraft Network Conversion
sidebar_position: 10
description: Step-by-step guide and lessons learned from converting to a Velocity proxy-based Minecraft network with a PaparMC lobby server.
---

# Velocity Proxy & Minecraft Network Conversion

This guide details the process, technical steps, and lessons learned from converting Survivors United to a modern Minecraft network using Velocity proxy, a PaparMC lobby server, and advanced mod/plugin integration.

## Overview

We migrated from a single-server setup to a networked architecture using [Velocity](https://velocitypowered.com/) as a proxy, with a dedicated PaparMC lobby server in adventure mode. This enables all players to meet in a central hub before joining survival or other worlds.

---

## Step-by-Step Conversion Process

### 1. Download and Set Up Velocity Proxy
- Download the latest Velocity jar from [velocitypowered.com](https://velocitypowered.com/downloads).
- Place the jar in a new directory (e.g., `velocity/`).
- Create PowerShell or batch scripts to start Velocity with the desired memory and port settings.
- Configure Velocity to listen on the default Minecraft port (`25565`).

### 2. Configure Fabric Server for Proxy
- Download and install [FabricProxy-Lite](https://modrinth.com/mod/fabricproxy-lite) on your Fabric server.
- **Critical:** Set `hackEarlySend = true` in `FabricProxy-Lite.toml` to ensure compatibility with InertiaAntiCheat.
- Download and install [NoChatReports](https://modrinth.com/mod/no-chat-reports) for chat security.
- Set the Fabric server to `online-mode=false` (Velocity will handle authentication).
- Change the Fabric server port (e.g., `25566`) to avoid conflict with Velocity.
- Generate a new Velocity forwarding secret and update it in both the Velocity config and `FabricProxy-Lite.toml`.

### 3. Update Open Parties and Claims to Use MariaDB
- Install MariaDB and create a new database for claims.
- Update the Open Parties and Claims mod config to use MariaDB connection details.
- Migrate any existing data if needed.

### 4. Set Up PaparMC Lobby Server
- Download the latest [PaperMC](https://papermc.io/) jar and place it in a new directory (e.g., `lobby/`).
- Create scripts to start the PaperMC server.
- Install the following plugins:
  - [Advanced-Portals-Spigot-2.5.0](https://www.spigotmc.org/resources/advanced-portals.14356/)
  - [EssentialsX-2.21.1](https://essentialsx.net/)
  - [Spawn-2.4.1](https://www.spigotmc.org/resources/spawn.26444/)
- Set the lobby server to `online-mode=false` and a unique port (e.g., `25567`).
- Find and load a small, optimized world for the lobby (to minimize resource usage).
- Configure the lobby in adventure mode for a safe, non-destructive environment.

### 5. Update Network Architecture
- Velocity becomes the main entry point (`25565`), so no client changes are needed.
- All backend servers (Fabric, Lobby) run on different ports and are registered in the Velocity config.
- Update firewall and port forwarding rules as needed.

### 6. Test and Troubleshoot
- Test player connections through Velocity to both lobby and survival servers.
- Verify InertiaAntiCheat works (with `hackEarlySend = true`).
- Test portals, chat, and plugin/mod compatibility.
- Monitor logs for errors and resolve any issues.

---

## Gotchas & Lessons Learned

- **InertiaAntiCheat Compatibility:**
  - Must set `hackEarlySend = true` in `FabricProxy-Lite.toml` or players will be kicked for cheating.
- **Velocity Forwarding:**
  - Always generate a new forwarding secret and update it in both proxy and backend configs.
- **Online Mode:**
  - All backend servers must be set to `online-mode=false` when using Velocity.
- **Port Conflicts:**
  - Ensure all servers use unique ports; only Velocity listens on `25565`.
- **MariaDB Migration:**
  - Update Open Parties and Claims to use MariaDB for better performance and reliability.
- **Lobby World:**
  - Use a small, simple world for the lobby to reduce load and improve player experience.
- **Script Management:**
  - Create clear start/stop scripts for each server and the proxy for easy management.

---

## Example Scripts

### PowerShell: Start Velocity
```powershell
java -Xmx2G -jar velocity.jar
```

### PowerShell: Start Fabric Server
```powershell
java -Xmx4G -jar fabric-server-launch.jar --port 25566
```

### PowerShell: Start PaperMC Lobby
```powershell
java -Xmx2G -jar paper-xxx.jar --port 25567
```

---

## Troubleshooting

- **Players can't connect:**
  - Check Velocity and backend server logs for errors.
  - Verify forwarding secret and port settings.
- **InertiaAntiCheat kicks:**
  - Confirm `hackEarlySend = true` in FabricProxy-Lite config.
- **Chat/Portals not working:**
  - Ensure NoChatReports and Advanced-Portals are installed and configured.
- **Database issues:**
  - Test MariaDB connection from the server host.

---

## References
- [Velocity Documentation](https://velocitypowered.com/wiki/)
- [FabricProxy-Lite](https://modrinth.com/mod/fabricproxy-lite)
- [PaperMC](https://papermc.io/)
- [Open Parties and Claims](https://modrinth.com/mod/open-parties-and-claims)
- [EssentialsX](https://essentialsx.net/)
- [Advanced Portals](https://www.spigotmc.org/resources/advanced-portals.14356/) 
