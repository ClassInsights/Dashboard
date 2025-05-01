import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { isComputer, type Computer } from "../types/Computer";
import { isRoom, type Room } from "../types/Room";
import { useAuth } from "./AuthContext";
import { isLesson, type Lesson } from "../types/Lesson";
import { isSubject } from "../types/Subject";
import { isClass } from "../types/Class";
import { useToast } from "./ToastContext";

export enum RoomSaveStatus {
	PARTIAL = "partial",
	SUCCESS = "success",
	FAIL = "fail",
}

type DataContextType = {
	computers?: Computer[];
	rooms?: Room[];
	lessons?: Lesson[];
	isLoading: boolean;
	getCurrentLesson: (roomId: number) => Lesson | undefined;
	updateRoom: (roomId: number, room: Room) => void;
	saveRooms: (rooms: Room[]) => Promise<RoomSaveStatus>;
	isRoomModalOpen: boolean;
	openRoomModal: () => void;
	closeRoomModal: () => void;
	refreshComputers: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
	const [computers, setComputers] = useState<Computer[] | undefined>(undefined);
	const [rooms, setRooms] = useState<Room[] | undefined>(undefined);
	const [lessons, setLessons] = useState<Lesson[] | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const auth = useAuth();
	const toast = useToast();

	const fetchComputers = useCallback(async () => {
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
						.join(":") ?? "Unbekannt",
			};
		});
	}, [auth.data]);

	const fetchRooms = useCallback(async () => {
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
	}, [auth.data]);

	const fetchLessons = useCallback(async () => {
		// Fetch lessons
		let response = await fetch(`${auth.data?.school.apiUrl}/lessons`, {
			headers: {
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch lessons");
		const lessons = await response.json();

		if (!Array.isArray(lessons) || !lessons.every((lesson) => isLesson(lesson)))
			throw new Error(`Not a valid Lesson, ${JSON.stringify(lessons)}`);

		// Fetch subjects
		response = await fetch(`${auth.data?.school.apiUrl}/subjects`, {
			headers: {
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
		});

		if (!response.ok) throw new Error("Failed to fetch lessons");
		const subjects = await response.json();
		if (!Array.isArray(subjects) || !subjects.every((subject) => isSubject(subject)))
			throw new Error(`Not a valid Subject, ${JSON.stringify(subjects)}`);

		// Fetch classes
		response = await fetch(`${auth.data?.school.apiUrl}/classes`, {
			headers: {
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
		});

		if (!response.ok) throw new Error("Failed to fetch lessons");
		const classes = await response.json();
		if (!Array.isArray(classes) || !classes.every((c) => isClass(c)))
			throw new Error(`Not a valid Class, ${JSON.stringify(classes)}`);

		const finalLessons: Lesson[] = lessons.map((lesson) => {
			const subject = subjects.find((subject) => subject.subjectId === lesson.subjectId);
			const schoolClass = classes.find((c) => c.classId === lesson.classId);
			return {
				...lesson,
				subject: subject?.displayName ?? "Unbekannt",
				class: schoolClass?.displayName ?? "Unbekannt",
			};
		});

		return finalLessons;
	}, [auth.data]);

	const fetchData = useCallback(async () => {
		let computers: Computer[];
		let rooms: Room[];
		// let lessons: Lesson[];

		try {
			computers = await fetchComputers();
			rooms = await fetchRooms();
			// lessons = await fetchLessons();

			setComputers(computers);
			// setLessons(lessons);
			setRooms(rooms);
		} catch (error) {
			console.log("Error fetching data", error);
		}
	}, [fetchComputers, fetchRooms]);

	const getCurrentLesson = useCallback(
		(roomId: number) => {
			if (!lessons) return undefined;
			const currentLesson = lessons.find((lesson) => {
				const startTime = new Date(lesson.start);
				const endTime = new Date(lesson.end);
				const now = new Date();
				return lesson.roomId === roomId && startTime <= now && endTime >= now;
			});
			return currentLesson;
		},
		[lessons],
	);

	const updateRoom = useCallback((roomId: number, room: Room) => {
		setTimeout(() => {
			setRooms((prev) => {
				if (!prev) return prev;
				const newRooms = prev.filter((r) => r.roomId !== roomId);
				newRooms.push(room);
				return newRooms;
			});
		}, 0);
	}, []);

	const saveRooms = useCallback(
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
		},
		[auth.data],
	);

	const closeRoomModal = useCallback(() => {
		setIsRoomModalOpen(false);
		document.body.style.overflow = "auto";
		document.body.style.paddingRight = "";
		document.body.removeEventListener("keydown", hideOnShortcut);
	}, []);

	const hideOnShortcut = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeRoomModal();
			}
		},
		[closeRoomModal],
	);

	const openRoomModal = useCallback(() => {
		setIsRoomModalOpen(true);
		const scrollTop = document.scrollingElement?.scrollTop;
		document.body.style.overflow = "hidden";
		document.body.style.paddingRight = `${Math.abs(window.innerWidth - document.documentElement.clientWidth)}px`;
		if (document.scrollingElement && scrollTop) document.scrollingElement.scrollTop = scrollTop;
		document.body.addEventListener("keydown", hideOnShortcut);
	}, [hideOnShortcut]);

	const refreshComputers = useCallback(async () => {
		if (!auth.data || isRefreshing) return;
		setIsRefreshing(true);

		fetchComputers()
			.then((data) => {
				setComputers(data);
				toast.showMessage("Computer aktualisiert");
			})
			.catch((error) => {
				toast.showMessage("Fehler beim Aktualisieren der Computer", "error");
				console.error("Error fetching computers", error);
			})
			.finally(() => setIsRefreshing(false));
	}, [auth.data, fetchComputers, isRefreshing, toast.showMessage]);

	useEffect(() => {
		if (!auth.data) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		fetchData().then(() => setIsLoading(false));
	}, [auth.data, fetchData]);

	return (
		<DataContext.Provider
			value={{
				computers,
				rooms,
				lessons,
				isLoading,
				getCurrentLesson,
				updateRoom,
				saveRooms,
				isRoomModalOpen,
				openRoomModal,
				closeRoomModal,
				refreshComputers,
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
