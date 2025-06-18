/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    "getting-started",
    "faq",
    "supported-mods",
    "terminology",
    {
      type: "category",
      label: "Minecraft",
      items: [
        {
          type: "category",
          label: "Getting Started",
          items: [
            "minecraft/getting-started"
          ]
        },
        {
          type: "category",
          label: "Installation",
          items: [
            "minecraft/installation/java",
            "minecraft/installation/minecraft",
            "minecraft/installation/fabric"
          ]
        },
        {
          type: "category",
          label: "Mods",
          items: [
            "minecraft/mods/installation",
            "minecraft/mods/folder-setup"
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
        }
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
};

module.exports = sidebars; 