import useActiveDirectory from "@/hooks/use-activeDirectory";
import type { Computer } from "@/types/Computer";
import type { Room } from "@/types/Room";
import { useState } from "react";
import RoomAssignment from "../RoomAssignment";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ChangeRoomProps = {
  computer: Computer;
  room: Room | undefined;
};

const ChangeRoom = ({ computer, room }: ChangeRoomProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: adCredentials, isLoading } = useActiveDirectory();

  const autoSyncEnabled = adCredentials?.autoSync ?? false;

  if (!room) return null;

  return (
    <>
      <RoomAssignment
        computerIds={[computer.computerId]}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
      <p className="mt-3">
        Der Computer {computer.name} befindet sich aktuell im Raum {room.displayName}.{" "}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="link"
                className="px-0!"
                onClick={() => setIsOpen(true)}
                disabled={isLoading || autoSyncEnabled}
              >
                Raum wechseln
              </Button>
            </span>
          </TooltipTrigger>
          {autoSyncEnabled && (
            <TooltipContent>
              <p>Nicht möglich da automatische Active Directory Synchronisierung aktiviert ist!</p>
            </TooltipContent>
          )}
        </Tooltip>
      </p>
    </>
  );
};

export default ChangeRoom;
