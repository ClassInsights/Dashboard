"use client";

import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/general/Navbar";
import Footer from "./components/general/Footer";
import Header from "./components/general/Header";
import { useData } from "./contexts/DataContext";
import { useRouter } from "next/navigation";
import ContainerPreset from "./components/containers/ContainerPreset";
import { useLog } from "./contexts/LogContext";
import { useAlert } from "./contexts/AlertContext";
import { useRatelimit } from "./contexts/RatelimitContext";
import { useFail } from "./contexts/FailContext";
import { useCallback } from "react";

export default function Home() {
  const router = useRouter();

  const failer = useFail();
  const data = useData();
  const alert = useAlert();
  const logData = useLog();
  const ratelimit = useRatelimit();
  const auth = useAuth();

  const reloadApplication = useCallback(async () => {
    const limit = ratelimit.getRatelimit("appReload");
    if (limit) {
      const secondsLeft = Math.ceil(
        (limit.startedAt.getTime() + limit.duration - Date.now()) / 1000,
      );
      alert.show(
        `Warte noch ${secondsLeft} ${
          secondsLeft === 1 ? "Sekunde" : "Sekunden"
        } zum Aktualisieren`,
      );
      return;
    }

    const reloadAuth = async () => {
      await auth.reload();
      return failer.hasFailed;
    };

    if (
      (await data.fetchRooms(true)) ||
      (await logData.fetchLogs(true)) ||
      (await reloadAuth())
    )
      alert.show("Fehler beim Aktualisieren der Daten");
    else {
      ratelimit.addRateLimit("appReload", 1000 * 30);
      alert.show("Daten wurden aktualisiert");
    }
  }, [ratelimit, alert, auth, failer, data, logData]);

  return (
    <>
      <Navbar />
      <div className="h-16 w-full" />
      <Header
        title={`Willkommen, ${auth.data?.name.split(" ")[0] ?? "Unbekannt"}.`}
        subtitle="Hier kannst du alle nötigen Einstellungen für eine reibungslose
  Funktionalität der App ClassInsights und den damit verbundenen Diensten
  tätigen."
        reloadAction={window.innerWidth > 800 ? reloadApplication : undefined}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ContainerPreset
          label="Registrierte Räume"
          title={`${data.rooms?.length ?? 0}`}
          showArrow
          onClick={() => router.push("/rooms")}
        />
        <ContainerPreset
          label="Logbuch"
          title="Öffnen"
          showArrow
          onClick={() => router.push("/logs")}
        />
      </div>
      <section className="mt-10 select-none flex-col xs:flex-row">
        <h2>Konfiguration verwalten</h2>
        <div className="flex flex-col justify-between xs:flex-row xs:items-center">
          <p>
            Hier kannst du alle nötigen Wartungsarbeiten für das ClassInsights
            Ökosystem tätigen.
          </p>
          <button
            onClick={() => router.push("/settings")}
            className="mt-4 rounded-lg bg-primary px-4 py-3 xs:ml-20 xs:mt-0"
          >
            <span className="text-background dark:text-dark-background">
              Einstellungen
            </span>
          </button>
        </div>
      </section>
      <div className="h-20 w-full"></div>
      <Footer />
    </>
  );
}
