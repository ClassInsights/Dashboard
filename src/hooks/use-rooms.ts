import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { isRoom, type Room } from "@/types/Room";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook to fetch rooms from the API.
 * Uses the access token and API URL from the AuthContext.
 */
const useRooms = () => {
  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  const { showMessage } = useToast();
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: async (room: Room) => {
      const response = await fetch(`${apiUrl}/rooms/${room.roomId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
      });

      if (!response.ok) throw new Error("Failed to update room");
    },
    onMutate: async (newRoom: Room) => {
      await queryClient.cancelQueries({ queryKey: ["rooms"] });
      const previousRooms = queryClient.getQueryData(["rooms"]);

      queryClient.setQueryData(["rooms"], (old: Room[]) =>
        old.map((r) => (r.roomId === newRoom.roomId ? newRoom : r)),
      );

      return { previousRooms };
    },
    onSuccess: () => showMessage("Raum erfolgreich aktualisiert"),
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["rooms"], context?.previousRooms);
      showMessage("Fehler beim Aktualisieren des Raums", "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });

  const query = useQuery({
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

  return { ...query, update };
};

export default useRooms;
