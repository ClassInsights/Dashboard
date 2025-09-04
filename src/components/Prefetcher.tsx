import { useAuth } from "@/contexts/AuthContext";
import useComputers from "@/hooks/use-computers";
import useConfiguration from "@/hooks/use-configuration";
import useRooms from "@/hooks/use-rooms";
import Loading from "@/pages/Loading";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const Prefetcher = ({ children }: { children: React.ReactNode }) => {
  const [shouldShowContent, setShouldShowContent] = useState(false);
  const startTimeRef = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<number | undefined>(undefined);

  const computers = useComputers();
  const rooms = useRooms();
  const config = useConfiguration();
  const { school } = useAuth();

  const isLoading = computers.isLoading || rooms.isLoading || config.isLoading;

  useEffect(() => {
    if (isLoading && startTimeRef.current === undefined) {
      startTimeRef.current = Date.now();
      setShouldShowContent(false);
    } else if (!isLoading && startTimeRef.current !== undefined) {
      const diff = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 500 - diff);

      timeoutRef.current = window.setTimeout(() => {
        setShouldShowContent(true);
        startTimeRef.current = undefined;
      }, remaining);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading]);

  if (computers.isError || rooms.isError || config.isError) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12">
        <img src="/logo.svg" alt="ClassInsights Logo" width={100} />
        <div className="flex flex-col items-center pb-20 text-center">
          <h1 className="pb-6">Datenabfrage fehlgeschlagen</h1>
          <p className="w-3/4 pb-5 lg:w-1/2">
            Leider ist beim Abrufen der Daten ein unerwarteter Fehler aufgetreten. Bitte versuchen
            Sie es später erneut. Wenn der Fehler bestehen bleibt kontaktieren Sie bitte Ihren
            Systemadministrator oder den{" "}
            <Button variant="link" className="m-0! p-0!">
              <a
                href={`mailto:office@classinsights.at?subject=Dashboard%20Crash&body=%0A%0AINFORMATIONEN%20UND%20FEHLER%20NICHT%20ENTFERNEN%0A__________________________________________%0A%0AInformationen%3A%0ASchule: ${school.name}%0ASchul-ID: ${school.id}%0AAPI-Url: ${school.apiUrl}%0ADashboard-Url: ${school.dashboardUrl}%0ADashboard-Version: ${import.meta.env.PACKAGE_VERSION}%0A%0AFehlerdetails:%0A${[
                  computers.error,
                  rooms.error,
                  config.error,
                ]
                  .map((e) => e?.message)
                  .filter(Boolean)
                  .join("%0A")}`}
              >
                ClassInsights Support
              </a>
            </Button>
            . (Bitte die Schulinformationen und Fehlerdetails in der Email nicht entfernen!)
          </p>
          <Button onClick={() => window.location.reload()}>Erneut versuchen</Button>
        </div>
      </div>
    );
  }

  if (isLoading || !shouldShowContent) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default Prefetcher;
