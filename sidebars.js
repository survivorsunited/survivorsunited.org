/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  minecraftSidebar: [
    "minecraft/getting-started",
    {
      type: "category",
      label: "Installation",
      collapsed: false,
      items: [
        "minecraft/installation/java",
        "minecraft/installation/minecraft",
        "minecraft/installation/fabric"
      ]
    },
    {
      type: "category",
      label: "Get the Mods",
      collapsed: false,
      items: [
        "minecraft/mods/installation",
        "minecraft/mods/folder-setup"
      ]
    },
    "faq",
    {
      type: "category",
      label: "Supported Mods",
      items: [
        "minecraft/supported-mods/index",
        "minecraft/supported-mods/about"
      ]
    },
    "terminology",
    {
      type: "category",
      label: "Getting Started",
      items: [
        "minecraft/getting-started"
      ]
    },
    {
      type: "category",
      label: "Tools",
      items: [
        "tools/mod-manager",
        "tools/modpack-release-sync",
        "tools/journeymap-export"
      ]
    },
    {
      type: "category",
      label: "Our Mods",
      items: [
        "minecraft/our-mods/index",
        "minecraft/our-mods/mods-su-compostables",
        "minecraft/our-mods/mods-su-craftable-name-tag"
      ]
    },
    {
      type: "category",
      label: "Server",
      items: [
        "minecraft/server/connection",
        "minecraft/server/discord"
      ]
    },
    {
      type: "category",
      label: "First Steps",
      items: [
        "minecraft/first-steps/things-to-do-first",
        "minecraft/first-steps/things-to-visit"
      ]
    },
    {
      type: "category",
      label: "Configuration",
      items: [
        "minecraft/configuration/keybinds",
        "minecraft/configuration/shaders"
      ]
    },
    {
      type: "category",
      label: "Troubleshooting",
      items: [
        "minecraft/troubleshooting/errors"
      ]
    },
    {
      type: "category",
      label: "Community",
      items: [
        "minecraft/community-farms"
      ]
    }
  ],
  hytaleSidebar: [
    "hytale/getting-started",
    "hytale/mods"
  ],
};

module.exports = sidebars; 