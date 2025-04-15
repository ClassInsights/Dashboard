import { Fragment, useCallback, useMemo, useState } from "react";
import { useData } from "../contexts/DataContext";
import Spacing from "./Spacing";
import ShutDownSVG from "../assets/svg/shutdown.svg?react";
import RestartSVG from "../assets/svg/restart.svg?react";
import Badge from "./Badge";
import Checkbox, { type CheckboxState } from "./inputs/Checkbox";
import { useComputer } from "../contexts/ComputerContext";

const ComputerList = () => {
	const [selectedComputers, setSelectedComputers] = useState<number[]>([]);

	const data = useData();
	const computerModal = useComputer();

	const computers = useMemo(() => data.computers, [data.computers]);
	const rooms = useMemo(() => data.rooms, [data.rooms]);

	const handleGlobalCheckbox = useCallback(
		(state: CheckboxState) => {
			if (!computers) return;
			switch (state) {
				case "selected":
					setTimeout(() => setSelectedComputers(computers.map((computer) => computer.computerId)), 0);
					break;
				case "deselected":
					setTimeout(() => setSelectedComputers([]), 0);
					break;
				case "remove":
					setTimeout(() => setSelectedComputers([]), 0);
					break;
			}
		},
		[computers],
	);

	const handleCheckbox = useCallback((computerId: number, state: CheckboxState) => {
		switch (state) {
			case "selected":
				setTimeout(
					() =>
						setSelectedComputers((prev) => {
							if (prev.includes(computerId)) return prev;
							return [...prev, computerId];
						}),
					0,
				);
				break;
			case "deselected":
				setTimeout(() => setSelectedComputers((prev) => prev.filter((id) => id !== computerId)), 0);
				break;
			default:
				break;
		}
	}, []);

	return (
		<>
			<h3>Aktionen</h3>
			<div className="min-h-12">
				{selectedComputers.length > 0 ? (
					<div className="badge-list">
						<Badge
							text={`${
								selectedComputers.length === 1
									? computers?.filter((computer) => computer.computerId === selectedComputers[0])[0].name ?? "1"
									: `${selectedComputers.length} Computer`
							} neustarten`}
							headIcon={<RestartSVG className="shrink-0 fill-primary" />}
						/>
						<Badge
							text={`${
								selectedComputers.length === 1
									? computers?.filter((computer) => computer.computerId === selectedComputers[0])[0].name ?? "1"
									: `${selectedComputers.length} Computer`
							} herunterfahren`}
							headIcon={<ShutDownSVG className="shrink-0 fill-primary" />}
						/>
					</div>
				) : (
					<p>Wähle mindestens einen Computer aus.</p>
				)}
			</div>
			<Spacing size="md" />
			<p>{computers?.length} Computer gefunden</p>
			<Spacing size="sm" />
			<div className="computer-table grid items-center gap-x-4 gap-y-3 overflow-x-scroll">
				<Checkbox
					state={
						selectedComputers.length === 0
							? "deselected"
							: selectedComputers.length === computers?.length
								? "selected"
								: "remove"
					}
					onChange={handleGlobalCheckbox}
				/>
				<p>Name</p>
				<p>Raum</p>
				<p>IP-Adresse</p>
				<p>Mac-Adresse</p>
				<div />
				<div className="col-span-6 col-start-1 border-container border-t-2" />
				{computers?.map((computer) => {
					const room = rooms?.find((room) => room.roomId === computer.roomId);
					const isSelected = selectedComputers.includes(computer.computerId);
					return (
						<Fragment key={computer.ipAddress}>
							<Checkbox
								state={isSelected ? "selected" : "deselected"}
								onChange={(state) => handleCheckbox(computer.computerId, state)}
							/>
							<div className="flex items-center gap-[0.6rem]">
								<div className={`h-[0.6rem] w-[0.6rem] rounded-full ${computer.online ? "bg-success" : "bg-error"}`} />
								<p>{computer.name}</p>
							</div>
							<p>{room?.displayName ?? "Unbekannter Raum"}</p>
							<p>{computer.ipAddress}</p>
							<p>
								{computer.macAddress
									.toString()
									.match(/.{1,2}/g)
									?.reverse()
									.join(":") ?? ""}
							</p>
							<p
								className="cursor-pointer text-primary"
								onClick={() => computerModal.open(computer)}
								onKeyDown={() => computerModal.open(computer)}
							>
								Details
							</p>
						</Fragment>
					);
				})}
				<div className="col-span-6 col-start-1 border-container border-b-2" />
			</div>
		</>
	);
};

export default ComputerList;
