import useActiveDirectory from "@/hooks/use-activeDirectory";
import type { Room } from "@/types/Room";
import { useState } from "react";
import { Link } from "react-router";
import RoomAssignment from "../RoomAssignment";
import { Button } from "../ui/button";

type RoomHintProps = {
  computerId: number;
  room: Room | undefined;
};

const RoomHint = ({ computerId, room }: RoomHintProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: adCredentials } = useActiveDirectory();

  const autoSyncEnabled = adCredentials?.ldapAutoSync ?? false;

  if (room || autoSyncEnabled) return null;

  return (
    <>
      <RoomAssignment isOpen={isOpen} onOpenChange={setIsOpen} computerIds={[computerId]} />
      <div className="rounded-xl border border-amber-500 px-5 py-3 text-center">
        <p className="mx-auto lg:w-3/4">
          Dieser Computer ist noch keinem Raum zugewiesen. Richte für die Zuweisung entweder die
          automatische Raumzuweisung mithilfe der{" "}
          <Link to="../raumverwaltung/ad">
            <Button variant="link" className="px-0!">
              Active Directory Integration
            </Button>
          </Link>{" "}
          für den entsprechenden Raum ein oder{" "}
          <Button variant="link" className="p-0!" onClick={() => setIsOpen(true)}>
            weise den Computer manuell einem Raum zu
          </Button>
          .
        </p>
      </div>
    </>
  );
};

export default RoomHint;
