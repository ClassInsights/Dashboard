import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import useVersions from "@/hooks/use-versions";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

const Updater = () => {
  const [isOpen, setIsOpen] = useState(false);
  const versions = useVersions();

  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  const { showMessage } = useToast();

  const update = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${apiUrl}/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error("Update failed");
    },
    onSuccess: () => showMessage("Update erfolgreich gestartet"),
    onError: () => showMessage("Update Start fehlgeschlagen", "error"),
  });

  /** Start the automatic update */
  const callUpdate = () => {
    setIsOpen(false);
    update.mutate();
  };

  const hasApiUpdate =
    !!versions?.latestApiVersion &&
    !!versions?.currentApiVersion &&
    versions.latestApiVersion !== versions.currentApiVersion;

  const hasDashboardUpdate =
    !!versions?.latestDashboardVersion &&
    !!versions?.currentDashboardVersion &&
    versions.latestDashboardVersion !== versions.currentDashboardVersion;

  const isUpdateAvailable = hasApiUpdate || hasDashboardUpdate;

  useEffect(() => {
    if (isUpdateAvailable) setIsOpen(true);
  }, [isUpdateAvailable]);

  if (!versions) return null;
  if (versions.isLoading || !isUpdateAvailable) return null;

  const {
    latestApiVersion,
    currentApiVersion,
    latestDashboardVersion,
    currentDashboardVersion,
    platform,
  } = versions;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Neue Version verfügbar!</DrawerTitle>
          <DrawerDescription>
            {platform === "Unix"
              ? "Klicken Sie auf Aktualisieren, um ClassInsights automatisch auf den neuesten Stand zu bringen."
              : "Bitte folgen Sie der Aktualisierungsanleitung in der Dokumentation."}{" "}
          </DrawerDescription>
          <DrawerDescription className="pb-4">
            Hinweis: Bei der Aktualisierung ist das System für kurze Zeit nicht verfügbar.
          </DrawerDescription>
          <DrawerDescription>
            {hasApiUpdate && (
              <span>
                API: v{currentApiVersion} &#8594; v{latestApiVersion} &#124;{" "}
                <a
                  href={`https://github.com/ClassInsights/Api/compare/v${currentApiVersion}...v${latestApiVersion}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary"
                >
                  Änderungen
                </a>
                <br />
              </span>
            )}
            {hasDashboardUpdate && (
              <span>
                Dashboard: v{currentDashboardVersion} &#8594; v{latestDashboardVersion} &#124;{" "}
                <a
                  href={`https://github.com/ClassInsights/Dashboard/compare/v${currentDashboardVersion}...v${latestDashboardVersion}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary"
                >
                  Änderungen
                </a>
              </span>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="mx-auto w-full md:w-1/2 lg:w-1/4">
          {platform === "Unix" && (
            <Button onClick={callUpdate}>
              {hasApiUpdate && hasDashboardUpdate ? "Alle Aktualisieren" : "Aktualisieren"}
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
            Später erinnern
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Updater;
