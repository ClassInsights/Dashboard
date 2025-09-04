import useActiveDirectory from "@/hooks/use-activeDirectory";
import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import Spacing from "../Spacing";
import AddRoom from "./AddRoom";
import RoomCard from "./RoomCard";

const RoomList = () => {
  const { data: rooms } = useRooms();
  const { data: computers } = useComputers();
  const { isSuccess: isADSuccess } = useActiveDirectory();

  if (!rooms) return <p className="font-medium">Es wurden keine Räume gefunden.</p>;

  /** Rooms that have an organization unit or at least one computer */
  const filteredRooms = rooms.filter(
    (room) =>
      !!computers?.find((computer) => computer.roomId === room.roomId) || !!room.organizationUnit,
  );

  return (
    <>
      <h2 className="pb-1.5">Registrierte Räume</h2>
      <p className="md:w-3/4">
        Hier werden alle Räume aufgelistet, die entweder einer Active Directory Organisationseinheit
        zugewiesen sind oder mindestens einen Computer hinzugefügt bekommen haben.
      </p>
      {isADSuccess && filteredRooms.length < rooms.length && <AddRoom />}
      <Spacing size="md" />
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredRooms.map((room) => (
          <RoomCard key={room.roomId} room={room} />
        ))}
      </div>
    </>
  );
};

export default RoomList;
