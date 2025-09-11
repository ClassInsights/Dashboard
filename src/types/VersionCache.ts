export type VersionCache = {
  latestApiVersion: Release;
  currentApiVersion: string;
  latestDashboardVersion: Release;
  currentDashboardVersion: string;
  platform: string;
  expiresAt: number;
};

export type Release = {
  version: string;
  changelog: string | null;
};

export const isGitHubRelease = (data: unknown): data is Release =>
  typeof data === "object" &&
  data !== null &&
  "version" in data &&
  typeof data.version === "string" &&
  "changelog" in data &&
  (typeof data.changelog === "string" || data.changelog === null);

export const isVersionCache = (data: unknown): data is VersionCache =>
  typeof data === "object" &&
  data !== null &&
  "latestApiVersion" in data &&
  isGitHubRelease(data.latestApiVersion) &&
  "currentApiVersion" in data &&
  typeof data.currentApiVersion === "string" &&
  "latestDashboardVersion" in data &&
  isGitHubRelease(data.latestDashboardVersion) &&
  "currentDashboardVersion" in data &&
  typeof data.currentDashboardVersion === "string" &&
  "platform" in data &&
  typeof data.platform === "string" &&
  "expiresAt" in data &&
  typeof data.expiresAt === "number";
