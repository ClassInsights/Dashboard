import { useComputer } from "../contexts/ComputerContext";
import CloseSVG from "../assets/svg/close.svg?react";
import ComputerSVG from "../assets/svg/computer.svg?react";
import ShutDownSVG from "../assets/svg/shutdown.svg?react";
import RestartSVG from "../assets/svg/restart.svg?react";
import { useData } from "../contexts/DataContext";
import { useMemo } from "react";
import Spacing from "./Spacing";
import Badge from "./Badge";

const ComputerModal = () => {
	const computer = useComputer();
	const data = useData();

	const room = useMemo(
		() => data.rooms?.find((room) => room.roomId === computer.data?.roomId) ?? undefined,
		[data.rooms, computer.data?.roomId],
	);

	if (!computer.isVisible || !computer.data) return null;

	return (
		<dialog className="fixed top-0 z-20 flex h-dvh w-screen items-end justify-center bg-transparent md:items-center">
			<div
				className="h-full w-full cursor-pointer bg-black opacity-30"
				onClick={computer.close}
				onKeyDown={computer.close}
			/>
			<div className="absolute bottom-0 h-[88%] w-full rounded-t-2xl bg-background p-4 lg:bottom-auto lg:h-auto lg:w-3/4 lg:rounded-2xl xl:w-1/2 2xl:w-2/5">
				{/* Title Bar */}
				<div className="flex items-center justify-between bg-background">
					<CloseSVG width={20} className="shrink-0 opacity-0" />
					<div className="flex items-center gap-2">
						<ComputerSVG width={20} className="shrink-0 fill-black" />
						<p className="font-medium">Computer Details</p>
					</div>
					<CloseSVG width={20} className="shrink-0 cursor-pointer fill-black" onClick={computer.close} />
				</div>
				{/* Certificate Content */}
				<div className="scrollbar relative h-full max-h-[90svh] overflow-y-scroll px-3 pt-12 pb-16 lg:px-14 lg:pt-10 lg:pb-6">
					<h2>Computer {computer.data.name}</h2>
					<Spacing size="sm" />
					{room && <p>im Raum {room.displayName}</p>}
					<Spacing size="md" />
					<div className="mobile-computer-stats md:computer-stats grid gap-x-4 gap-y-1">
						<p>Status:</p>
						<p>{computer.data.online ? "Online" : "Offline"}</p>
						<div className="hidden md:block" />
						<p>Letzter Nutzer:</p>
						<p>{computer.data.lastUser}</p>
						<p>Name:</p>
						<p>{computer.data.name}</p>
						<div className="hidden md:block" />
						<p>Client Version:</p>
						<p>{computer.data.version}</p>
						<p>IP:</p>
						<p>{computer.data.ipAddress}</p>
						<div className="hidden md:block" />
						<p>Zuletzt online:</p>
						<p>{`${new Date(computer.data.lastSeen).toLocaleDateString("de-DE", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})} ${new Date(computer.data.lastSeen).toLocaleTimeString("de-DE", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: false,
						})} Uhr`}</p>
						<p>Mac:</p>
						<p>
							{computer.data.macAddress
								.toString()
								.match(/.{1,2}/g)
								?.reverse()
								.join(":") ?? ""}
						</p>
					</div>
					<Spacing size="md" />
					<div className="absolute right-0 bottom-0 flex justify-end pr-14 pb-16 lg:static lg:p-0">
						<div className="badge-list">
							<Badge text="Neustarten" headIcon={<RestartSVG className="shrink-0 fill-primary" />} />
							<Badge text="Herunterfahren" headIcon={<ShutDownSVG className="shrink-0 fill-primary" />} />
						</div>
					</div>
				</div>
			</div>
		</dialog>
	);
};

export default ComputerModal;
