import useActiveDirectory from "@/hooks/use-activeDirectory";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import type { Room } from "@/types/Room";
import { ChevronRight, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
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
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const RoomCard = ({ room }: { room: Room }) => {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const { isSuccess: isADSuccess, units } = useActiveDirectory();
  const { update: updateRoom, data: rooms } = useRooms();
  const { data: allComputers } = useComputers();

  /** All computers of this room */
  const computers = allComputers?.filter((computer) => computer.roomId === room.roomId);
  /** All ONLINE computers of this room */
  const onlineComputers = computers?.filter((computer) => computer.online);

  /** Units that are not assigned to any room yet */
  const leftUnits = units?.filter((unit) => !rooms?.some((r) => r.organizationUnit === unit));

  /** Enable or disable ClassInsights for this room */
  const toggleRoom = (checked: boolean) => updateRoom.mutate({ ...room, enabled: checked });

  /** Reset selected unit after closing */
  const handleOpenChange = (open: boolean) => {
    if (!open) setTimeout(() => setSelectedUnit(null), 200);
  };

  /** Update the organization unit for this room */
  const handleUpdateRoom = () => {
    if (!selectedUnit) return;
    updateRoom.mutate({ ...room, organizationUnit: selectedUnit });
    handleOpenChange(false);
  };

  /** Remove the organization unit from this room */
  const removeOrganizationUnit = () => {
    updateRoom.mutate({ ...room, organizationUnit: null });
    handleOpenChange(false);
  };

  return (
    <Card className={!room.enabled ? "bg-muted/70" : ""}>
      <CardHeader>
        <div className="flex justify-between">
          <h3 className="text-xl">{room.displayName}</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Switch checked={room.enabled} onCheckedChange={toggleRoom} />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {room.enabled ? "ClassInsights deaktivieren" : "ClassInsights aktivieren"}
            </TooltipContent>
          </Tooltip>
        </div>
        {!!computers && computers.length >= 1 ? (
          <p>
            {onlineComputers?.length}/{computers.length} Computer online
          </p>
        ) : (
          <p>Noch keine Computer zugewiesen</p>
        )}
      </CardHeader>
      <CardContent>
        <p>
          ClassInsights ist in diesem Raum{" "}
          <span className="font-medium">{room.enabled ? "aktiviert" : "deaktiviert"}</span>.
        </p>
        {isADSuccess && (
          <div className="mt-3">
            <p className="pb-1 font-medium">Active Directory Organisationseinheit</p>
            <Dialog onOpenChange={handleOpenChange}>
              <DialogTrigger asChild disabled={!units}>
                <Button variant="outline">
                  {room.organizationUnit?.convertLDAP() ?? "Organisationseinheit auswählen"}
                  <ChevronRight />
                </Button>
              </DialogTrigger>
              <DialogContent>
                {!selectedUnit ? (
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
                          <CommandItem key={unit} onSelect={() => setSelectedUnit(unit)}>
                            {unit.convertLDAP()}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                    {!!room.organizationUnit && (
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" onClick={removeOrganizationUnit}>
                            <Trash />
                            Zuweisung entfernen
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    )}
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Sind Sie sich sicher?</DialogTitle>
                      <DialogDescription>
                        Möchten Sie dem Raum {room.displayName} die Organisationseinheit{" "}
                        <span className="font-semibold">{selectedUnit.convertLDAP()}</span>{" "}
                        zuweisen? Dadurch wird die Organisationseinheit mit dem Raum verknüpft und
                        Computer dementsprechend zugeordnet.
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
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="link" className="p-0!">
          <Link to={`/computer?roomId=${room.roomId}`}>Liste der Computer</Link>
          <ChevronRight />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
