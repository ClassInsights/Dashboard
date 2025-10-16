import useActiveDirectory from "@/hooks/use-activeDirectory";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import type { Room } from "@/types/Room";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

/** Assign an organization unit to an unsigned room */
const AddRoom = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [unit, setUnit] = useState<string | null>(null);

  const { data: rooms, update: updateRoom } = useRooms();
  const { data: computers } = useComputers();
  const { units } = useActiveDirectory();

  /** Rooms that do not have an organizationUnit assigned and no computers */
  const unassignedRooms = rooms?.filter(
    (room) =>
      !room.organizationUnit && !computers?.find((computer) => computer.roomId === room.roomId),
  );

  /** Units that are not assigned to any room yet */
  const leftUnits = units?.filter((unit) => !rooms?.some((r) => r.organizationUnit === unit));

  /** Reset selection after closing */
  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setTimeout(() => {
      setRoom(null);
      setUnit(null);
    }, 200);
  };

  /** Update the organization unit for this room */
  const handleUpdateRoom = () => {
    if (!room || !unit) return;
    updateRoom.mutate({ ...room, organizationUnit: unit });
    handleOpenChange(false);
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-3">
          <PlusCircle />
          Neuen Raum hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!room && !unit && (
          <>
            <DialogHeader>
              <DialogTitle>Neuen Raum auswählen</DialogTitle>
              <DialogDescription>
                Wählen Sie den Raum aus, für den Sie eine Active Directory Organisationseinheit
                festlegen möchten.
              </DialogDescription>
            </DialogHeader>
            <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
              <CommandInput placeholder="Nach Organisationseinheit suchen..." />
              <CommandList>
                <CommandEmpty>Keine Räume gefunden.</CommandEmpty>
                {unassignedRooms?.map((room) => (
                  <CommandItem key={room.roomId} onSelect={() => setRoom(room)}>
                    {room.displayName}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </>
        )}
        {room && !unit && (
          <>
            <DialogHeader>
              <DialogTitle>Organisationseinheit auswählen</DialogTitle>
              <DialogDescription>
                Wählen Sie die Active Directory Organisationseinheit aus, die mit dem Raum{" "}
                {room.displayName} verknüpft werden sollte.
              </DialogDescription>
            </DialogHeader>
            <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
              <CommandInput placeholder="Nach Organisationseinheit suchen..." />
              <CommandList>
                <CommandEmpty>Keine Organisationseinheit gefunden.</CommandEmpty>
                {leftUnits?.map((unit) => (
                  <CommandItem key={unit} onSelect={() => setUnit(unit)}>
                    {unit.convertLDAP()}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </>
        )}
        {room && unit && (
          <>
            <DialogHeader>
              <DialogTitle>Sind Sie sich sicher?</DialogTitle>
              <DialogDescription>
                Möchten Sie dem Raum {room.displayName} die Organisationseinheit{" "}
                <span className="font-semibold">{unit.convertLDAP()}</span> zuweisen? Dadurch wird
                die Organisationseinheit mit dem Raum verknüpft und Computer dementsprechend
                zugeordnet.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={() => handleOpenChange(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleUpdateRoom}>Bestätigen</Button>
                </div>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddRoom;
