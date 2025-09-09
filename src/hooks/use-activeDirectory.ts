import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { isADCredentials, type ADCredentials } from "@/types/ADCredentials";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** Custom hook to handle Active Directory organization units */
const useActiveDirectory = () => {
  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  const { showMessage } = useToast();

  const queryClient = useQueryClient();

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

  const adCredentials = useMutation({
    mutationFn: async (data: ADCredentials) => {
      const now = Date.now();
      const response = await fetch(`${apiUrl}/ad/credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok)
        throw new Error(`Failed to save AD credentials, Status: ${response.status}`);

      const diff = Date.now() - now;
      if (diff < 1000) await new Promise((resolve) => setTimeout(resolve, 1000 - diff));
    },
    onSettled: () => query.refetch(),
  });

  const autoSync = useMutation({
    mutationFn: async (isEnabled: boolean) => {
      const credentials = { ...query.data };
      if (!credentials) throw new Error("No AD credentials available");

      credentials.ldapPass = null;

      const response = await fetch(`${apiUrl}/ad/credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...credentials,
          ldapAutoSync: isEnabled,
        }),
      });

      if (!response.ok)
        throw new Error(`Failed to update AD auto-sync, Status: ${response.status}`);
    },
    onMutate: async (isEnabled: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["activeDirectoryUser"] });
      const previousCredentials = queryClient.getQueryData(["activeDirectoryUser"]);

      queryClient.setQueryData(["activeDirectoryUser"], (old: ADCredentials) =>
        old ? { ...old, ldapAutoSync: isEnabled } : old,
      );

      return { previousCredentials };
    },
    onSuccess: (_, isEnabled) =>
      showMessage(`Synchronisation erfolgreich ${isEnabled ? "aktiviert" : "deaktiviert"}`),
    onError: (_, __, context) => {
      (queryClient.setQueryData(["activeDirectoryUser"], context?.previousCredentials),
        showMessage("Fehler beim Aktualisieren des Modus", "error"));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["activeDirectoryUser"] }),
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

  return {
    ...query,
    isADLoading: query.isLoading || units.isLoading,
    adCredentials,
    updateAutoSync: autoSync.mutate,
    units: units.data || [],
  };
};

export default useActiveDirectory;
