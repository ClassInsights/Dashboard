import { useAuth } from "@/app/contexts/AuthContext";
import ConfigSection from "../ConfigSection";
import Container from "../Container";
import Header from "../Header";
import { useData } from "@/app/contexts/DataContext";
import { useLinkGroupModal } from "../modals/LinkGroupModal";
import { useNavigation, Page } from "@/app/contexts/NavigationContext";

const HomePage = () => {
  const navigation = useNavigation();

  const auth = useAuth();
  const data = useData();

  const groupModal = useLinkGroupModal();

  return (
    <>
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
          onClick={() => navigation.setPage(Page.ROOMS)}
        />
      </div>
      <ConfigSection
        title="Verknüpfe Gruppen"
        description="Hier kannst du die Azure AD Gruppen mit den WebUntis Klassen verknüpfen."
        action={groupModal.toggle}
        actionLabel="Einstellungen"
      />
    </>
  );
};

export default HomePage;
