---
sidebar_position: 3
title: Claims and Parties
description: How land claims, parties, and allied parties work on the Survivors United Minecraft server.
tags:
  - minecraft
  - claims
  - parties
  - server
---

# Claims and Parties

Survivors United uses **Open Parties and Claims** to protect builds, farms, storage areas, and community projects on the Survival server.

Claims are chunk-based. If a block is outside the claimed chunk, claim protection will not apply to that block. Use Minecraft chunk borders when checking boundaries.

```text
F3 + G
```

## Claim access levels

Open Parties and Claims uses short access values for claim protection groups.

| Value | Meaning | Used for |
| --- | --- | --- |
| `N` | Nobody | Only the claim owner has access unless another explicit exception applies. |
| `P` | Party | Members of the claim owner's party have full access. |
| `A` | Allies | Members of the claim owner's party and allied parties have full access. |
| `E` | Everyone | Everyone has full access. Use carefully. |

The intended Survivors United default for player claims is:

```toml
fullAccess = "A"
```

This lets trusted allied parties use each other's claims while still protecting against unrelated players.

## Parties vs allied parties

A **party** is a direct group of players. An **allied party** is a different party that has been linked to yours.

For example, if the `Admins` party is allied with `LievBa`, `Arkadi`, and `Lilah`, those parties are not direct members of `Admins`, but they can be allowed by claim settings that use `A` for Allies.

## Useful player commands

Check your claim count and current claim display settings:

```text
/openpac-claims about
```

Check your party, party members, allied parties, and invites:

```text
/openpac-parties about
```

Check another player's party information as an operator:

```text
/openpac-parties about <player>
```

Allow allied parties to use your claims:

```text
/openpac player-config set claims.protection.exceptions.fullAccess A
```

Allow only party members:

```text
/openpac player-config set claims.protection.exceptions.fullAccess P
```

Lock access down to yourself only:

```text
/openpac player-config set claims.protection.exceptions.fullAccess N
```

## Sub-claims

If a claim was made using a sub-config, changing only the main player config may not change that sub-claim.

List your sub-configs:

```text
/openpac player-config sub list
```

Set allied access on a sub-config:

```text
/openpac player-config sub set <sub-id> claims.protection.exceptions.fullAccess A
```

## Managing allied parties

Remove an allied party from your party:

```text
/openpac-parties ally remove <owner>
```

Kick a member from your party:

```text
/openpac-parties member kick <player>
```

## Troubleshooting claim access

### The command says the server config forces a value

If a command says something like:

```text
The server config forces it to Party.
```

then the player cannot override that value. The server default config is forcing the claim access level. Ask an admin to check the Open Parties and Claims server config.

### A player can walk into a claim

Walking into a claim is separate from opening chests, breaking blocks, or using machines. A claim can allow movement while still blocking interaction.

### A player can open or break things in a claim

Check the following:

1. Confirm the block is inside the claimed chunk using `F3 + G`.
2. Confirm the player is not an operator using admin mode.
3. Check whether the player is in your party or an allied party.
4. Check whether the claim was made using a sub-config.
5. Test with a vanilla block or vanilla chest to separate claim configuration from modded-block compatibility.

### Admin mode

Operators can toggle Open Parties and Claims admin mode:

```text
/openpac-claims admin-mode
```

If admin mode is enabled, that operator can bypass normal claim restrictions. Run the command again to turn it off.
