import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useData } from "../contexts/DataContext";
import Spacing from "./Spacing";
import ShutDownSVG from "../assets/svg/shutdown.svg?react";
import RestartSVG from "../assets/svg/restart.svg?react";
import Badge from "./Badge";
import Checkbox, { type CheckboxState } from "./inputs/Checkbox";
import { useComputer } from "../contexts/ComputerContext";
import type { Computer } from "../types/Computer";
import Sorter from "./inputs/Sorter";
import FilterField from "./inputs/FilterField";

enum SortValue {
	NAME = "name",
	ROOM = "room",
	IP = "ip",
	MAC = "mac",
}

enum Order {
	ASC = "asc",
	DESC = "desc",
	NONE = "none",
}

type Sort = {
	order: Order;
	value: SortValue;
};

enum FilterType {
	ROOM = "room",
	STATUS = "status",
}

type Filter = {
	type: FilterType;
	detail?: string;
};

function isSort(obj: unknown): obj is Sort {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"order" in obj &&
		typeof obj.order === "string" &&
		Object.values(Order).includes(obj.order as Order) &&
		"value" in obj &&
		typeof obj.value === "string" &&
		Object.values(SortValue).includes(obj.value as SortValue)
	);
}

function isFilter(obj: unknown): obj is Filter {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"type" in obj &&
		typeof obj.type === "string" &&
		Object.values(FilterType).includes(obj.type as FilterType) &&
		("detail" in obj ? typeof obj.detail === "string" || typeof obj.detail === "boolean" : true)
	);
}

const ComputerList = () => {
	const [computers, setComputers] = useState<Computer[]>([]);
	const [originalComputers, setOriginalComputers] = useState<Computer[]>([]);
	const [selectedComputers, setSelectedComputers] = useState<number[]>([]);

	const [sorts, setSorts] = useState<Sort[]>([]);
	const [filters, setFilters] = useState<Filter[]>([]);

	const data = useData();
	const computerModal = useComputer();

	const rooms = useMemo(() => data.rooms, [data.rooms]);

	const updateSorts = useCallback((order: Order, value: SortValue) => {
		setTimeout(() => {
			setSorts((prev) => {
				if (prev.includes({ order, value })) return prev;
				const newSorts = prev.filter((sort) => sort.value !== value);
				if (order === Order.NONE) {
					localStorage.setItem("sorts", JSON.stringify(newSorts));
					return newSorts;
				}
				localStorage.setItem("sorts", JSON.stringify([...newSorts, { order, value }]));
				return [...newSorts, { order, value }];
			});
		}, 0);
	}, []);

	const updateFilters = useCallback((type: FilterType, isActive: boolean, detail?: string) => {
		setTimeout(() => {
			setFilters((prev) => {
				if (isActive && prev.includes({ type, detail })) return prev;
				const newFilters = prev.filter((filter) => filter.type !== type);
				if (!isActive) {
					localStorage.setItem("filters", JSON.stringify(newFilters));
					return newFilters;
				}
				localStorage.setItem("filters", JSON.stringify([...newFilters, { type, detail }]));
				return [...newFilters, { type, detail }];
			});
		}, 0);
	}, []);

	const handleGlobalCheckbox = useCallback(
		(state: CheckboxState) => {
			if (!computers) return;
			setTimeout(() => {
				switch (state) {
					case "selected":
						setSelectedComputers(
							computers.filter((computer) => computer.online).map((computer) => computer.computerId),
						);
						break;
					case "deselected":
					case "remove":
						setSelectedComputers([]);
						break;
				}
			});
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

	useEffect(() => {
		if (!data.computers) return;

		setOriginalComputers(data.computers);
		const sorts = localStorage.getItem("sorts");
		if (!sorts) setComputers(data.computers);
		else {
			try {
				const parsedSorts = JSON.parse(sorts);

				if (!Array.isArray(parsedSorts) || !parsedSorts.every((sort) => isSort(sort))) {
					localStorage.removeItem("sorts");
					setComputers(data.computers);
					return;
				}

				setSorts(parsedSorts);
			} catch {
				localStorage.removeItem("sorts");
				setComputers(data.computers);
			}
		}

		const filters = localStorage.getItem("filters");
		if (!filters) return;

		try {
			const parsedFilters = JSON.parse(filters);

			if (!Array.isArray(parsedFilters) || !parsedFilters.every((filter) => isFilter(filter))) {
				localStorage.removeItem("filters");
				return;
			}

			setFilters(parsedFilters);
		} catch {
			localStorage.removeItem("filters");
		}
	}, [data.computers]);

	useEffect(() => {
		let computersToSort = [...originalComputers];

		if (filters.length > 0) {
			computersToSort = computersToSort.filter((computer) => {
				return filters.every((filter) => {
					switch (filter.type) {
						case FilterType.ROOM: {
							const room = rooms?.find((room) => room.roomId === computer.roomId);
							if (!room) return false;
							return room.displayName === filter.detail;
						}
						case FilterType.STATUS:
							return computer.online ? "online" : "offline" === filter.detail;
						default:
							return true;
					}
				});
			});
		}

		computersToSort.sort((a, b) => {
			for (const sort of sorts) {
				let compareResult = 0;

				switch (sort.value) {
					case SortValue.NAME:
						compareResult = (a.name || "").localeCompare(b.name || "");
						break;
					case SortValue.IP:
						compareResult = (a.ipAddress || "").localeCompare(b.ipAddress || "");
						break;
					case SortValue.MAC:
						compareResult = (a.macAddress || "").localeCompare(b.macAddress || "");
						break;
					case SortValue.ROOM: {
						const roomA = rooms?.find((room) => room.roomId === a.roomId);
						const roomB = rooms?.find((room) => room.roomId === b.roomId);

						compareResult = (roomA?.displayName || "").localeCompare(roomB?.displayName || "");
						break;
					}
					default:
						compareResult = 0;
				}

				const finalCompareResult = sort.order === Order.ASC ? compareResult : -compareResult;
				if (finalCompareResult !== 0) {
					return finalCompareResult;
				}
			}
			return 0;
		});

		setTimeout(() => setComputers(computersToSort), 0);
	}, [originalComputers, filters, sorts, rooms]);

	return (
		<>
			<h2>Computerliste</h2>
			<Spacing size="sm" />
			<h3>Verfügbare Filter</h3>
			<Spacing size="sm" />
			<div className="badge-list">
				{rooms
					?.map((room) => room.displayName)
					.map((roomName) => (
						<FilterField
							key={roomName}
							label={`Raum ${roomName}`}
							active={
								filters.filter((filter) => filter.type === FilterType.ROOM && filter.detail === roomName).length > 0
							}
							onUpdate={(value) => updateFilters(FilterType.ROOM, value, roomName)}
						/>
					))}
				{["Online", "Offline"].map((statusName) => (
					<FilterField
						key={statusName}
						label={statusName}
						active={
							filters.filter(
								(filter) => filter.type === FilterType.STATUS && filter.detail === statusName.toLowerCase(),
							).length > 0
						}
						onUpdate={(value) => updateFilters(FilterType.STATUS, value, statusName.toLowerCase())}
					/>
				))}
			</div>
			<Spacing size="md" />
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
					<p>Wähle mindestens einen aktiven Computer aus.</p>
				)}
			</div>
			<Spacing size="md" />
			{computers?.length === 0 ? (
				filters.length > 0 ? (
					<div>
						<b>Mit den aktuellen Filtern wurde kein Computer gefunden.</b>
						<button
							type="button"
							onClick={() => {
								setFilters([]);
								localStorage.removeItem("filters");
							}}
							className="px-4 py-2 text-primary"
						>
							Alle Filter entfernen
						</button>
					</div>
				) : (
					<b>Es wurde kein Computer gefunden.</b>
				)
			) : (
				<>
					<p>
						{computers?.length} Computer gefunden{" "}
						{filters.length > 0 && `(${`${filters.length} ${filters.length === 1 ? "aktiver" : "aktive"} Filter`})`}
					</p>
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
						{[
							["Name", SortValue.NAME],
							["Raum", SortValue.ROOM],
							["IP-Adresse", SortValue.IP],
							["Mac-Adresse", SortValue.MAC],
						].map(([label, value]) => {
							const currentSort = sorts.find((sort) => sort.value === value);
							const order = currentSort ? currentSort.order : Order.NONE;
							return (
								<div key={label} className="flex items-center gap-2">
									<p>{label}</p>
									<Sorter order={order} onChange={(order) => updateSorts(order, value as SortValue)} />
								</div>
							);
						})}
						<div />
						<div className="col-span-6 col-start-1 border-container border-t-2" />
						{computers?.slice(0, Math.min(25, computers.length)).map((computer) => {
							const room = rooms?.find((room) => room.roomId === computer.roomId);
							const isSelected = selectedComputers.includes(computer.computerId);
							return (
								<Fragment key={computer.ipAddress}>
									<Checkbox
										disabled={!computer.online}
										state={isSelected ? "selected" : "deselected"}
										onChange={(state) => handleCheckbox(computer.computerId, state)}
									/>
									<div className="flex items-center gap-[0.6rem]">
										<div
											className={`h-[0.6rem] w-[0.6rem] rounded-full ${computer.online ? "bg-success" : "bg-error"}`}
										/>
										<p>{computer.name}</p>
									</div>
									<p>{room?.displayName ?? "Unbekannter Raum"}</p>
									<p>{computer.ipAddress}</p>
									<p>{computer.macAddress}</p>
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
			)}
		</>
	);
};

export default ComputerList;
