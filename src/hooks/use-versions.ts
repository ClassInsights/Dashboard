import { useAuth } from "@/contexts/AuthContext";
import type { Prettify } from "@/lib/utils";
import { isGitHubLatestResponse } from "@/types/GithubLatestResponse";
import { isLocalApiMeta } from "@/types/LocalApiMeta";
import { isVersionCache, type VersionCache } from "@/types/VersionCache";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type VersionResponse = Prettify<
  VersionCache & {
    isLoading: boolean;
  }
>;

const useVersions = (): VersionResponse | undefined => {
  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  // fetch cached github latest version numbers
  const [cachedVersion, _] = useState<VersionCache | undefined>(() => {
    const version = localStorage.getItem("versionCache");
    if (!version) return;

    const parsed = JSON.parse(version);
    if (!isVersionCache(parsed)) return;

    if (parsed.expiresAt < Date.now()) {
      localStorage.removeItem("versionCache");
      return;
    }

    return parsed;
  });

  const { data: latestApiVersion, isLoading: isLoadingLatestApiVersion } = useQuery({
    queryKey: ["latestApiVersion"],
    queryFn: async () => {
      if (cachedVersion) return cachedVersion.latestApiVersion;

      const response = await fetch(
        "https://api.github.com/repos/classinsights/api/releases/latest",
      );

      if (!response.ok) throw new Error(`Failed to fetch API version, Status: ${response.status}`);

      const data = await response.json();
      if (!isGitHubLatestResponse(data)) throw new Error("Invalid API version data");

      return data.tag_name.replace("v", "");
    },
  });

  const { data: latestDashboardVersion, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["latestDashboardVersion"],
    queryFn: async () => {
      if (cachedVersion) return cachedVersion.latestDashboardVersion;

      const response = await fetch(
        "https://api.github.com/repos/classinsights/dashboard/releases/latest",
      );

      if (!response.ok)
        throw new Error(`Failed to fetch Dashboard version, Status: ${response.status}`);

      const data = await response.json();
      if (!isGitHubLatestResponse(data)) throw new Error("Invalid Dashboard version data");

      return data.tag_name.replace("v", "");
    },
  });

  const { data: currentApi, isLoading: isLoadingCurrentApi } = useQuery({
    queryKey: ["currentApiVersion"],
    queryFn: async () => {
      if (cachedVersion)
        return {
          version: cachedVersion.currentApiVersion,
          platform: cachedVersion.platform,
        };

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok)
        throw new Error(`Failed to fetch current API version, Status: ${response.status}`);

      const data = await response.json();
      if (!isLocalApiMeta(data)) throw new Error("Invalid current API version data");

      return data;
    },
  });

  // Cache the latest versions
  useEffect(() => {
    if (cachedVersion || !latestApiVersion || !latestDashboardVersion || !currentApi) return;

    const newCache: VersionCache = {
      latestApiVersion,
      currentApiVersion: currentApi?.version || "",
      latestDashboardVersion,
      currentDashboardVersion: import.meta.env.PACKAGE_VERSION || "",
      platform: currentApi?.platform || "",
      expiresAt: Date.now() + 1000 * 60 * 30,
    };

    localStorage.setItem("versionCache", JSON.stringify(newCache));
  }, [cachedVersion, latestApiVersion, latestDashboardVersion]);

  if (!latestApiVersion || !latestDashboardVersion || !currentApi) return;

  return {
    latestApiVersion,
    currentApiVersion: currentApi.version,
    latestDashboardVersion,
    currentDashboardVersion:
      cachedVersion?.currentDashboardVersion || import.meta.env.PACKAGE_VERSION,
    platform: currentApi.platform,
    expiresAt: Date.now() + 1000 * 60 * 30,
    isLoading: isLoadingLatestApiVersion || isLoadingDashboard || isLoadingCurrentApi,
  };
};

export default useVersions;
