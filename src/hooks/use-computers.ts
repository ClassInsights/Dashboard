import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { isComputer } from "@/types/Computer";
import type { CommandMessage } from "@/types/ComputerCommand";
import { useMutation, useQuery } from "@tanstack/react-query";

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
    onSuccess: () => showMessage("Befehl erfolgreich gesendet"),
    onError: () => showMessage("Fehler beim Senden des Befehls", "error"),
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

  return { ...query, commands };
};

export default useComputers;
