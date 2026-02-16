import { columns } from "@/components/computers/Columns";
import ComputerTable from "@/components/computers/Table";
import Title from "@/components/Title";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

const Computers = () => {
  const { data: computers } = useComputers();
  const { data: rooms } = useRooms();
  const [searchParams, setSearchParams] = useSearchParams();

  const roomId = searchParams.get("roomId");

  useEffect(() => {
    if (!roomId || !rooms) return;
    const room = rooms.find((r) => r.roomId === Number(roomId));
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("roomId");
    if (room) {
      nextParams.set("filters", JSON.stringify([{ id: "Raum", value: [room.displayName] }]));
    }
    setSearchParams(nextParams, { replace: true });
  }, [roomId, rooms, searchParams, setSearchParams]);

  const computersWithRooms = useMemo(
    () =>
      computers && rooms
        ? computers.map((computer) => ({
            ...computer,
            room: rooms.find((room) => room.roomId === computer.roomId)?.displayName ?? "???",
          }))
        : [],
    [computers, rooms],
  );

  if (!computers || !rooms || roomId) return null;

  return (
    <>
      <Title
        title="Computerliste"
        subtitle="Nachfolgend finden Sie eine Übersicht aller registrierten Computer Ihrer Schule. Sie haben die Möglichkeit, gezielt nach Computern zu suchen, Filteroptionen zu nutzen und die Sortierung individuell anzupassen. Die Computer werden alle 10 Sekunden automatisch aktualisiert."
        backLink="/"
      />
      <ComputerTable columns={columns} data={computersWithRooms} />
    </>
  );
};

export default Computers;
