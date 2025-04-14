import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { isComputer, type Computer } from "../types/Computer";
import { isRoom, type Room } from "../types/Room";
import { useAuth } from "./AuthContext";

type DataContextType = {
	computers?: Computer[];
	rooms?: Room[];
	isLoading: boolean;
	// isRefreshing: boolean;
};

const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
	const [computers, setComputers] = useState<Computer[] | undefined>(undefined);
	const [rooms, setRooms] = useState<Room[] | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);

	const auth = useAuth();

	const fetchComputers = useCallback(async () => {
		const response = await fetch(`${auth.data?.school.apiUrl}/computers`, {
			headers: {
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
		});

		if (!response.ok) throw new Error("Failed to fetch computers");

		const data = await response.json();
		if (!Array.isArray(data) || !data.every((computer) => isComputer(computer)))
			throw new Error("Invalid response format");

		return data;
	}, [auth.data]);

	const fetchRooms = useCallback(async () => {
		const response = await fetch(`${auth.data?.school.apiUrl}/rooms`, {
			headers: {
				Authorization: `Bearer ${auth.data?.accessToken}`,
			},
		});
		if (!response.ok) throw new Error("Failed to fetch rooms");
		const data = await response.json();

		if (!Array.isArray(data) || !data.every((room) => isRoom(room))) throw new Error("Invalid response format");

		return data;
	}, [auth.data]);

	useEffect(() => {
		if (!auth.data) return;

		fetchComputers()
			.then((data) => setComputers(data))
			.catch(() => setIsLoading(false));

		fetchRooms()
			.then((data) => setRooms(data))
			.catch(() => setIsLoading(false));

		setIsLoading(false);
	}, [auth.data, fetchComputers, fetchRooms]);

	return <DataContext.Provider value={{ computers, rooms, isLoading }}>{children}</DataContext.Provider>;
};

export const useData = () => {
	const context = useContext(DataContext);
	if (context === undefined) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
};
