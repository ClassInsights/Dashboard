import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import { Computer, School } from "lucide-react";
import { Link } from "react-router";

const Home = () => {
  const { data: computers } = useComputers();
  const { data: rooms } = useRooms();
  const auth = useAuth();

  const onlineComputers = computers?.filter((computer) => computer.online).length;
  const roomsWithComputers = rooms?.filter((room) =>
    computers?.find((computer) => computer.roomId === room.roomId),
  ).length;

  return (
    <>
      <Title
        title={`Wilkommen ${auth.name}.`}
        subtitle="Willkommen beim ClassInsights Dashboard, Ihr zentrales Steuerungselement für das gesamte ClassInsights Ökosystem."
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
    </>
  );
};

export default Home;
