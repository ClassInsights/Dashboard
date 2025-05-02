import Badge from "../components/Badge";
import Headline from "../components/Headline";
import ComputerSVG from "../assets/svg/computer.svg?react";
import RoomSVG from "../assets/svg/room.svg?react";
import Spacing from "../components/Spacing";
import ArrowSVG from "../assets/svg/arrow.svg?react";
import LogoutSVG from "../assets/svg/logout.svg?react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Role } from "../types/AccessToken";

const Home = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const data = useData();

	return (
		<>
			<div className="relative">
				<div
					className="-top-10 absolute flex w-max cursor-pointer items-center gap-1.5 pb-2"
					onClick={auth.logout}
					onKeyDown={auth.logout}
				>
					<p className="text-primary">Abmelden</p>
					<LogoutSVG width={20} className="shrink-0 fill-primary" />
				</div>
			</div>
			<Headline
				title={`Willkommen, ${auth.data?.name}.`}
				mobileTitle={`Hey, ${auth.data?.name}.`}
				subtitle="Dies ist der zentraler Ort für das gesamte ClassInsights Ökosystem. Hier können Sie interessante Insights über die Computer Ihrer Schule herausfinden."
			/>
			<div className="badge-list">
				<Badge
					text={`${data.computers?.filter((computer) => computer.online).length} / ${data.computers?.length} aktiv`}
					headIcon={<ComputerSVG width={20} className="shrink-0 fill-primary" />}
					onClick={() => navigate("/computer")}
				/>
				<Badge
					text={`${data.rooms?.length} ${data.rooms?.length === 1 ? "Raum" : "Räume"}`}
					headIcon={<RoomSVG width={20} className="shrink-0 fill-primary" />}
					onClick={() => navigate("/räume")}
				/>
			</div>
			<Spacing />
			<h2>Navigation</h2>
			<Spacing size="sm" />
			<p>Hier sind alle Unterseiten dieses Dashboards aufgelistet. (Auch in der Navigationsleiste oben vorzufinden)</p>
			{[
				[
					"Computer Liste",
					"Hier sind alle registrierten Computer Ihrer Schule aufgelistet. Sie können Details über Computer erfahren, Filtern und die Sortierung anpassen.",
					"Liste der Computer",
					"/computer",
				],
				[
					"Registrierte Räume",
					"Hier sind alle Räume mit Computern aufgelistet. Sie können die aktuelle Unterrichtsstunden anzeigen und Automationen für jeden Raum verwalten.",
					"Räume",
					"/räume",
				],
				[
					"ClassInsights Konfiguration",
					"Sie als Administrator können hier alle möglichen Einstellungen für das ClassInsights Ökosystem tätigen.",
					"Konfiguration",
					"/konfiguration",
				],
			].map(([title, description, linkText, link]) => {
				if (title === "ClassInsights Konfiguration" && !auth.data?.roles.includes(Role.ADMIN)) return null;
				return (
					<div key={title}>
						<Spacing size="md" />
						<h3>{title}</h3>
						<Spacing size="sm" />
						<p className="text-print-width">{description}</p>
						<Spacing size="sm" />
						<Link to={link} className="flex w-max items-center gap-1.5 pb-2">
							<p className="text-primary">{linkText}</p>
							<ArrowSVG className="shrink-0 fill-primary" />
						</Link>
					</div>
				);
			})}
		</>
	);
};

export default Home;
