import { Page } from "@/app/contexts/NavigationContext";
import Header from "../Header";

const RoomOverviewPage = () => {
  return (
    <Header
      title="Räume"
      subtitle="Hier siehst du alle Räume der Schule mit registrierten Geräten."
      previousPage={Page.HOME}
    />
  );
};

export default RoomOverviewPage;
