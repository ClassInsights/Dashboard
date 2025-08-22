import { columns } from "@/components/computers/Columns";
import ComputerTable from "@/components/computers/Table";
import Title from "@/components/Title";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import { useMemo } from "react";

const Computers = () => {
  const { data: computers } = useComputers();
  const { data: rooms } = useRooms();

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
      <ComputerTable columns={columns} data={computersWithRooms} />
    </>
  );
};

export default Computers;
