"use client";

import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ConfigSection from "./components/ConfigSection";
import Header from "./components/Header";
import { useData } from "./contexts/DataContext";
import { useRouter } from "next/navigation";
import { useLinkGroupModal } from "./components/modals/LinkGroupModal";
import ContainerPreset from "./components/containers/ContainerPreset";

export default function Home() {
  const router = useRouter();

  const data = useData();
  const auth = useAuth();

  const groupModal = useLinkGroupModal();

  if (auth.didFail && !auth.loading)
    return (
      <div className="mx-auto flex min-h-screen w-full select-none items-center justify-center md:w-2/4 xl:w-2/5 2xl:w-2/6">
        <div className="text-center text-onBackground dark:text-dark-onBackground">
          <h1 className="mb-3">Authentifizieren fehlgeschlagen.</h1>
          <p>
            Nur{" "}
            <b className="text-primary dark:text-dark-primary">
              Administratoren haben Zugriff
            </b>{" "}
            auf dieses Dashboard. Wenn du denkst, dass du Zugriff haben
            solltest, versuche es später erneut!
          </p>
        </div>
      </div>
    );

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
      </div>
      <ConfigSection
        title="Verknüpfe Gruppen"
        description="Hier kannst du die Azure AD Gruppen mit den WebUntis Klassen verknüpfen."
        action={groupModal.toggle}
        actionLabel="Einstellungen"
      />
      <div className="h-20 w-full"></div>
      <Footer />
    </>
  );
}
