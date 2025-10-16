import Changelog from "@/components/Changelog";
import Spacing from "@/components/Spacing";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import useVersions from "@/hooks/use-versions";
import { Computer, School } from "lucide-react";
import { Link } from "react-router";

const Home = () => {
  const { data: computers } = useComputers();
  const { data: rooms } = useRooms();

  const versions = useVersions();
  const auth = useAuth();

  const onlineComputers = computers?.filter((computer) => computer.online).length;
  const roomsWithComputers = rooms?.filter((room) =>
    computers?.find((computer) => computer.roomId === room.roomId),
  ).length;

  return (
    <>
      <Title
        title={`Wilkommen ${auth.name}.`}
        subtitle="Willkommen beim ClassInsights Dashboard, Ihr zentrales Steuerelement für das gesamte ClassInsights Ökosystem."
        actions={
          <>
            <Link to="computer">
              <Button variant="outline">
                <Computer />
                {computers && computers.length > 0 ? (
                  <span>
                    {onlineComputers} / {computers?.length} online
                  </span>
                ) : (
                  <span>Keine Computer gefunden</span>
                )}
              </Button>
            </Link>
            <Link to="raumverwaltung">
              <Button variant="outline">
                <School />
                {roomsWithComputers} Räume mit Computern
              </Button>
            </Link>
          </>
        }
      />
      <Spacing size="md" />
      <h2 className="pb-1.5">Neuerungen</h2>
      <p className="md:w-3/4">
        Hier werden die neuesten Änderungen und Verbesserungen an diesem Dashboard und der
        schulinternen API angezeigt.
      </p>
      <Spacing size="md" />
      <div className="flex flex-col items-start gap-x-10 gap-y-5 lg:flex-row">
        <Changelog
          title={`Dashboard v${versions?.currentDashboardVersion}`}
          description="Neueste Änderungen am ClassInsights Dashboard."
          body={versions?.latestDashboardVersion?.changelog}
          releaseUrl="https://github.com/classinsights/Dashboard/releases/latest"
        />
        <Changelog
          title={`Lokale API v${versions?.currentApiVersion}`}
          description="Neueste Änderungen an der lokalen API."
          body={versions?.latestApiVersion?.changelog}
          releaseUrl="https://github.com/classinsights/Api/releases/latest"
        />
      </div>
      <Spacing size="md" />
    </>
  );
};

export default Home;
