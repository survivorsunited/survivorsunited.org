---
sidebar_position: 4
title: Server Configuration
description: Public notes for the Survivors United Minecraft server configuration and intended gameplay settings.
tags:
  - minecraft
  - server
  - configuration
  - opac
---

# Server Configuration

This page records the public, gameplay-facing configuration for the Survivors United Minecraft server.

Do not publish secrets here. Keep passwords, API tokens, RCON details, private IP addresses, webhook URLs, database credentials, and provider credentials out of this repository.

## Configuration source of truth

The public website should document the intended behaviour. The production server files remain the source of truth for the running server.

Useful server-side locations:

```text
world/serverconfig/openpartiesandclaims-default-player-config.toml
world/serverconfig/openpartiesandclaims-server-claim-config.toml
world/serverconfig/openpartiesandclaims-wilderness-config.toml
world/serverconfig/openpartiesandclaims-expired-claim-config.toml
world/data/openpartiesandclaims/player-claims/
world/data/openpartiesandclaims/parties/
world/data/openpartiesandclaims/player-configs/
```

Manual TOML edits should be made while the server is stopped. If the server is running, prefer the `/openpac` commands.

## Open Parties and Claims baseline

### Player claims

Normal player claims should allow party members and allied parties to use the claim:

```toml
fullAccess = "A"
```

Access values:

| Value | Meaning |
| --- | --- |
| `N` | Nobody |
| `P` | Party |
| `A` | Allies |
| `E` | Everyone |

### Server claims

Server/admin claims should use the same access model when they are intended to be shared with allied trusted parties:

```toml
fullAccess = "A"
```

If a server claim is for spawn, infrastructure, or staff-only areas, use a more restrictive value such as:

```toml
fullAccess = "N"
```

### Nether portals and mob interaction

The intended compatibility baseline for shared server claims is:

```toml
netherPortalsMobs = "E"
netherPortalsOther = "E"
```

This keeps portal behaviour permissive for mobs and non-living entities where required by farms or portal-based builds.

### Piglin and fox dropped-item behaviour

For farms and vanilla mechanics that rely on item pickup or dropped-item interaction, the intended compatibility baseline is:

```toml
Piglins = "E"
Foxes = "E"
```

These values usually appear under dropped-item access exception groups.

### Mob griefing override

The intended baseline is:

```toml
overrideMobGriefingRule = false
```

This avoids Open Parties and Claims forcing mob griefing behaviour in a way that conflicts with server rules or farm mechanics.

## Party location sharing

Party and ally location sharing controls map/location visibility, not claim access.

Current baseline:

```toml
[playerConfig.parties]
name = ""
shareLocationWithParty = true
shareLocationWithMutualAllyParties = false
receiveLocationsFromParty = true
receiveLocationsFromMutualAllyParties = false
```

Use claim access values such as `fullAccess = "A"` to control whether allies can interact with claims.

## Admin checklist after config changes

After changing server config files:

1. Stop the server before editing TOML files.
2. Back up the current `world/serverconfig` and `world/data/openpartiesandclaims` folders.
3. Apply the config change.
4. Start the server.
5. Run an in-game check:

```text
/openpac-claims about
/openpac-parties about
/openpac player-config set claims.protection.exceptions.fullAccess A
```

A good result for forced allied access is:

```text
The server config forces it to Allies.
```

A bad result, if allies should have access, is:

```text
The server config forces it to Party.
```

## Modpack and release configuration

The public modpack release process is managed by the Survivors United Mod Manager. See the [Mod Manager](../../tools/mod-manager) page for release automation and download metadata.
