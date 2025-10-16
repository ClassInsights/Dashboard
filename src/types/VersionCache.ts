export type VersionCache = {
  latestApiVersion: Release;
  latestDashboardVersion: Release;
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
  "latestDashboardVersion" in data &&
  isGitHubRelease(data.latestDashboardVersion) &&
  "expiresAt" in data &&
  typeof data.expiresAt === "number";
