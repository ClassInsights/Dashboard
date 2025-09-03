import { columns } from "@/components/computers/Columns";
import ComputerTable from "@/components/computers/Table";
import Title from "@/components/Title";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import { useMemo } from "react";
import { useSearchParams } from "react-router";

const Computers = () => {
  const { data: computers } = useComputers();
  const { data: rooms } = useRooms();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId");

  // remove parameters from url
  window.history.replaceState({}, "", window.location.pathname);

  const room = rooms?.find((room) => room.roomId === Number(roomId ?? -1));

  const initialFilter = room ? [{ id: "Raum", value: [room.displayName] }] : undefined;

  if (!computers || !rooms) return null;

  const computersWithRooms = useMemo(
    () =>
      computers.map((computer) => ({
        ...computer,
        room: rooms.find((room) => room.roomId === computer.roomId)?.displayName ?? "???",
      })),
    [computers, rooms],
  );

  return (
    <>
      <Title
        title="Computerliste"
        subtitle="Nachfolgend finden Sie eine Übersicht aller registrierten Computer Ihrer Schule. Sie haben die Möglichkeit, gezielt nach Computern zu suchen, Filteroptionen zu nutzen und die Sortierung individuell anzupassen."
        backLink="/"
      />
      <ComputerTable columns={columns} data={computersWithRooms} initialFilter={initialFilter} />
    </>
  );
};

export default Computers;
