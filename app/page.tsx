"use client";

import Container from "./components/Container";
import { useLinkGroupModal } from "./components/modals/LinkGroupModal";
import ConfigSection from "./components/ConfigSection";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useData } from "./contexts/DataContext";
import { useRouter } from "next/navigation";
import Header from "./components/Header";

export default function Home() {
  const router = useRouter();

  const auth = useAuth();
  const data = useData();

  const groupModal = useLinkGroupModal();

  if (auth.didFail && !auth.loading) {
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
  }

  return (
    <>
      <Navbar />
      <div className="h-20 w-full" />
      <Header
        title={`Willkommen, ${auth.data?.name.split(" ")[0] ?? "Unbekannt"}.`}
        subtitle="Hier kannst du alle nötigen Einstellungen für eine reibungslose
        Funktionalität der App ClassInsights und den damit verbundenen Diensten
        tätigen."
      />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Container
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
