import CommandButton from "@/components/computer/CommandButton";
import LogArea from "@/components/computer/LogArea";
import RoomHint from "@/components/computer/RoomHint";
import Spacing from "@/components/Spacing";
import Title from "@/components/Title";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import {
  CircleUserRound,
  Clock,
  Computer as ComputerIcon,
  EthernetPort,
  Globe,
  History,
  LogOut,
  Power,
  RotateCcw,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const Computer = () => {
  const { id } = useParams();

  const {
    data: computers,
    commands: { isPending: isCommandPending, mutate: sendCommand },
  } = useComputers();

  const { data: rooms } = useRooms();

  const navigate = useNavigate();

  const computer = computers?.find((computer) => computer.computerId.toString() === id);
  const room = rooms?.find((room) => room.roomId === computer?.roomId);

  useEffect(() => {
    if (!computer) navigate("/computer");
  }, [computer, navigate]);

  if (!computer) return null;

  return (
    <div key={id}>
      <Title
        title={`${computer.name} ${room?.displayName ? `(${room.displayName})` : ""}`}
        subtitle="Hier finden Sie alle gesammelten Daten und Logs für diesen Computer."
        backLink="/computer"
        titleBadge={
          <Badge variant={computer.online ? "success" : "destructive"}>
            {computer.online ? "Online" : "Offline"}
          </Badge>
        }
        actions={
          <>
            <CommandButton
              label="Herunterfahren"
              alertDescription={`Der Computer ${computer.name} wird sofort heruntergefahren. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`}
              action={() => sendCommand([{ command: "shutdown", computerId: computer.computerId }])}
              disabled={!computer.online || isCommandPending}
              trigger={
                <Button variant="outline">
                  <Power />
                  Herunterfahren
                </Button>
              }
            />
            <CommandButton
              label="Neustarten"
              alertDescription={`Der Computer ${computer.name} wird sofort neu gestartet. Ungespeicherte Änderungen oder Dokumente gehen dabei verloren!`}
              action={() => sendCommand([{ command: "restart", computerId: computer.computerId }])}
              disabled={!computer.online || isCommandPending}
              trigger={
                <Button variant="outline">
                  <RotateCcw />
                  Neustarten
                </Button>
              }
            />
            <CommandButton
              label="Abmelden"
              alertDescription={`Alle angemeldeten Benutzer am Computer ${computer.name} werden sofort abgemeldet. Ungespeicherte Arbeiten gehen dabei verloren!`}
              action={() => sendCommand([{ command: "logoff", computerId: computer.computerId }])}
              disabled={!computer.online || isCommandPending}
              trigger={
                <Button variant="outline">
                  <LogOut />
                  Abmelden
                </Button>
              }
            />
          </>
        }
      />
      <div className="grid grid-cols-1 gap-x-20 gap-y-3 md:grid-cols-[repeat(2,_minmax(auto,_max-content))]">
        {[
          {
            icon: ComputerIcon,
            label: computer.name,
          },
          {
            icon: Clock,
            label:
              new Date(computer.lastSeen).toLocaleDateString("de-AT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }) + " Uhr",
          },
          {
            icon: Globe,
            label: computer.ipAddress,
          },
          {
            icon: CircleUserRound,
            label: computer.lastUser,
          },
          {
            icon: EthernetPort,
            label: computer.macAddress,
          },
          {
            icon: History,
            label: computer.version,
          },
        ].map(({ icon: Icon, label }) => (
          <div className="flex items-center gap-2" key={label}>
            <Icon size="16" />
            {label}
          </div>
        ))}
      </div>
      {!room && <Spacing size="md" />}
      <RoomHint computerId={computer.computerId} room={room} />
      <Spacing size="lg" />
      <LogArea computerId={computer.computerId} />
    </div>
  );
};

export default Computer;
