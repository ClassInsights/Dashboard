import { columns } from "@/components/computers/Columns";
import ComputerTable from "@/components/computers/Table";
import Title from "@/components/Title";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useSearchParams } from "react-router";

const parseFilters = (value: string | null): ColumnFiltersState | undefined => {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return undefined;
    return parsed as ColumnFiltersState;
  } catch {
    return undefined;
  }
};

const Computers = () => {
  const { data: computers } = useComputers();
  const { data: rooms } = useRooms();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId");
  const filtersParam = searchParams.get("filters");

  const room = rooms?.find((room) => room.roomId === Number(roomId ?? -1));

  const urlFilters = parseFilters(filtersParam);
  const roomFilter: ColumnFiltersState | undefined = room
    ? [{ id: "Raum", value: [room.displayName] }]
    : undefined;

  const initialFilter = urlFilters ?? roomFilter;

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
        subtitle="Nachfolgend finden Sie eine Übersicht aller registrierten Computer Ihrer Schule. Sie haben die Möglichkeit, gezielt nach Computern zu suchen, Filteroptionen zu nutzen und die Sortierung individuell anzupassen. Die Computer werden alle 10 Sekunden automatisch aktualisiert."
        backLink="/"
      />
      <ComputerTable columns={columns} data={computersWithRooms} initialFilter={initialFilter} />
    </>
  );
};

export default Computers;
