export type VersionCache = {
  latestApiVersion: string;
  currentApiVersion: string;
  latestDashboardVersion: string;
  currentDashboardVersion: string;
  platform: string;
  expiresAt: number;
};

export const isVersionCache = (data: unknown): data is VersionCache =>
  typeof data === "object" &&
  data !== null &&
  "latestApiVersion" in data &&
  typeof data.latestApiVersion === "string" &&
  "currentApiVersion" in data &&
  typeof data.currentApiVersion === "string" &&
  "latestDashboardVersion" in data &&
  typeof data.latestDashboardVersion === "string" &&
  "currentDashboardVersion" in data &&
  typeof data.currentDashboardVersion === "string" &&
  "platform" in data &&
  typeof data.platform === "string" &&
  "expiresAt" in data &&
  typeof data.expiresAt === "number";
