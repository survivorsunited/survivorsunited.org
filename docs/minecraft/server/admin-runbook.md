---
sidebar_position: 5
title: Admin Runbook
description: Operational checks and recovery steps for Survivors United Minecraft server admins.
tags:
  - minecraft
  - admin
  - runbook
  - troubleshooting
---

# Minecraft Server Admin Runbook

This page captures repeatable checks for server admins. Keep it practical and avoid publishing secrets.

## Before changing server configuration

1. Stop the server if editing files directly.
2. Back up the Open Parties and Claims data and config folders.
3. Make one change at a time.
4. Start the server and test with a non-operator player.

Example backup targets:

```text
world/serverconfig/
world/data/openpartiesandclaims/
```

## Open Parties and Claims data locations

Open Parties and Claims does not use a separate SQL database for claims. It stores claim and party data in the world folder.

```text
world/data/openpartiesandclaims/player-claims/
world/data/openpartiesandclaims/parties/
world/data/openpartiesandclaims/player-configs/
world/data/openpartiesandclaims/server-info.nbt
```

The key claim database files are:

```text
world/data/openpartiesandclaims/player-claims/<player-uuid>.nbt
```

Large `.nbt` files usually indicate players with substantial claim data. Very small files often indicate an empty or minimal player claim record.

## Open Parties and Claims config files

Common config files:

```text
world/serverconfig/openpartiesandclaims-default-player-config.toml
world/serverconfig/openpartiesandclaims-server-claim-config.toml
world/serverconfig/openpartiesandclaims-wilderness-config.toml
world/serverconfig/openpartiesandclaims-expired-claim-config.toml
```

The main mod config may also exist as:

```text
world/serverconfig/openpartiesandclaims-server.toml
config/openpartiesandclaims-server.toml
```

## Claim access sanity check

Run these in game as an operator:

```text
/openpac-claims about
/openpac-parties about
/openpac-parties about <player>
```

Check a player's current claim access setting:

```text
/openpac player-config set claims.protection.exceptions.fullAccess A
```

If the server forces the value, the response will say so. For trusted allied-party access, the intended forced value is:

```text
Allies
```

## Testing claim protection

Use a non-operator player who is not in admin mode.

1. Stand inside the target claim.
2. Turn on chunk borders with `F3 + G`.
3. Test a vanilla block break.
4. Test a vanilla chest open.
5. Test the modded block or storage that reported the issue.

Interpretation:

| Result | Likely cause |
| --- | --- |
| Vanilla block and chest are blocked | Claims are working; the issue is probably modded-block compatibility. |
| Vanilla block and chest are allowed | Check party/allied-party access, admin mode, or config forcing. |
| Only one player can bypass | Check OP status, admin mode, party membership, and allied-party membership. |
| Old claims fail but new claims work | Check player config sub-claims and claim owner config. |

## Admin mode check

Operators can bypass claim restrictions when Open Parties and Claims admin mode is enabled.

Toggle admin mode:

```text
/openpac-claims admin-mode
```

If a player is an operator, test again after running the command until it says admin mode is disabled.

## Party and ally checks

Show the current party, members, allies, and invites:

```text
/openpac-parties about <player>
```

Remove an allied party:

```text
/openpac-parties ally remove <owner>
```

Kick a party member:

```text
/openpac-parties member kick <player>
```

## Useful log checks

Search startup logs for Open Parties and Claims:

```bash
grep -iE "openparties|open parties|openpac|loading claims|loaded claims|exception loading|claims disabled" logs/latest.log
```

Search for mixin or hook failures after a mod update:

```bash
grep -iE "openparties|openpac|mixin|inject|InjectionError|ChunkProtection|NoSuchMethod|ClassCast|Callback|failed" logs/latest.log
```

## Mod update checks

After updating Minecraft, Fabric, or server-side mods:

1. Confirm the modpack version matches the server version.
2. Confirm Open Parties and Claims starts cleanly.
3. Run `/openpac-claims about` as an existing claimed player.
4. Confirm claim count is not unexpectedly zero.
5. Test vanilla block/chest protection with a non-operator player.
6. Test known farm behaviours that rely on portals, piglins, foxes, or dropped items.

## Rollback rule

If the claim database is present and `/openpac-claims about` works, do not rename claim `.nbt` files until a UUID mismatch is proven.

If claim protection fails immediately after a mod jar update and config is unchanged, test by rolling back the changed mod jar first rather than editing claim data.
