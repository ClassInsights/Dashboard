import { useAuth } from "@/contexts/AuthContext";
import { isADCredentials } from "@/types/ADCredentials";
import { useQuery } from "@tanstack/react-query";

/** Custom hook to handle Active Directory organization units */
const useActiveDirectory = () => {
  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  const query = useQuery({
    queryKey: ["activeDirectoryUser"],
    queryFn: async () => {
      const now = Date.now();

      const response = await fetch(`${apiUrl}/ad/credentials`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch AD user, Status: ${response.status}`);

      const data = await response.json();
      if (!isADCredentials(data)) throw new Error("Invalid AD user data format");

      const diff = Date.now() - now;
      if (diff < 500) await new Promise((resolve) => setTimeout(resolve, 500 - diff));

      return data;
    },
    enabled: !!accessToken && !!apiUrl,
    staleTime: 1000 * 30,
  });

  const units = useQuery({
    queryKey: ["activeDirectoryUnits"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/ad/units`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch AD units, Status: ${response.status}`);

      const data = await response.json();
      if (Array.isArray(data) && data.every((unit) => typeof unit === "string")) return data;

      throw new Error("Invalid AD units data format");
    },
    enabled: query.isSuccess && !!accessToken && !!apiUrl,
    staleTime: 1000 * 20,
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: true,
  });

  return { ...query, isADLoading: query.isLoading || units.isLoading, units: units.data || [] };
};

export default useActiveDirectory;
