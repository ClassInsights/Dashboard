import { createContext, useContext, useEffect, useState } from "react";
import { isComputer, type Computer } from "../types/Computer";
import { isRoom, type Room } from "../types/Room";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

export enum RoomSaveStatus {
	PARTIAL = "partial",
	SUCCESS = "success",
	FAIL = "fail",
}

type Command = "shutdown" | "restart";

type DataContextType = {
	computers?: Computer[];
	rooms?: Room[];
	isLoading: boolean;
	updateRoom: (roomId: number, room: Room) => void;
	saveRooms: (rooms: Room[]) => Promise<RoomSaveStatus>;
	isRoomModalOpen: boolean;
	openRoomModal: () => void;
	closeRoomModal: () => void;
	refreshComputers: (feedback?: boolean) => void;
	refreshRooms: (feedback?: boolean) => void;
	sendCommands: (computersIds: number[], command: Command) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
	const [computers, setComputers] = useState<Computer[] | undefined>(undefined);
	const [rooms, setRooms] = useState<Room[] | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const auth = useAuth();
	const toast = useToast();

	const fetchComputers = async () => {
		const response = await fetch(`${auth.data?.school.apiUrl}/computers`, {
			headers: {
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
		});

		if (!response.ok) throw new Error("Failed to fetch computers");

		const data = await response.json();
		if (!Array.isArray(data) || !data.every((computer) => isComputer(computer)))
			throw new Error(`Not a valid Computer, ${JSON.stringify(data)}`);

		return data.map((computer) => {
			return {
				...computer,
				macAddress:
					computer.macAddress
						.match(/.{1,2}/g)
						?.reverse()
						.join(":") ?? "???",
			};
		});
	};

	const fetchRooms = async () => {
		const response = await fetch(`${auth.data?.school.apiUrl}/rooms`, {
			headers: {
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch rooms");
		const data = await response.json();

		if (!Array.isArray(data) || !data.every((room) => isRoom(room)))
			throw new Error(`Not a valid Room, ${JSON.stringify(data)}`);

		return data.map((room) => (room.regex === "" ? { ...room, regex: null } : room));
	};

	const fetchData = async () => {
		let computers: Computer[];
		let rooms: Room[];

		try {
			computers = await fetchComputers();
			rooms = await fetchRooms();

			setComputers(computers);
			setRooms(rooms);
		} catch (error) {
			console.log("Error fetching data", error);
		}
	};


	const updateRoom = (roomId: number, room: Room) => {
		setTimeout(() => {
			setRooms((prev) => {
				if (!prev) return prev;
				const newRooms = prev.filter((r) => r.roomId !== roomId);
				newRooms.push(room);
				return newRooms;
			});
		}, 0);
	};

	const saveRooms = 
		async (rooms: Room[]) => {
			if (!auth.data) return RoomSaveStatus.FAIL;
			if (rooms.length === 0) return RoomSaveStatus.SUCCESS;

			const successRooms: Room[] = [];
			for (const room of rooms) {
				try {
					const response = await fetch(`${auth.data?.school.apiUrl}/rooms/${room.roomId}`, {
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${auth.data?.accessToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(room),
					});

					if (!response.ok) continue;
					successRooms.push(room);
				} catch {
					console.log("Error saving room", room.roomId);
				}
			}

			setRooms((prev) => {
				if (!prev) return prev;
				const newRooms = prev.filter((r) => !successRooms.some((room) => room.roomId === r.roomId));
				newRooms.push(...successRooms);
				return newRooms;
			});

			if (successRooms.length === 0) return RoomSaveStatus.FAIL;
			if (successRooms.length < rooms.length) return RoomSaveStatus.PARTIAL;
			return RoomSaveStatus.SUCCESS;
		};

	const closeRoomModal = () => {
		setIsRoomModalOpen(false);
		document.body.style.overflow = "auto";
		document.body.style.paddingRight = "";
		document.body.removeEventListener("keydown", hideOnShortcut);
	};

	const hideOnShortcut = 
		(event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeRoomModal();
			}
		};

	const openRoomModal = () => {
		setIsRoomModalOpen(true);
		const scrollTop = document.scrollingElement?.scrollTop;
		document.body.style.overflow = "hidden";
		document.body.style.paddingRight = `${Math.abs(window.innerWidth - document.documentElement.clientWidth)}px`;
		if (document.scrollingElement && scrollTop) document.scrollingElement.scrollTop = scrollTop;
		document.body.addEventListener("keydown", hideOnShortcut);
	};

	const refreshComputers = 
		async (feedback = true) => {
			if (!auth.data || isRefreshing) return;
			setIsRefreshing(true);

			fetchComputers()
				.then((data) => {
					setComputers(data);
					if (feedback) toast.showMessage("Computer aktualisiert");
				})
				.catch((error) => {
					if (feedback) toast.showMessage("Fehler beim Aktualisieren der Computer", "error");
					console.error("Error fetching computers", error);
				})
				.finally(() => setIsRefreshing(false));
		};

	const refreshRooms = 
		async (feedback = true) => {
			if (!auth.data || isRefreshing) return;
			setIsRefreshing(true);

			fetchRooms()
				.then((data) => {
					setRooms(data);
					if (feedback) toast.showMessage("Räume aktualisiert");
				})
				.catch((error) => {
					if (feedback) toast.showMessage("Fehler beim Aktualisieren der Räume", "error");
					console.error("Error fetching rooms", error);
				})
				.finally(() => setIsRefreshing(false));
		};

	const sendCommands = 
		async (computersIds: number[], command: Command) => {
			if (!auth.data || computersIds.length === 0) return;
			try {
				const response = await fetch(`${auth.data?.school.apiUrl}/computers/commands`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${auth.data?.accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(
						computersIds.map((computerId) => ({
							computerId,
							command,
						})),
					),
				});

				if (!response.ok) throw new Error(`Api Status Code: ${response.status}`);
			} catch (error) {
				console.error("Error sending commands", error);
				toast.showMessage(
					computersIds.length > 1 ? "Fehler beim Senden der Befehle" : "Fehler beim Senden des Befehls",
					"error",
				);
			}
		};

	useEffect(() => {
		if (!auth.data) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		fetchData().then(() => setIsLoading(false));
	}, [auth.data]);

	const refresh = async () => {
		setIsRefreshing(true);
		await refreshComputers(false);
		await refreshRooms(false);
		setIsRefreshing(false);
	};

	useEffect(() => {
		const interval = setInterval(
			() => refresh(),
			30 * 1000, // 30 seconds
		);
		return () => clearInterval(interval);
	});

	return (
		<DataContext.Provider
			value={{
				computers,
				rooms,
				isLoading,
				updateRoom,
				saveRooms,
				isRoomModalOpen,
				openRoomModal,
				closeRoomModal,
				refreshComputers,
				refreshRooms,
				sendCommands,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => {
	const context = useContext(DataContext);
	if (context === undefined) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
};
