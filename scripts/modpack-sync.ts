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
 *
 * Usage:
 *   npm run modpack:sync           - Sync only if new release detected
 *   npm run modpack:sync:force     - Force sync regardless of current reference
 *   npm run modpack:sync -- --force-sync - Alternative force option
 */

import { appendFile, readFile, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
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

const README_PATH = path.join(PROJECT_ROOT, "README.md");
const FAQ_PATH = path.join(PROJECT_ROOT, "docs", "minecraft", "faq.md");
const INSTALLATION_PATH = path.join(PROJECT_ROOT, "docs", "minecraft", "mods", "installation.md");
const FABRIC_INSTALLATION_PATH = path.join(PROJECT_ROOT, "docs", "minecraft", "installation", "fabric.md");
const MOD_MANAGER_DOC_PATH = path.join(PROJECT_ROOT, "docs", "tools", "mod-manager.md");
const SUPPORTED_MODS_PATH = path.join(PROJECT_ROOT, "docs", "minecraft", "supported-mods", "index.md");
const ENV_FILE_PATH = path.join(PROJECT_ROOT, ".env");

/**
 * Gets modpack configuration from .env file, environment variables, or defaults.
 * This allows the script to use API URL/repository from .env to determine download URL.
 */
const getModpackConfig = async (): Promise<{ repository: string; apiUrl: string }> => {
  let repository = "survivorsunited/minecraft-mods-manager";
  let apiUrl = `https://api.github.com/repos/${repository}/releases/latest`;
  
  // Read from .env file first
  if (existsSync(ENV_FILE_PATH)) {
    const envContent = await readFile(ENV_FILE_PATH, { encoding: "utf8" });
    const repositoryMatch = envContent.match(/^MODPACK_REPOSITORY=(.*)$/m);
    const apiUrlMatch = envContent.match(/^MODPACK_API_URL=(.*)$/m);
    
    if (repositoryMatch?.[1]) {
      repository = repositoryMatch[1].trim();
    }
    if (apiUrlMatch?.[1]) {
      apiUrl = apiUrlMatch[1].trim();
    } else if (repositoryMatch?.[1]) {
      // If repository is set but API URL isn't, construct it
      apiUrl = `https://api.github.com/repos/${repository}/releases/latest`;
    }
  }
  
  // Override with environment variables if set
  repository = process.env.MODPACK_REPOSITORY || process.env.MODPACK_REPO || repository;
  apiUrl = process.env.MODPACK_API_URL || 
           (process.env.MODPACK_REPOSITORY ? `https://api.github.com/repos/${process.env.MODPACK_REPOSITORY}/releases/latest` : apiUrl);
  
  return { repository, apiUrl };
};

// Will be initialized in main() after reading .env
let MOD_MANAGER_REPOSITORY: string;
let LATEST_RELEASE_URL: string;

/**
 * Fetches the latest release metadata from GitHub.
 * @param apiUrl Optional API URL. If not provided, uses LATEST_RELEASE_URL.
 * @throws Error when the response cannot be parsed or is unsuccessful.
 */
const fetchLatestRelease = async (apiUrl?: string): Promise<ReleaseResponse> => {
  const url = apiUrl || LATEST_RELEASE_URL;
  
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "survivorsunited-modpack-sync",
  };

  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? process.env.GITHUB_PAT;
  if (isNonEmptyString(token)) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
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
 * ALWAYS fetches from API to determine current release - release tag is determined from API when needed.
 */
const determineCurrentReference = async (): Promise<CurrentReference | null> => {
  // Always fetch from API to determine current release - release tag MUST be from API call
  try {
    const release = await fetchLatestRelease();
    const { zipAsset } = selectRelevantAssets(release);
    
    return {
      filename: zipAsset.name,
      downloadUrl: zipAsset.browser_download_url,
    };
  } catch (error) {
    console.log(`Warning: Could not fetch from API to determine current reference: ${error instanceof Error ? error.message : String(error)}`);
    // Fall through to check DOWNLOAD_LINK_MODPACK for backward compatibility
  }
  
  // Fallback: check DOWNLOAD_LINK_MODPACK if API call failed
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

  // Last fallback: check README.md
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
 * Updates the .env file with API-based variables and derived download URL.
 * Stores repository info to determine download URL dynamically from API.
 * Release tag is determined from API call when needed, not stored in .env.
 */
const updateEnvFile = async (
  repository: string,
  releaseTag: string,
  downloadUrl: string,
  apiUrl: string,
): Promise<FileUpdateResult> => {
  const envContent = existsSync(ENV_FILE_PATH)
    ? await readFile(ENV_FILE_PATH, { encoding: "utf8" })
    : "";

  const lines = envContent.length > 0 ? envContent.split(/\r?\n/) : [];
  
  // Variables to update/add
  // Store API URL/repository for dynamic resolution, and DOWNLOAD_LINK_MODPACK for build-time use
  // Release tag is always determined from API call when needed, not stored in .env
  const envVars: Record<string, string> = {
    MODPACK_REPOSITORY: repository,
    MODPACK_API_URL: apiUrl,
    DOWNLOAD_LINK_MODPACK: downloadUrl, // Derived from API - used by Docusaurus build-time preprocessor
  };
  
  // Remove MODPACK_RELEASE_TAG if it exists (no longer needed)
  const processedLines = lines.filter((line) => !line.startsWith("MODPACK_RELEASE_TAG="));
  
  // Track which variables we found
  const foundVars: Set<string> = new Set();
  
  // Update existing variables or mark as found
  const updatedLines = processedLines.map((line) => {
    for (const [key, value] of Object.entries(envVars)) {
      if (line.startsWith(`${key}=`)) {
        foundVars.add(key);
        return `${key}=${value}`;
      }
    }
    return line;
  });
  
  // Add missing variables at the end
  const finalLines = [...updatedLines];
  for (const [key, value] of Object.entries(envVars)) {
    if (!foundVars.has(key)) {
      finalLines.push(`${key}=${value}`);
    }
  }

  const sanitizedLines = finalLines.filter((line, index) => !(line === "" && index === finalLines.length - 1));
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
    // Look for "Mods Table" section - only match the heading, not the header row
    if (line.includes("## Mods Table")) {
      inModsTable = true;
      headerSkipped = false;
      continue;
    }

    if (inModsTable) {
      // Skip the separator row (|---|---|)
      if (line.startsWith("|") && line.includes("---")) {
        continue;
      }
      
      // Process header row to find column indices
      if (line.startsWith("|") && !headerSkipped && (line.includes("| Name |") || (line.includes("Name") && line.includes("ID") && line.includes("Category")))) {
        const headerParts = line.split("|").map((p) => p.trim().toLowerCase());
        categoryColumnIndex = headerParts.findIndex((p) => p.includes("category"));
        typeColumnIndex = headerParts.findIndex((p) => p.includes("type"));
        headerSkipped = true;
        continue;
      }

      if (line.startsWith("|") && headerSkipped) {
        const parts = line.split("|").map((p) => p.trim());
        
        // Extract values by position (Name, ID, Version, Description, Category, Type)
        // parts[0] is empty (before first |), parts[1-6] are data columns, parts[7] is empty (after last |)
        // So we need at least 7 elements to have all 6 data columns
        if (parts.length >= 7) {
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
  // Load config from .env file or environment - this allows us to use API URL from .env
  const config = await getModpackConfig();
  MOD_MANAGER_REPOSITORY = config.repository;
  LATEST_RELEASE_URL = config.apiUrl;
  
  console.log(`Using repository: ${MOD_MANAGER_REPOSITORY}`);
  console.log(`Using API URL: ${LATEST_RELEASE_URL}`);
  
  // Check for force flag via command-line args or environment variable
  // Support both --force-sync flag and FORCE_SYNC env var
  const allArgs = process.argv.slice(2);
  const forceSync = 
    allArgs.includes("--force-sync") || 
    allArgs.includes("--force") || 
    allArgs.includes("-f") ||
    process.argv.some((arg) => arg === "--force-sync" || arg === "--force" || arg === "-f") ||
    process.env.FORCE_SYNC === "true" ||
    process.env.FORCE_SYNC === "1";
  
  if (forceSync) {
    console.log("Force mode enabled - will sync regardless of current reference");
  }

  const release = await fetchLatestRelease();
  const { zipAsset, hashAsset } = selectRelevantAssets(release);

  const currentReference = await determineCurrentReference();
  const shouldSkip =
    !forceSync &&
    currentReference !== null &&
    currentReference.filename === zipAsset.name &&
    currentReference.downloadUrl === zipAsset.browser_download_url;

  if (shouldSkip) {
    await finish(null);
    return;
  }
  
  if (forceSync && currentReference !== null && currentReference.filename === zipAsset.name) {
    console.log("Force mode: Syncing even though release matches current reference");
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
      updateEnvFile(MOD_MANAGER_REPOSITORY, release.tag_name, zipAsset.browser_download_url, LATEST_RELEASE_URL),
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
