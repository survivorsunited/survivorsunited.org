# Survivors United

A supportive Minecraft survival community website built with Docusaurus and deployed on GitHub Pages.

## About

Survivors United is a compassionate Minecraft survival community where players work together to survive and thrive. Our website provides resources, community guidelines, server information, and a platform for connection and collaboration.

## Features

- **Minecraft Setup Guide**: Complete step-by-step guide for setting up Minecraft with Fabric and mods
- **Server Information**: Details about our survival server, rules, and features
- **Community Farms**: Documentation of shared infrastructure and farms
- **Supported Mods**: Complete list of mods with descriptions and categories
- **FAQ & Troubleshooting**: Common questions and solutions
- **Community Guidelines**: Clear guidelines for safe and supportive interactions
- **Blog**: Community updates and educational content
- **Responsive Design**: Works beautifully on all devices
- **GitHub Pages Deployment**: Automatic deployment from main branch
- **Environment Variables**: Dynamic configuration using dotenv and markdown preprocessing

## Tech Stack

- **Framework**: Docusaurus 3.1.1
- **Language**: TypeScript
- **Styling**: CSS Modules + Custom CSS
- **Deployment**: GitHub Pages with GitHub Actions
- **Node.js**: Version 18+
- **Environment Variables**: dotenv for configuration management

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/survivorsunited/survivorsunited.org.git
   cd survivorsunited.org
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   Create a `.env` file in the root directory:
   ```bash
   DISCORD_LOBBY=https://discord.gg/your-invite-code
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

The website supports dynamic configuration using environment variables:

- **DISCORD_LOBBY**: Discord server invite link (defaults to `https://discord.gg/kwdaEmmv`)

You can use `${DISCORD_LOBBY}` in any markdown file and it will be automatically replaced with the environment variable value during build time.

### Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the site for production
- `npm run watch` - Start the development server in watch mode
- `npm run swizzle` - Swizzle Docusaurus components
- `npm run deploy` - Deploy to GitHub Pages
- `npm run clear` - Clear the build cache
- `npm run serve` - Serve the built site locally
- `npm run write-translations` - Write translation files
- `npm run write-heading-ids` - Add heading IDs to markdown files
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
survivorsunited.org/
├── .github/workflows/     # GitHub Actions for deployment
├── blog/                  # Blog posts
├── docs/                  # Documentation pages
│   ├── minecraft/         # Minecraft-specific documentation
│   │   ├── getting-started.md
│   │   ├── server-info.md
│   │   ├── community-farms.md
│   │   ├── supported-mods.md
│   │   ├── faq.md
│   │   └── terminology.md
│   └── community/         # Community documentation
├── src/
│   ├── components/        # React components
│   ├── css/              # Global styles
│   └── pages/            # Custom pages
├── static/               # Static assets (images, etc.)
│   └── img/
│       └── minecraft/    # Minecraft-related images
├── docusaurus.config.js  # Docusaurus configuration
├── sidebars.js          # Documentation sidebar
└── package.json         # Dependencies and scripts
```

## Documentation

Our documentation is organized into several sections:

### Community Documentation
- **Getting Started**: Introduction and community guidelines
- **Installation**: How to join our community platforms
- **Configuration**: Customizing your community experience

### Minecraft Documentation
- **Getting Started**: Complete Minecraft + mods setup guide
- **Server Information**: Server details, rules, and features
- **Community Farms**: Shared infrastructure and farm locations
- **Supported Mods**: Complete mod list with descriptions
- **FAQ**: Common questions and troubleshooting
- **Terminology**: Glossary of Minecraft and mod terms

## Minecraft Server

### Server Details
- **Server Name**: SurvivorsUnited
- **Server Address**: `server.survivorsunited.org`
- **Game Mode**: Survival
- **Version**: Minecraft 1.21.5 with Fabric mods

### Community Features
- **Shared Farms**: Iron, gold, XP, and other resource farms
- **Land Claims**: Protect your builds with Open Parties and Claims
- **Community Events**: Regular build days and events
- **Discord Integration**: Voice and text chat channels

## Blog

The blog section features:
- Community updates and announcements
- Minecraft tips and tutorials
- Member spotlights and stories
- Event announcements and recaps
- Farm guides and building tutorials

## Deployment

This site is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. **Trigger**: Push to main branch or manual workflow dispatch
2. **Build**: Install dependencies and build the site
3. **Deploy**: Upload to GitHub Pages

### Manual Deployment

To deploy manually:

```bash
npm run build
npm run deploy
```

## Contributing

We welcome contributions from community members! Here's how to contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test locally**
   ```bash
   npm start
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Contribution Guidelines

- Follow our community guidelines
- Test your changes locally before submitting
- Use clear commit messages
- Update documentation as needed
- Be respectful and supportive

## Community Guidelines

Our community is built on principles of:

- **Compassion**: Treat everyone with kindness and understanding
- **Respect**: Honor each person's unique journey and experiences
- **Safety**: Maintain safe, moderated spaces for all members
- **Inclusivity**: Welcome survivors from all backgrounds
- **Confidentiality**: Protect community members' privacy
- **Cooperation**: Work together to survive and thrive

## Support

If you need help:

- **Technical Issues**: Open an issue on GitHub
- **Minecraft Questions**: Check our FAQ or ask in Discord
- **Community Questions**: Check our documentation or contact moderators
- **Crisis Support**: Use appropriate crisis resources (988, 911, etc.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Deployed on [GitHub Pages](https://pages.github.com/)
- Community-driven development and support
- Minecraft community contributions

---

**Remember**: You are strong, you are worthy, and you are not alone. Together we survive! 💜