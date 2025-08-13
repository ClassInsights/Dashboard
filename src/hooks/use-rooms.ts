import { useAuth } from "@/contexts/AuthContext";
import { isRoom, type Room } from "@/types/Room";
import { useQuery } from "@tanstack/react-query";

/**
 * Custom hook to fetch rooms from the API.
 * Uses the access token and API URL from the AuthContext.
 */
const useRooms = () => {
  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/rooms`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch rooms");

      const data = await response.json();
      if (Array.isArray(data) && data.every(isRoom)) {
        return data as Room[];
      }

      throw new Error("Invalid room data format");
    },
    enabled: !!accessToken && !!apiUrl,
    staleTime: 1000 * 20,
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: true,
  });
};

export default useRooms;
