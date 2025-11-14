---
sidebar_position: 3
title: Craftable Name Tag
description: Craft name tags instead of relying on RNG from fishing or dungeon loot.
tags:
  - mods
  - crafting
  - quality-of-life
---

# Craftable Name Tag

[`Craftable Name Tag`](https://github.com/survivorsunited/mods-su-craftable-name-tag) adds a balanced crafting recipe for name tags, eliminating the need to rely on random chance from fishing or dungeon loot chests.

## 🏷️ About

Name tags are essential for naming and protecting your pets, but in vanilla Minecraft they can only be obtained through:
- Fishing (very low chance)
- Loot chests in dungeons, mineshafts, and other structures
- Trading with librarian villagers (expensive)

This mod adds a craftable recipe that makes name tags accessible while keeping them appropriately gated behind mid-game materials.

## ✨ Features

- **Craftable Recipe** - Create name tags using 1 String and 2 Iron Ingots
- **Balanced Cost** - Simple recipe that requires basic materials available early in the game
- **Server-Side Compatible** - Works server-side only; clients don't need the mod
- **No Dependencies** - Pure Fabric/Quilt mod with zero dependencies
- **Recipe Book Integration** - Recipe appears in the vanilla recipe book

## 🔨 Crafting Recipe

The name tag can be crafted using the following recipe:

|   |   | S |
|---|---|---|
|   | I |   |
| I |   |   |

**Materials Required:**
- 1x String
- 2x Iron Ingots

**Output:** 1 Name Tag

### Recipe Breakdown

- **String (1)**: The attachment mechanism for the tag
- **Iron Ingots (2)**: The metal tag/plate component

This recipe is balanced to require materials that players typically have access to after the early game, but still maintains value since iron ingots require smelting iron ore.

## 💡 Usage

Once crafted, name tags work exactly like vanilla name tags:

1. **Craft the name tag** using the recipe above
2. **Use an anvil** to name the tag (optional but recommended)
3. **Right-click on a mob** to apply the name tag
4. Named mobs won't despawn and can be easily identified

### Common Uses

- **Pet Protection**: Name your pets to prevent them from despawning
- **Animal Organization**: Name different animals in farms for easy identification
- **Decoration**: Name armor stands and other entities for builds
- **Trading**: Name villagers to keep track of specific trades

## 🎮 Server Compatibility

This mod is **server-side only**, meaning:
- ✅ **Server needs the mod** - Install on your dedicated server or single-player world
- ✅ **Clients can join without it** - Players don't need the mod installed
- ⚠️ **Recipe visibility** - Players without the mod won't see the recipe in their recipe book, but can still craft it if they know the pattern

## 📦 Installation

1. Download the latest release from the [GitHub repository's Releases page](https://github.com/survivorsunited/mods-su-craftable-name-tag/releases)
2. Place the `.jar` file into your `%appdata%\.minecraft\mods` directory (or server's `mods` folder)
3. Restart Minecraft or your server

The mod will automatically register the new recipe when the game loads.

## 🔧 Technical Details

- **Mod Loader**: Fabric
- **Minecraft Version**: 1.21.6+
- **Dependencies**: None
- **Side**: Server-side only (optional client-side for recipe book)

## 🐛 Troubleshooting

**Recipe doesn't appear in recipe book:**
- Make sure you have all required materials in your inventory
- Try crafting it manually in a crafting table first
- If on a server, ensure the mod is installed server-side

**Can't craft name tag:**
- Verify you have exactly: 1 String, 2 Iron Ingots
- Check that you're using the correct recipe pattern (String on top, 2 Iron Ingots below)
- Ensure the mod is properly installed and loaded

## 📚 Additional Resources

- [GitHub Repository](https://github.com/survivorsunited/mods-su-craftable-name-tag)
- Report issues or suggest improvements through [GitHub Issues](https://github.com/survivorsunited/mods-su-craftable-name-tag/issues)
