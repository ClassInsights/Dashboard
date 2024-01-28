"use client";

import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/general/Navbar";
import Footer from "./components/general/Footer";
import Header from "./components/general/Header";
import { useRouter } from "next/navigation";
import ContainerPreset from "./components/containers/ContainerPreset";
import { useAlert } from "./contexts/AlertContext";
import { useRatelimit } from "./contexts/RatelimitContext";
import { useFail } from "./contexts/FailContext";
import { useCallback, useEffect } from "react";
import { useRooms } from "./contexts/RoomContext";
import { ResponseType } from "./types/response";
import { useComputers } from "./contexts/ComputerContext";
import { useLog } from "./contexts/LogContext";

export default function Home() {
  const router = useRouter();

  const roomData = useRooms();
  const computerData = useComputers();
  const logData = useLog();
  const alert = useAlert();
  const auth = useAuth();
  const ratelimit = useRatelimit();

  const handleReload = useCallback(async () => {
    const limit = ratelimit.getRatelimit("application");
    if (limit) {
      const secondsLeft = Math.ceil(
        (limit.startedAt.getTime() + limit.duration - Date.now()) / 1000,
      );
      alert.show(
        `Warte noch ${secondsLeft <= 0 ? 1 : secondsLeft} ${
          secondsLeft === 1 ? "Sekunde" : "Sekunden"
        } zum Aktualisieren`,
      );
      return;
    }
    if (
      (await roomData.fetchRooms()).type === ResponseType.Success &&
      (await logData.fetchLogs()).type === ResponseType.Success
    ) {
      computerData.clearComputers();
      alert.show("Dashboard wurde erfolgreich aktualisiert");
      ratelimit.addRateLimit("application", 10000);
    } else alert.show("Aktualisierung von Dashboard fehlgeschlagen");
  }, [roomData, ratelimit, alert, computerData, logData]);

  return (
    <>
      <Navbar />
      <div className="h-16 w-full" />
      <Header
        title={`Willkommen, ${auth.data?.name.split(" ")[0] ?? "Unbekann"}.`}
        subtitle="Hier kannst du alle nötigen Einstellungen für eine reibungslose
  Funktionalität der App ClassInsights und den damit verbundenen Diensten
  tätigen."
        reloadAction={handleReload}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ContainerPreset
          label="Registrierte Räume"
          title={`${roomData?.rooms.length ?? 0}`}
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
