import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import type { Computer } from "@/types/Computer";
import type { Room } from "@/types/Room";
import type { Table } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export type RoomAssignmentProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  computerIds?: number[];
  table?: Table<Computer>;
};

const RoomAssignment = ({ isOpen, computerIds, onOpenChange, table }: RoomAssignmentProps) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);

  const { data: rooms } = useRooms();
  const { data: computers, update: updateComputers } = useComputers();

  if (!computers || computers.length === 0) return null;
  if (!computerIds || computerIds.length === 0) return null;

  const targetComputers = computers.filter((computer) => computerIds.includes(computer.computerId));
  const hasAnyComputerARoomAssigned = targetComputers.some((computer) => computer.roomId);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) setTimeout(() => setSelectedRoom(undefined), 200);
  };

  const handleUpdate = () => {
    if (!selectedRoom) return;

    updateComputers.mutate(
      targetComputers.map((computer) => ({
        ...computer,
        roomId: selectedRoom.roomId,
      })),
      {
        onSettled: () => handleOpenChange(false),
      },
    );

    if (table) table.resetRowSelection();
  };

  const handleRemove = () => {
    updateComputers.mutate(
      targetComputers.map((computer) => ({
        ...computer,
        roomId: null,
      })),
      {
        onSettled: () => handleOpenChange(false),
      },
    );

    if (table) table.resetRowSelection();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        {!selectedRoom ? (
          <>
            <DialogHeader>
              <DialogTitle>Raum zuweisen</DialogTitle>
              <DialogDescription>
                Wählen Sie den Raum aus, dem
                {computerIds.length === 1 ? " der Computer" : " die Computer"} zugewiesen werden
                sollen.
              </DialogDescription>
            </DialogHeader>
            <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
              <CommandInput placeholder="Nach Raum suchen..." />
              <CommandList>
                <CommandEmpty>Keine Räume gefunden.</CommandEmpty>
                {rooms?.map((room) => (
                  <CommandItem key={room.roomId} onSelect={() => setSelectedRoom(room)}>
                    {room.displayName}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
            {hasAnyComputerARoomAssigned && (
              <DialogFooter>
                <Button variant="outline" onClick={handleRemove}>
                  <Trash />
                  {computerIds.length === 1 ? "Aus Raum entfernen" : "Aus Räumen entfernen"}
                </Button>
              </DialogFooter>
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Sind Sie sich sicher?</DialogTitle>
              <DialogDescription>
                Möchten Sie{" "}
                <span className="font-semibold">
                  {computerIds.length === 1
                    ? `den Computer ${targetComputers[0].name}`
                    : `die ${targetComputers.length} Computer${targetComputers.length <= 3 ? ` (${targetComputers.map((computer) => computer.name).join(", ")})` : ""} `}{" "}
                  dem Raum {selectedRoom.displayName}
                </span>{" "}
                zuweisen? Diese Zuweisung überschreibt die automatische Zuweisung (falls
                konfiguriert).
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleUpdate}>Bestätigen</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoomAssignment;
