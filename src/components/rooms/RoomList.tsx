import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import RoomCard from "./RoomCard";

const RoomList = () => {
  const { data: rooms } = useRooms();
  const { data: computers } = useComputers();

  if (!rooms) return <p className="font-medium">Es wurden keine Räume gefunden.</p>;

  const filteredRooms = rooms.filter(
    (room) => !!computers?.find((computer) => computer.roomId === room.roomId) || !!room.regex,
  );

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2 2xl:grid-cols-3">
      {filteredRooms.map((room) => (
        <RoomCard key={room.roomId} room={room} />
      ))}
    </div>
  );
};

export default RoomList;
