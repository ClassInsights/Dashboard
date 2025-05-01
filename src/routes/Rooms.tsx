import { Link } from "react-router-dom";
import Headline from "../components/Headline";
import Room from "../components/Room";
import { useData } from "../contexts/DataContext";
import ArrowSVG from "../assets/svg/arrow.svg?react";
import RefreshSVG from "../assets/svg/refresh.svg?react";

const Rooms = () => {
	const data = useData();

	return (
		<>
			<Headline
				title="Räume"
				subtitle="Hier sind alle Räume mit aktivem ClassInsights Ihrer Schule aufgelistet. Sie können sich den aktuellen Stundenplan anzeigen lassen und Automationen für einen Raum verwalten."
				backLink="/"
			/>
			<div className="flex items-center justify-between">
				<Link to="/computer" className="flex w-max items-center gap-1.5 pb-2">
					<p className="text-primary">Liste der Computer</p>
					<ArrowSVG className="shrink-0 fill-primary" />
				</Link>
				<RefreshSVG className="shrink-0 cursor-pointer fill-primary" onClick={() => data.refreshRooms()} />
			</div>
			<div
				id="rooms"
				className={`flex flex-col md:grid ${data.rooms?.length ?? 0 > 1 ? "w-full grid-cols-2" : "mx-auto md:w-1/2 lg:w-2/5"}`}
			>
				{data.rooms
					?.sort((a, b) => (a.enabled && !b.enabled ? -1 : !a.enabled && b.enabled ? 1 : 0))
					.map((room) => (
						<Room key={room.roomId} room={room} />
					))}
			</div>
		</>
	);
};

export default Rooms;
