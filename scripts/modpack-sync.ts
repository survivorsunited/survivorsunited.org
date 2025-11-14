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
const MOD_MANAGER_DOC_PATH = path.join(PROJECT_ROOT, "docs", "tools", "mod-manager.md");
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

  const [readmeResult, faqResult, modManagerResult, installationResult, envResult] = await Promise.all([
    updateReadme(zipAsset.name, zipAsset.browser_download_url),
    updateFaq(zipAsset.name),
    updateModManagerDoc(zipAsset.name, zipAsset.browser_download_url, hashAsset),
    updateInstallationDoc(),
    updateEnvFile(zipAsset.browser_download_url),
  ]);

  const updates = [readmeResult, faqResult, modManagerResult, installationResult, envResult];
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
