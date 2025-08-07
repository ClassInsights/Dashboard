import type { Room as RoomType } from "../types/Room";
import Spacing from "./Spacing";

const Room = ({ room }: { room: RoomType }) => {
	return (
		<div className="room">
			<h2>{room.displayName}</h2>
			<p>Dieser Raum enthält {room.deviceCount === 0 ? "keine" : room.deviceCount} Computer.</p>
			<Spacing size="md" />
			<div className="flex items-center justify-between">
				<h3>Automationen</h3>
			</div>
			<p>Deaktiviere jegliche ClassInsights Automationen.</p>
		</div>
	);
};

export default Room;
