"use client";

import Container from "./components/Container";
import { useLinkGroupModal } from "./components/modals/LinkGroupModal";
import ConfigSection from "./components/ConfigSection";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const auth = useAuth();
  const groupModal = useLinkGroupModal();

  return (
    <>
      <h1 className="select-light dark:select-dark text-onBackground dark:text-dark-onBackground">
        Willkommen, {auth.data?.name.split(" ")[0] ?? "Unbekannt"}.
      </h1>
      <p className="select-light dark:select-dark mt-3 text-onBackground dark:text-dark-onBackground sm:w-[60%]">
        Hier kannst du alle nötigen Einstellungen für eine reibungslose
        Funktionalität der App ClassInsights und den damit verbundenen Diensten
        tätigen.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Container title="Test" label="Registrierte Nutzer" fullHeight>
          <div className="h-20 w-full"></div>
        </Container>
        <Container title="Test" label="Registrierte Nutzer">
          <div className="h-20 w-full"></div>
        </Container>
        <Container title="Test" label="Registrierte Nutzer">
          <div className="h-20 w-full"></div>
        </Container>
      </div>
      <ConfigSection
        title="Verknüpfe Gruppen"
        description="Hier kannst du die Azure AD Gruppen mit den WebUntis Klassen verknüpfen."
        action={groupModal.toggle}
        actionLabel="Einstellungen"
      />
      <div className="h-20 w-full"></div>
    </>
  );
}
