import { useAuth } from "@/contexts/AuthContext";
import { isConfiguration } from "@/types/Configuration";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch the configuration from the API.
 * Uses the access token and API URL from the AuthContext.
 */
const useConfiguration = () => {
  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  return useQuery({
    queryKey: ["configuration"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/settings/dashboard`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch settings, Status: ${response.status}`);

      const data = await response.json();
      if (isConfiguration(data)) return data;

      throw new Error("Invalid configuration data format");
    },
    enabled: !!accessToken && !!apiUrl,
  });
};

export default useConfiguration;
