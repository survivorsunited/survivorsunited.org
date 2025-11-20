/**
 * @file Synchronizes the repository with the latest modpack release.
 *
 * The script performs the following operations:
 * 1. Fetches the latest release metadata from the mod manager repository.
 * 2. Determines whether an update is required by comparing against the currently
 *    referenced modpack filename in this repository.
 * 3. Updates documentation and environment variables to reference the latest release
 *    download URLs and filenames.
 * 4. Reports actionable outputs back to GitHub Actions via the GITHUB_OUTPUT file.
 */

import { appendFile, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/**
 * Represents a release asset returned by the GitHub Releases API.
 */
interface ReleaseAsset {
  readonly name: string;
  readonly browser_download_url: string;
  readonly size: number;
  readonly content_type: string;
}

/**
 * Subset of the GitHub Releases API response that we require for automation.
 */
interface ReleaseResponse {
  readonly tag_name: string;
  readonly name: string | null;
  readonly published_at: string;
  readonly assets: ReadonlyArray<ReleaseAsset>;
}

/**
 * Aggregated metadata describing the release we synchronized to.
 */
interface ReleaseSummary {
  readonly releaseTag: string;
  readonly releaseName: string;
  readonly assetName: string;
  readonly publishedAt: string;
  readonly downloadUrl: string;
}

/**
 * Container describing selected release assets.
 */
interface SelectedAssets {
  readonly zipAsset: ReleaseAsset;
  readonly hashAsset: ReleaseAsset | null;
}

/**
 * Describes the outcome of a file update operation.
 */
interface FileUpdateResult {
  readonly filePath: string;
  readonly updated: boolean;
}

/**
 * Type guard ensuring a value is a non-empty string.
 */
const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

/**
 * Represents the current modpack reference stored in the repository.
 */
interface CurrentReference {
  readonly filename: string;
  readonly downloadUrl: string | null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

const MOD_MANAGER_REPOSITORY = "survivorsunited/minecraft-mods-manager";
const LATEST_RELEASE_URL = `https://api.github.com/repos/${MOD_MANAGER_REPOSITORY}/releases/latest`;

const README_PATH = path.join(PROJECT_ROOT, "README.md");
const FAQ_PATH = path.join(PROJECT_ROOT, "docs", "minecraft", "faq.md");
const INSTALLATION_PATH = path.join(PROJECT_ROOT, "docs", "minecraft", "mods", "installation.md");
const FABRIC_INSTALLATION_PATH = path.join(PROJECT_ROOT, "docs", "minecraft", "installation", "fabric.md");
const MOD_MANAGER_DOC_PATH = path.join(PROJECT_ROOT, "docs", "tools", "mod-manager.md");
const SUPPORTED_MODS_PATH = path.join(PROJECT_ROOT, "docs", "minecraft", "supported-mods", "index.md");
const ENV_FILE_PATH = path.join(PROJECT_ROOT, ".env");

/**
 * Fetches the latest release metadata from GitHub.
 * @throws Error when the response cannot be parsed or is unsuccessful.
 */
const fetchLatestRelease = async (): Promise<ReleaseResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "survivorsunited-modpack-sync",
  };

  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? process.env.GITHUB_PAT;
  if (isNonEmptyString(token)) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(LATEST_RELEASE_URL, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch latest release: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as ReleaseResponse;

  if (!Array.isArray(payload.assets) || payload.assets.length === 0) {
    throw new Error("Latest release does not contain any assets to download.");
  }

  return payload;
};

/**
 * Determines the currently referenced modpack filename by inspecting tracked files.
 */
const determineCurrentReference = async (): Promise<CurrentReference | null> => {
  if (existsSync(ENV_FILE_PATH)) {
    const envFile = await readFile(ENV_FILE_PATH, { encoding: "utf8" });
    const envMatch = envFile.match(/^DOWNLOAD_LINK_MODPACK=(.*)$/m);
    if (envMatch) {
      const currentUrl = envMatch[1].trim();
      const currentCandidate = path.basename(currentUrl);
      if (isNonEmptyString(currentCandidate)) {
        return { filename: currentCandidate, downloadUrl: currentUrl };
      }
    }
  }

  if (existsSync(README_PATH)) {
    const readmeContent = await readFile(README_PATH, { encoding: "utf8" });
    const readmeMatch = readmeContent.match(/\[Download ([^\]]+\.zip)\]\(([^\)]+)\)/);
    if (readmeMatch) {
      return {
        filename: readmeMatch[1],
        downloadUrl: readmeMatch[2],
      };
    }
  }

  return null;
};

/**
 * Extracts the primary ZIP asset and its accompanying checksum assets.
 * @throws Error when the primary ZIP asset cannot be located.
 */
const selectRelevantAssets = (release: ReleaseResponse): SelectedAssets => {
  const zipAsset = release.assets.find((asset) => asset.name.endsWith(".zip"));

  if (!zipAsset) {
    throw new Error("Unable to find a ZIP asset in the latest release.");
  }

  const hashAsset = release.assets.find((asset) => {
    const lowered = asset.name.toLowerCase();
    return lowered.includes("hash") || lowered.endsWith(".sha256") || lowered.endsWith(".sha512") || lowered.endsWith(".sha1") || lowered.endsWith(".md5");
  });

  return {
    zipAsset,
    hashAsset: hashAsset ?? null,
  };
};

/**
 * Writes new content to a file when the content has changed.
 */
const writeIfChanged = async (filePath: string, nextContent: string): Promise<FileUpdateResult> => {
  const existingContent = existsSync(filePath)
    ? await readFile(filePath, { encoding: "utf8" })
    : "";

  if (existingContent === nextContent) {
    return { filePath, updated: false };
  }

  await writeFile(filePath, nextContent, { encoding: "utf8" });
  return { filePath, updated: true };
};

/**
 * Updates the README download link to reference the new asset filename.
 */
const updateReadme = async (assetName: string, downloadUrl: string): Promise<FileUpdateResult> => {
  const readmeContent = await readFile(README_PATH, { encoding: "utf8" });
  const updatedContent = readmeContent.replace(
    /\[Download [^\]]+\.zip\]\([^\)]+\)/,
    `[Download ${assetName}](${downloadUrl})`
  );

  return writeIfChanged(README_PATH, updatedContent);
};

/**
 * Updates the FAQ instructions directing users to the latest ZIP filename.
 */
const updateFaq = async (assetName: string): Promise<FileUpdateResult> => {
  const faqContent = await readFile(FAQ_PATH, { encoding: "utf8" });
  const replacedContent = faqContent.replace(
    /`[A-Za-z0-9._-]+\.zip`/,
    `\`${assetName}\``
  );

  return writeIfChanged(FAQ_PATH, replacedContent);
};

/**
 * Updates the Mod Manager overview page with the latest metadata.
 */
const updateModManagerDoc = async (
  assetName: string,
  downloadUrl: string,
  hashAsset: ReleaseAsset | null,
): Promise<FileUpdateResult> => {
  const documentContent = await readFile(MOD_MANAGER_DOC_PATH, { encoding: "utf8" });
  const hashCell = hashAsset
    ? `[${hashAsset.name}](${hashAsset.browser_download_url})`
    : "Refer to release assets for checksum files";

  const transformed = documentContent
    .replace(/\| Latest Filename \| `[^`]+` \|/, `| Latest Filename | \`${assetName}\` |`)
    .replace(
      /\| Direct Download \| \[[^\]]+\]\([^\)]+\) \|/,
      `| Direct Download | [${assetName}](${downloadUrl}) |`
    )
    .replace(
      /\| Hash Summary \| [^|]+ \|/,
      `| Hash Summary | ${hashCell} |`
    );

  return writeIfChanged(MOD_MANAGER_DOC_PATH, transformed);
};

/**
 * Ensures the installation guide points to the reusable environment token.
 */
const updateInstallationDoc = async (): Promise<FileUpdateResult> => {
  const installationContent = await readFile(INSTALLATION_PATH, { encoding: "utf8" });
  const modpackLinkPattern = /\[[^\]]+\]\(\$\{DOWNLOAD_LINK_MODPACK\}\)/;

  if (modpackLinkPattern.test(installationContent)) {
    return { filePath: INSTALLATION_PATH, updated: false };
  }

  const updatedContent = installationContent.replace(
    /\[[^\]]+\]\([^\)]+client-mod-all[^\)]+\)/,
    `[modpack.zip](\${DOWNLOAD_LINK_MODPACK})`
  );

  return writeIfChanged(INSTALLATION_PATH, updatedContent);
};

/**
 * Rewrites or appends the DOWNLOAD_LINK_MODPACK entry in the .env file.
 */
const updateEnvFile = async (downloadUrl: string): Promise<FileUpdateResult> => {
  const envContent = existsSync(ENV_FILE_PATH)
    ? await readFile(ENV_FILE_PATH, { encoding: "utf8" })
    : "";

  const lines = envContent.length > 0 ? envContent.split(/\r?\n/) : [];
  let found = false;
  const processedLines = lines.map((line) => {
    if (line.startsWith("DOWNLOAD_LINK_MODPACK=")) {
      found = true;
      return `DOWNLOAD_LINK_MODPACK=${downloadUrl}`;
    }
    return line;
  });

  if (!found) {
    processedLines.push(`DOWNLOAD_LINK_MODPACK=${downloadUrl}`);
  }

  const sanitizedLines = processedLines.filter((line, index) => !(line === "" && index === processedLines.length - 1));
  const nextContent = `${sanitizedLines.join("\n")}\n`;
  return writeIfChanged(ENV_FILE_PATH, nextContent);
};

/**
 * Downloads README.md directly from release assets.
 */
const downloadReadmeFromRelease = async (release: ReleaseResponse): Promise<string | null> => {
  const readmeAsset = release.assets.find((asset) => asset.name === "README.md");

  if (!readmeAsset) {
    return null;
  }

  const headers: Record<string, string> = {
    Accept: "text/markdown",
    "User-Agent": "survivorsunited-modpack-sync",
  };

  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? process.env.GITHUB_PAT;
  if (isNonEmptyString(token)) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(readmeAsset.browser_download_url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to download README.md: ${response.status} ${response.statusText}`);
  }

  return await response.text();
};

/**
 * Parses mod information from the README content.
 */
interface ModInfo {
  readonly name: string;
  readonly id: string;
  readonly version: string;
  readonly description: string;
  readonly category: string;
}

/**
 * Category icon mapping (can be configured later)
 */
const CATEGORY_ICONS: Record<string, string> = {
  "Core & Utility": "",
  "World & Exploration": "",
  "Multiplayer & Server": "",
  "Infrastructure": "",
  "Recycling": "",
  "Inventory Enhancements": "",
  "Performance": "",
  "Shaders": "",
  "Storage": "",
  "Protection": "",
  "Admin": "",
  "Miscellaneous": "",
};

const parseModListFromReadme = (readmeContent: string): ModInfo[] => {
  const mods: ModInfo[] = [];
  const lines = readmeContent.split(/\r?\n/);

  let inModsTable = false;
  let headerSkipped = false;
  let categoryColumnIndex = -1;
  let typeColumnIndex = -1;

  for (const line of lines) {
    // Look for "Mods Table" section
    if (line.includes("## Mods Table") || (line.includes("| Name |") && line.includes("| ID |") && line.includes("| Category |"))) {
      inModsTable = true;
      headerSkipped = false;
      
      // Find column indices from header
      if (line.includes("|")) {
        const headerParts = line.split("|").map((p) => p.trim().toLowerCase());
        categoryColumnIndex = headerParts.findIndex((p) => p.includes("category"));
        typeColumnIndex = headerParts.findIndex((p) => p.includes("type"));
      }
      continue;
    }

    if (inModsTable) {
      // Skip the separator row (|---|---|)
      if (line.startsWith("|") && line.includes("---")) {
        continue;
      }
      
      // Process header row to find column indices
      if (line.startsWith("|") && !headerSkipped && (line.includes("Name") || line.includes("ID"))) {
        const headerParts = line.split("|").map((p) => p.trim().toLowerCase());
        categoryColumnIndex = headerParts.findIndex((p) => p.includes("category"));
        typeColumnIndex = headerParts.findIndex((p) => p.includes("type"));
        headerSkipped = true;
        continue;
      }

      if (line.startsWith("|") && headerSkipped) {
        const parts = line.split("|").map((p) => p.trim());
        
        // Extract values by position (Name, ID, Version, Description, Category, Type)
        if (parts.length >= 6) {
          const name = parts[1] || "";
          const id = parts[2] || "";
          const version = parts[3] || "";
          const description = parts[4] || "";
          const category = parts[5] || "Miscellaneous";
          const type = parts[6] || "";
          
          // Only include Mandatory mods
          if (type.toLowerCase() === "mandatory" && name.length > 0) {
            mods.push({
              name: name,
              id: id,
              version: version,
              description: description,
              category: category,
            });
          }
        }
      }

      // Stop at next section
      if (line.startsWith("##") && !line.includes("Mods Table")) {
        break;
      }
    }
  }

  return mods;
};

/**
 * Groups mods by category and generates formatted sections.
 */
const groupModsByCategory = (mods: ModInfo[]): Map<string, ModInfo[]> => {
  const grouped = new Map<string, ModInfo[]>();
  
  for (const mod of mods) {
    const category = mod.category || "Miscellaneous";
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(mod);
  }
  
  return grouped;
};

/**
 * Updates the supported mods documentation with the mod list from the README.
 */
const updateSupportedModsDoc = async (mods: ModInfo[], downloadUrl: string): Promise<FileUpdateResult> => {
  if (mods.length === 0) {
    return { filePath: SUPPORTED_MODS_PATH, updated: false };
  }

  const existingContent = existsSync(SUPPORTED_MODS_PATH)
    ? await readFile(SUPPORTED_MODS_PATH, { encoding: "utf8" })
    : `---
sidebar_position: 1
title: Supported Mods
description: Complete list of mods supported on the Survivors United server
---

# Supported Mods

This setup supports a curated collection of Fabric-compatible mods. These mods enhance gameplay, improve performance, support anti-cheat enforcement, and add helpful features for exploration, inventory, multiplayer, and server stability.

## Mandatory Mods

This list is automatically synchronized from the latest modpack release. All mods listed here are required to connect to the Survivors United server.

> **Note:** This list is automatically updated from the latest modpack release. For the complete list with all details including licenses, homepages, and contact information, see the [modpack README](https://github.com/survivorsunited/minecraft-mods-manager/releases/latest).

---

For more information about mod categories, features, updates, and troubleshooting, see the [About Supported Mods](./about) page.
`;

  const groupedMods = groupModsByCategory(mods);

  // Category order (can be configured)
  const categoryOrder = [
    "Core & Utility",
    "World & Exploration",
    "Multiplayer & Server",
    "Infrastructure",
    "Recycling",
    "Inventory Enhancements",
    "Performance",
    "Shaders",
    "Storage",
    "Protection",
    "Admin",
    "Miscellaneous",
  ];

  // Generate sections for each category
  const categorySections: string[] = [];
  
  for (const category of categoryOrder) {
    const categoryMods = groupedMods.get(category);
    if (categoryMods && categoryMods.length > 0) {
      const icon = CATEGORY_ICONS[category] || "";
      const sectionTitle = icon ? `## ${icon} ${category}` : `## ${category}`;
      
      const modList = categoryMods
        .map((mod) => {
          return `- **${mod.name}** – ${mod.version} – ${mod.description}`;
        })
        .join("\n");
      
      categorySections.push(`${sectionTitle}\n\n${modList}\n`);
    }
  }

  // Add any remaining categories not in the order list
  for (const [category, categoryMods] of groupedMods.entries()) {
    if (!categoryOrder.includes(category)) {
      const sectionTitle = `## ${category}`;
      const modList = categoryMods
        .map((mod) => {
          return `- **${mod.name}** – ${mod.version} – ${mod.description}`;
        })
        .join("\n");
      
      categorySections.push(`${sectionTitle}\n\n${modList}\n`);
    }
  }

  const modsSection = `## Mandatory Mods

This list is automatically synchronized from the latest modpack release. All mods listed here are required to connect to the Survivors United server.

${categorySections.join("\n")}

> **Note:** This list is automatically updated from the latest modpack release. For the complete list with all details including licenses, homepages, and contact information, see the [modpack README](${downloadUrl}).

`;

  // Replace the mods section (everything from "## Mandatory Mods" to the "---" separator or end)
  let updatedContent: string;
  if (existingContent.includes("## Mandatory Mods")) {
    // Replace from "## Mandatory Mods" to the "---" separator or end of file
    updatedContent = existingContent.replace(
      /## Mandatory Mods[\s\S]*?(?=---|$)/,
      modsSection
    );
  } else {
    // If the section doesn't exist, insert it before the "---" separator or at the end
    if (existingContent.includes("---")) {
      updatedContent = existingContent.replace(
        /(---)/,
        `${modsSection}\n$1`
      );
    } else {
      updatedContent = `${existingContent}\n\n${modsSection}`;
    }
  }

  return writeIfChanged(SUPPORTED_MODS_PATH, updatedContent);
};

/**
 * Persists GitHub Actions outputs to the GITHUB_OUTPUT file when available.
 */
const writeActionOutput = async (entries: Record<string, string>): Promise<void> => {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!isNonEmptyString(outputFile)) {
    return;
  }

  const formatted = Object.entries(entries)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  await appendFile(outputFile, `${formatted}\n`);
};

/**
 * Exits the script gracefully, recording outputs when necessary.
 */
const finish = async (summary: ReleaseSummary | null): Promise<void> => {
  if (!summary) {
    await writeActionOutput({ should_update: "false" });
    console.log("No new modpack release detected. No changes were written.");
    return;
  }

  await writeActionOutput({
    should_update: "true",
    release_tag: summary.releaseTag,
    release_name: summary.releaseName,
    asset_name: summary.assetName,
    published_at: summary.publishedAt,
    download_url: summary.downloadUrl,
  });

  console.log(`Updated repository to release ${summary.assetName} (tag ${summary.releaseTag}).`);
};

const main = async (): Promise<void> => {
  const release = await fetchLatestRelease();
  const { zipAsset, hashAsset } = selectRelevantAssets(release);

  const currentReference = await determineCurrentReference();
  const shouldSkip =
    currentReference !== null &&
    currentReference.filename === zipAsset.name &&
    currentReference.downloadUrl === zipAsset.browser_download_url;

  if (shouldSkip) {
    await finish(null);
    return;
  }

  console.log(`Detected new modpack asset: ${zipAsset.name}`);
  console.log(`Using remote download URL: ${zipAsset.browser_download_url}`);

  console.log("Downloading README.md from release assets...");
  const readmeContent = await downloadReadmeFromRelease(release);

  let supportedModsResult: FileUpdateResult = { filePath: SUPPORTED_MODS_PATH, updated: false };

  if (readmeContent) {
    console.log("Parsing mod list from README...");
    const mods = parseModListFromReadme(readmeContent);
    console.log(`Found ${mods.length} mandatory mods in README`);

    if (mods.length > 0) {
      supportedModsResult = await updateSupportedModsDoc(mods, zipAsset.browser_download_url);
    }
  } else {
    console.log("Warning: README.md not found in release assets");
  }

    const [readmeResult, faqResult, modManagerResult, installationResult, envResult] = await Promise.all([
      updateReadme(zipAsset.name, zipAsset.browser_download_url),
      updateFaq(zipAsset.name),
      updateModManagerDoc(zipAsset.name, zipAsset.browser_download_url, hashAsset),
      updateInstallationDoc(),
      updateEnvFile(zipAsset.browser_download_url),
    ]);

    const updates = [readmeResult, faqResult, modManagerResult, installationResult, envResult, supportedModsResult];
    updates.forEach((result) => {
      if (result.updated) {
        console.log(`Updated ${path.relative(PROJECT_ROOT, result.filePath)}`);
      }
    });

  const summary: ReleaseSummary = {
    releaseTag: release.tag_name,
    releaseName: release.name ?? release.tag_name,
    assetName: zipAsset.name,
    publishedAt: release.published_at,
    downloadUrl: zipAsset.browser_download_url,
  };

  await finish(summary);
};

void main().catch(async (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error.";
  console.error(`Modpack synchronization failed: ${message}`);
  await writeActionOutput({ should_update: "false" });
  process.exitCode = 1;
});
