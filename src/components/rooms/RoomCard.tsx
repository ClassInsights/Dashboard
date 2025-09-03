import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import type { Room } from "@/types/Room";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const RoomCard = ({ room }: { room: Room }) => {
  const { update: updateRoom } = useRooms();
  const { data: allComputers } = useComputers();

  const computers = allComputers?.filter((computer) => computer.roomId === room.roomId);
  const onlineComputers = computers?.filter((computer) => computer.online);

  const toggleRoom = (checked: boolean) => updateRoom.mutate({ ...room, enabled: checked });

  return (
    <Card className={!room.enabled ? "bg-muted/80 text-muted-foreground" : ""}>
      <CardHeader>
        <div className="flex justify-between">
          <h2>{room.displayName}</h2>
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
        {!!computers && !!onlineComputers ? (
          <p>
            {onlineComputers.length}/{computers.length} Computer online
          </p>
        ) : (
          <p>Keine Computer gefunden.</p>
        )}
      </CardHeader>
      <CardContent>
        <p>
          ClassInsights ist in diesem Raum{" "}
          <span className="font-medium">{room.enabled ? "aktiviert" : "deaktiviert"}</span>.
        </p>
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
