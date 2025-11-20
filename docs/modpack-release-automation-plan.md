---
title: Modpack Release Automation Plan
description: Daily workflow plan for syncing modpack releases into the Survivors United documentation site
tags:
  - automation
  - devops
  - documentation
---

# Modpack Release Automation Plan

> **Status**: ✅ **Implementation Complete**  
> This plan has been fully implemented. See the [Modpack Release Sync Workflow](./tools/modpack-release-sync.md) for current documentation, or the [GitHub Actions workflow](.github/workflows/modpack-sync.yml) for the implementation.

This document originally outlined the plan for introducing a daily GitHub Actions workflow that keeps the Survivors United documentation site synchronized with the latest modpack release published in the [`survivorsunited/minecraft-mods-manager`](https://github.com/survivorsunited/minecraft-mods-manager) repository. The workflow runs **daily at 04:00 UTC** and executes the following stages.

## 1. Workflow Trigger and Preconditions

- **Schedule**: `cron: "0 4 * * *"` (daily at 04:00 UTC).
- **Manual Runs**: Enable `workflow_dispatch` for manual re-runs when needed.
- **Permissions**: Grant the workflow `contents: write` and `pull-requests: write` to update documentation and open pull requests.

## 2. Release Discovery

- **Step 2.1 – Fetch releases**: Use the GitHub REST API (`GET /repos/survivorsunited/minecraft-mods-manager/releases/latest`) or `gh release view latest --json tagName,assets` to obtain the most recent release metadata.
- **Step 2.2 – Determine novelty**:
  - Parse the tag name (e.g. `client-mod-all-<hash>-<timestamp>.zip`).
  - Compare against the currently referenced modpack version in this repository by reading:
    - `docs/minecraft/mods/installation.md`
    - `docs/minecraft/faq.md`
    - `README.md`
    - Any future locations recorded in `docs/modpack-release-automation-plan.md` under [Reference Map](#5-reference-map).
  - If the latest release filename matches the existing references, exit successfully without changes.

## 3. Asset Metadata

- **Collect release metadata** when a new tag is detected:
  - Capture the primary ZIP asset name and `browser_download_url`.
  - Capture optional checksum assets (e.g. `.sha256`, `.sha512`, `.hash.txt`).
- **Validation**:
  - Ensure at least one ZIP asset is present.
  - Warn (but do not fail) when checksum assets are missing.
  - Abort with failure if the release response cannot be parsed.

## 4. Repository Update Procedure

- **Step 4.1 – Metadata application**:
  - Run `npm run modpack:sync` to update tracked files using the release metadata.
  - Set `DOWNLOAD_LINK_MODPACK` in `.env` to the release `browser_download_url`.
- **Step 4.2 – Documentation refresh**:
  - Replace modpack references in the following files with the new filename and download URL:
    - `docs/minecraft/mods/installation.md`
    - `docs/minecraft/faq.md`
    - `README.md`
    - `docs/tools/mod-manager.md`
  - Update hash references to point at release-hosted checksum assets when available.
- **Step 4.3 – Reference map maintenance**:
  - Record the release filename in `docs/tools/mod-manager.md`.
  - Optionally append release notes to a changelog section for historical tracking.
- **Step 4.4 – Formatting**: Run `npm run fmt` or `npm run lint` if available to maintain consistency.

## 5. Reference Map

Maintain this list to track all locations that reference the modpack filename:

| File | Purpose |
| --- | --- |
| `README.md` | Quick-start instructions for new players |
| `docs/minecraft/mods/installation.md` | Core installation guide |
| `docs/minecraft/faq.md` | FAQ entry directing players to the download |
| `docs/tools/mod-manager.md` | Overview page describing the Mod Manager and latest release |

## 6. Compliance and Quality Gates

- **Unit/Integration tests**: Run `npm run build` to ensure docs compile successfully.
- **Link validation**: Execute existing link check workflows (if present) or add a `linkinator`/`docusaurus check` step.
- **Workflow exit**: Fail the job if any validation step fails, preventing partial updates.

## 7. Change Delivery Strategy

- **Branching**: Create a dedicated branch per update, e.g. `automation/update-modpack-<tag>`.
- **Commit**: Use conventional commits, referencing the automation issue (e.g. `feat(modpack): sync to <tag>`).
- **Pull request**: Open an auto-generated PR summarizing:
  - New release tag and publication date.
  - Primary asset filename and download URL.
  - Any checksum asset links or validation notes.
- **Review & Merge**: Assign to maintainers; allow auto-merge once checks pass.
- **Issue Automation**: Auto-close the tracking issue when the PR merges.

## 8. Notifications and Observability

- **Slack/Discord webhooks**: Notify the Survivors United Discord of new releases using a bot token stored as a secret (`DISCORD_WEBHOOK_URL`).
- **GitHub issue updates**: Post a comment in the PR with checksum verification and significant changes.
- **Metrics**: Log workflow duration and success/failure counts to GitHub Actions summary for monitoring.

## 9. Rollback and Remediation

- **Rollback triggers**: Failed validation, build errors, or community reports of modpack issues.
- **Action**:
  - Revert the PR via GitHub UI or `gh pr merge --rebase --delete-branch` for rollback commits.
  - Re-run `npm run modpack:sync` with the prior release tag if manual intervention is required.
- **Communication**: Alert the community via Discord and update the mod manager page with status notes.

## 10. Future Enhancements

- Automate changelog extraction from mod manager release notes into the documentation page.
- Add regression tests to validate mod list diffs between releases.
- Track download counts via GitHub API for analytics.

---

**Owner**: Platform Engineering

**Last Updated**: 2025-11-12
