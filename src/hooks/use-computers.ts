import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { isComputer, type Computer } from "@/types/Computer";
import type { CommandMessage } from "@/types/ComputerCommand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook to fetch computers from the API.
 * Uses the access token and API URL from the AuthContext.
 */
const useComputers = () => {
  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  const { showMessage } = useToast();

  const queryClient = useQueryClient();

  const commands = useMutation({
    mutationFn: async (messages: CommandMessage[]) => {
      const response = await fetch(`${apiUrl}/computers/commands`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) throw new Error("Failed to send command");
    },
    onSuccess: (_, commands) =>
      showMessage(`${commands.length > 1 ? "Befehle" : "Befehl"} erfolgreich gesendet`),
    onError: (_, commands) =>
      showMessage(
        `Fehler beim Senden ${commands.length > 1 ? "der Befehle" : "des Befehls"}`,
        "error",
      ),
  });

  const update = useMutation({
    mutationFn: async (computers: Computer[]) => {
      const response = await fetch(`${apiUrl}/computers`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(computers),
      });

      if (!response.ok) throw new Error("Failed to update computers");
    },
    onMutate: async (newComputers: Computer[]) => {
      await queryClient.cancelQueries({ queryKey: ["computers"] });
      const previousComputers = queryClient.getQueryData(["computers"]);

      queryClient.setQueryData(["computers"], (old: Computer[]) =>
        old.map((c) => newComputers.find((nc) => nc.computerId === c.computerId) ?? c),
      );

      return { previousComputers };
    },
    onSuccess: () => showMessage("Computer erfolgreich aktualisiert"),
    onError: (_, computers, context) => {
      queryClient.setQueryData(["computers"], context?.previousComputers);
      showMessage(
        `Fehler beim Aktualisieren ${computers.length > 1 ? "der Computer" : "des Computers"}`,
        "error",
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["computers"] }),
  });

  const query = useQuery({
    queryKey: ["computers"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/computers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch computers");

      const data = await response.json();
      if (Array.isArray(data) && data.every(isComputer)) return data;

      throw new Error("Invalid computer data format");
    },
    enabled: !!accessToken && !!apiUrl,
    staleTime: 1000 * 5,
    refetchInterval: 1000 * 10,
    refetchIntervalInBackground: true,
  });

  return { ...query, commands, update };
};

export default useComputers;
