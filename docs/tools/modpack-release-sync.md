---
sidebar_position: 2
title: Modpack Release Sync Workflow
description: How the Survivors United site stays aligned with the latest Mod Manager releases.
tags:
  - mods
  - automation
  - devops
---

# Modpack Release Sync Workflow

The Modpack Release Sync pipeline keeps this site aligned with the latest public release published in the [`survivorsunited/minecraft-mods-manager`](https://github.com/survivorsunited/minecraft-mods-manager) repository. This guide explains the automation schedule, what files are updated, and how to validate changes locally.

## Schedule and Triggers

- **Daily**: Runs at 04:00 UTC via GitHub Actions (`modpack-sync.yml`).
- **Manual**: Can be triggered with the "Run workflow" button in GitHub Actions (`workflow_dispatch`).
- **Permissions**: Workflow uses the repository `GITHUB_TOKEN` with `contents:write` and `pull-requests:write` scopes.

## What the Workflow Updates

| Area | Details |
| --- | --- |
| `.env` | Sets `DOWNLOAD_LINK_MODPACK` to the latest release `browser_download_url`. |
| `README.md` | Updates the quick-start download link. |
| `docs/minecraft/faq.md` | Refreshes the filename referenced in the FAQ. |
| `docs/tools/mod-manager.md` | Updates the release snapshot table (filename, download link, hash reference). |
| `docs/minecraft/mods/installation.md` | Keeps the `${DOWNLOAD_LINK_MODPACK}` token in place for dynamic rendering. |

If no new release is detected (matching filename and URL), the workflow exits without committing changes.

## Pull Request Automation

When updates are required, the workflow:

1. Runs `npm run modpack:sync` to apply file changes.
2. Executes `npm run build` to ensure the Docusaurus site compiles.
3. Uses `peter-evans/create-pull-request` to open a PR titled `chore(modpack): sync to <filename>` on branch `automation/modpack-<filename>`.
4. Includes release tag, publish timestamp, and download URL in the PR body.

Maintainers review and merge the PR; downstream deploy workflows publish the updated site.

## Local Testing Checklist

Before merging or when troubleshooting:

1. **Sync metadata**
   ```bash
   npm run modpack:sync
   ```
   - Confirms the script can reach GitHub and updates tracked files when a new release is available.
2. **Inspect changes**
   - `git diff` to verify `.env`, `README.md`, FAQ, and Mod Manager snapshot updates.
3. **Build documentation**
   ```bash
   npm run build
   ```
   - Ensures Docusaurus compiles without referencing removed assets.
4. **Optional**: Run `npm run serve` to preview the generated site locally.

## Troubleshooting

- **Authentication errors**: Configure `gh auth login` locally or ensure `GITHUB_TOKEN` is available in CI.
- **No changes produced**: Confirm the latest release tag differs from the one documented in `README.md` and `.env`.
- **Build failures**: Clear caches with `npm run clear`, then rerun `npm run build` to ensure stale artifacts are removed.
- **Manual rollbacks**: Re-run `npm run modpack:sync` after setting `DOWNLOAD_LINK_MODPACK` to the prior release, then open a corrective PR.

## Related Resources

- [`docs/modpack-release-automation-plan.md`](../modpack-release-automation-plan.md): Detailed implementation plan.
- GitHub Actions workflow: [`.github/workflows/modpack-sync.yml`](../../.github/workflows/modpack-sync.yml)
- Mod Manager overview: [`docs/tools/mod-manager.md`](./mod-manager.md)
