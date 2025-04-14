import Badge from "../components/Badge";
import Headline from "../components/Headline";
import Spacing from "../components/Spacing";
import ComputerSVG from "../assets/svg/computer.svg?react";
import RoomSVG from "../assets/svg/room.svg?react";
import CloseSVG from "../assets/svg/close.svg?react";
import ShutDownSVG from "../assets/svg/shutdown.svg?react";
import RestartSVG from "../assets/svg/restart.svg?react";
import ComputerList from "../components/ComputerList";

const Computer = () => {
	const Computer = <ComputerSVG width={20} className="shrink-0 fill-primary" />;
	const Room = <RoomSVG width={20} className="shrink-0 fill-primary" />;
	const Close = <CloseSVG width={20} className="shrink-0" />;

	return (
		<>
			<Headline
				title="Registrierte Computer"
				mobileTitle="Computer"
				subtitle="Nachfolgend finden Sie eine Übersicht aller registrierten Computer Ihrer Schule. Sie haben die Möglichkeit, gezielt nach Computern zu suchen, Filteroptionen zu nutzen und die Sortierung individuell anzupassen."
				backLink="/"
			/>
			<h2>Computerliste</h2>
			<Spacing size="sm" />
			<div className="badge-list">
				<Badge text="OG2-DV2" headIcon={Room} tailIcon={Close} />
				<Badge text="OG2-DV1" headIcon={Room} />
				<Badge text="OG3-DV6" headIcon={Room} />
				<Badge text="OG3-DV5" headIcon={Room} />
				<Badge text="OG1-DV3" headIcon={Room} />
				<Badge text="OG1-DV4" headIcon={Room} />
				<Badge text="Aktive Computer" headIcon={Computer} />
				<Badge text="Online Computer ohne Unterricht" headIcon={Computer} />
			</div>
			<Spacing size="md" />
			<h3>Aktionen</h3>
			<div className="badge-list">
				<Badge text="DV6-13 neustarten" headIcon={<RestartSVG className="shrink-0 fill-primary" />} />
				<Badge text="DV6-13 herunterfahren" headIcon={<ShutDownSVG className="shrink-0 fill-primary" />} />
			</div>
			<Spacing size="md" />
			<ComputerList />
		</>
	);
};

export default Computer;
