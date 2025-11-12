---
sidebar_position: 3
title: Survivors United Mod Manager
description: Overview of the Survivors United Mod Manager and how this site stays in sync with its releases
tags:
  - mods
  - tooling
  - automation
---

# Survivors United Mod Manager

The Survivors United Mod Manager streamlines distribution of the curated modpack that powers our community server. This site consumes the public releases published in the [`survivorsunited/minecraft-mods-manager`](https://github.com/survivorsunited/minecraft-mods-manager) repository and keeps installation instructions up to date.

## Why We Use the Mod Manager

- **Consistent releases**: Every release bundles the exact set of mods validated for the Survivors United server.
- **Integrity checked**: Each asset ships with MD5, SHA1, SHA256, and SHA512 hashes so players can verify downloads.
- **Documentation ready**: Release assets include installation notes and configuration presets used throughout this site.
- **Automated updates**: A scheduled workflow (see `Modpack Release Automation Plan`) checks for new releases daily and refreshes documentation automatically.

## Latest Release Snapshot

| Item | Details |
| --- | --- |
| Release Repository | [`survivorsunited/minecraft-mods-manager`](https://github.com/survivorsunited/minecraft-mods-manager/releases) |
| Latest Filename | `modpack-1.21.8.zip` |
| Direct Download | [modpack-1.21.8.zip](https://github.com/survivorsunited/minecraft-mods-manager/releases/download/release-2025.11.06-031732/modpack-1.21.8.zip) |
| Hash Summary | Refer to release assets for checksum files |

## Release Lifecycle

1. A new release is published in the Mod Manager repository.
2. Our automation pipeline downloads the release assets at 04:00 UTC, verifies hashes, and stages documentation updates.
3. Installation guides, FAQs, and this overview page receive the new filename and metadata.
4. The site is rebuilt and deployed once validation passes.

## Contributing to the Mod Manager

We welcome contributions to the Mod Manager project:

- Review the open issues and roadmap at the GitHub repository.
- Submit pull requests that follow the repository's contribution guidelines.
- Join the Survivors United Discord to collaborate with the engineering team.

## Support

If you encounter issues with a release:

- Create an issue in the Mod Manager repository with logs and reproduction steps.
- Report urgent problems in the Survivors United Discord support channel.
- Check this site for status updates or rollback notices.
