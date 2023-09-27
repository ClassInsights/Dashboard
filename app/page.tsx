"use client";

import Navbar from "./components/Navbar";
import Container from "./components/Container";
import LinkGroupModal, {
  useLinkGroupModal,
} from "./components/modals/LinkGroupModal";
import ConfigSection from "./components/ConfigSection";
import { ThemeMode, useTheme } from "./contexts/ThemeContext";
import Footer from "./components/Footer";

export default function Home() {
  const theme = useTheme();
  const groupModal = useLinkGroupModal();

  return (
    <>
      <LinkGroupModal />
      <div className="min-h-screen w-full">
        <Navbar />
        <h1 className="select-light dark:select-dark mt-20 text-onBackground dark:text-dark-onBackground">
          Willkommen, Jakob.
        </h1>
        <p className="select-light dark:select-dark mt-3 text-onBackground dark:text-dark-onBackground sm:w-[60%]">
          Hier kannst du alle nötigen Einstellungen für eine reibungslose
          Funktionalität der App ClassInsights und den damit verbundenen
          Diensten tätigen.
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
        <Footer />
      </div>
    </>
  );
}
