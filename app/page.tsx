"use client";

import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/general/Navbar";
import Footer from "./components/general/Footer";
import Header from "./components/general/Header";
import { useData } from "./contexts/DataContext";
import { useRouter } from "next/navigation";
import ContainerPreset from "./components/containers/ContainerPreset";

export default function Home() {
  const router = useRouter();

  const data = useData();
  const auth = useAuth();

  return (
    <>
      <Navbar />
      <div className="h-16 w-full" />
      <Header
        title={`Willkommen, ${auth.data?.name.split(" ")[0] ?? "Unbekannt"}.`}
        subtitle="Hier kannst du alle nötigen Einstellungen für eine reibungslose
  Funktionalität der App ClassInsights und den damit verbundenen Diensten
  tätigen."
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
