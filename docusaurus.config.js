// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

//import dotenv
require("dotenv").config();



/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Survivors United",
  tagline: "A multi-game survival community",
  favicon: "img/brand/favicon.ico",
  headTags: [
    { tagName: "link", attributes: { rel: "icon", type: "image/png", sizes: "32x32", href: "/img/brand/survivors-united-icon-32.png" } },
    { tagName: "link", attributes: { rel: "icon", type: "image/png", sizes: "64x64", href: "/img/brand/survivors-united-icon-64.png" } },
    { tagName: "link", attributes: { rel: "apple-touch-icon", sizes: "256x256", href: "/img/brand/survivors-united-icon-256.png" } },
  ],

  // Set the production url of your site here
  url: "https://survivorsunited.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "survivorsunited", // Usually your GitHub org/user name.
  projectName: "survivorsunited.org", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/survivorsunited/survivorsunited.org/tree/main/",
        },
        /*
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/survivorsunited/survivorsunited.org/tree/main/",
        },
        */
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: "right",
        docsRouteBasePath: ["docs"],
        indexPages: true,
        ignoreFiles: [],
      },
    ],
  ],

  markdown: {
    preprocessor: ({ filePath, fileContent }) => {

      const regexp = /\${([^{]+)}/g;
      let result = fileContent.replace(regexp, function(ignore, key){
          return process.env[key] || "";
      });

      return result;
    },
  },

  themeConfig:
    /** @type {import('@docusaurus/types').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/brand/survivors-united-icon-512.png",
      navbar: {
        title: "Survivors United",
        logo: {
          alt: "Survivors United Logo",
          src: "img/brand/survivors-united-icon-128.png",
        },
        items: [
          {
            label: "Minecraft",
            position: "left",
            to: "/docs/minecraft/installation",
          },
          {
            label: "Hytale",
            position: "left",
            to: "/docs/hytale/getting-started",
          },
          {
            href: "https://github.com/survivorsunited/survivorsunited.org",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting Started",
                to: "/docs/getting-started",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: process.env.DISCORD_LOBBY,
              },
            ],
          },
          {
            title: "More",
            items: [
              /*
              {
                label: "Blog",
                to: "/blog",
              },
              */
              {
                label: "GitHub",
                href: "https://github.com/survivorsunited/survivorsunited.org",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Survivors United. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
