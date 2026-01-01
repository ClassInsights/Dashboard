import { useToast } from "@/contexts/ToastContext";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import type { Computer } from "@/types/Computer";
import type { Table } from "@tanstack/react-table";
import { RotateCcw, X } from "lucide-react";
import { Button } from "../ui/button";
import ComputerTableViewOptions from "./ColumnToggle";
import ComputerTableFacetedFilter from "./FacetedFilter";
import NameFilter from "./NameFilter";

const Toolbar = ({ table }: { table: Table<Computer> }) => {
  const { data: rooms } = useRooms();
  const { data: computers, refetch, isRefetching } = useComputers();
  const { showMessage } = useToast();

  if (!computers || !rooms) return null;

  const removeSorting = () => {
    table.setSorting([]);
    showMessage("Sortierung entfernt");
  };

  const refetchComputers = () =>
    refetch()
      .then(() => showMessage("Computer wurden aktualisiert"))
      .catch(() => showMessage("Fehler beim Aktualisieren der Computer", "error"));

  const roomsWithLabel = Array.from(
    table.getColumn("Raum")?.getFacetedUniqueValues().keys() ?? [],
  ).map((room: string) => ({ value: room, label: room === "???" ? "Nicht zugewiesen" : room }));

  const statusWithLabel = Array.from(
    table.getColumn("Status")?.getFacetedUniqueValues().keys() ?? [],
  ).map((status: string) => ({ value: status, label: status }));

  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <p className="pb-1 font-medium">Verfügbare Filter</p>
        <div className="flex flex-col gap-x-2 gap-y-1.5 lg:flex-row lg:items-center">
          {table.getColumn("Raum") && (
            <ComputerTableFacetedFilter
              column={table.getColumn("Raum")}
              title="Raum"
              options={roomsWithLabel}
              table={table}
            />
          )}
          {table.getColumn("Status") && (
            <ComputerTableFacetedFilter
              column={table.getColumn("Status")}
              title="Status"
              options={statusWithLabel}
              table={table}
            />
          )}
          <NameFilter table={table} />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {table.getState().sorting.length > 0 && (
          <Button variant="outline" size="sm" className="flex h-8" onClick={removeSorting}>
            <X />
            <span className="hidden lg:block">Sortierung entfernen</span>
          </Button>

        )}
        <ComputerTableViewOptions table={table} />
        <Button size="sm" onClick={refetchComputers} disabled={isRefetching}>
          <RotateCcw className="h-6" />
          <span className="hidden lg:block">Aktualisieren</span>
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
