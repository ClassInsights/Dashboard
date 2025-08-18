import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import type { Computer } from "@/types/Computer";
import type { Table } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import ComputerTableViewOptions from "./ColumnToggle";
import ComputerTableFacetedFilter from "./FacetedFilter";

const Toolbar = ({ table }: { table: Table<Computer> }) => {
  const { data: rooms } = useRooms();
  const { data: computers } = useComputers();

  if (!computers || !rooms) return null;

  const roomsWithLabel = rooms
    .filter((room) => computers.find((computer) => computer.roomId === room.roomId))
    .map((room) => {
      return {
        value: room.displayName,
        label: room.displayName,
      };
    });

  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <p className="pb-1 font-medium">Verfügbare Filter</p>
        <div className="flex items-center space-x-2">
          {table.getColumn("Raum") && (
            <ComputerTableFacetedFilter
              column={table.getColumn("Raum")}
              title="Raum"
              options={roomsWithLabel}
            />
          )}
          {table.getColumn("Status") && (
            <ComputerTableFacetedFilter
              column={table.getColumn("Status")}
              title="Status"
              options={[
                {
                  value: "Online",
                  label: "Online",
                },
                {
                  value: "Offline",
                  label: "Offline",
                },
              ]}
            />
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex h-8"
          onClick={() => table.resetSorting()}
        >
          <RotateCcw />
          Sortierung zurücksetzen
        </Button>
        <ComputerTableViewOptions table={table} />
      </div>
    </div>
  );
};

export default Toolbar;
