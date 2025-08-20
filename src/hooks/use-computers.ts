import { useAuth } from "@/contexts/AuthContext";
import { isComputer } from "@/types/Computer";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch computers from the API.
 * Uses the access token and API URL from the AuthContext.
 */
const useComputers = () => {
  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  return useQuery({
    queryKey: ["computers"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/computers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch computers");

      const data = await response.json();
      if (Array.isArray(data) && data.every(isComputer)) {
        return data.map((computer) => ({
          ...computer,
          macAddress: computer.macAddress.match(/.{1,2}/g)?.join(":") ?? "???",
        }));
      }

      throw new Error("Invalid computer data format");
    },
    enabled: !!accessToken && !!apiUrl,
    staleTime: 1000 * 5,
    refetchInterval: 1000 * 10,
    refetchIntervalInBackground: true,
  });
};

export default useComputers;
