import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Computer } from "../types/Computer";
import { useData } from "./DataContext";

type SearchContextType = {
	result: SearchResult[];
	generateResult: (value: string) => void;
	isVisible: boolean;
	show: () => void;
	hide: () => void;
};

type SearchResult = Computer & {
	room: string;
	text: string;
	matchStart: number;
	matchLength: number;
};

const SearchContext = createContext<undefined | SearchContextType>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
	const [result, setResult] = useState<SearchResult[]>([]);
	const [isVisible, setIsVisible] = useState(false);

	const { computers, rooms } = useData();

	const generateResult = useCallback(
		(value: string) => {
			const searchTerm = value.trim().toLowerCase();
			if (searchTerm.length < 2) {
				setResult([]);
				return;
			}

			if (!computers || computers.length === 0) return;

			if (!searchTerm) {
				setResult([]);
				return;
			}

			const filteredComputers = computers.filter((computer) => {
				const nameMatch = computer.name.toLowerCase().includes(searchTerm);
				const ipMatch = computer.ipAddress.toLowerCase().includes(searchTerm);
				const macMatch = computer.macAddress.toLowerCase().includes(searchTerm);

				return nameMatch || ipMatch || macMatch;
			});

			const searchResults: SearchResult[] = filteredComputers.map((computer) => {
				const nameMatch = computer.name.toLowerCase().indexOf(searchTerm);
				const ipMatch = computer.ipAddress.toLowerCase().indexOf(searchTerm);
				const macMatch = computer.macAddress.toLowerCase().indexOf(searchTerm);

				const matchStart = Math.min(...[nameMatch, ipMatch, macMatch].filter((match) => match >= 0));

				let text = "";
				if (nameMatch >= 0) text = computer.name;
				else if (ipMatch >= 0) text = computer.ipAddress;
				else if (macMatch >= 0) text = computer.macAddress;

				const matchLength = searchTerm.length;

				const room = rooms?.find((room) => room.roomId === computer.roomId)?.displayName ?? "Unbekannt";

				return {
					...computer,
					room,
					text,
					matchStart,
					matchLength,
				};
			});

			const sortedResults = searchResults.sort((a, b) => (a.matchLength > b.matchLength ? -1 : 1)).slice(0, 5);
			setResult(sortedResults);
		},
		[computers, rooms],
	);

	const show = useCallback(() => setTimeout(() => setIsVisible(true), 0), []);

	const hide = useCallback(() => {
		setTimeout(() => {
			setResult([]);
			setIsVisible(false);
		}, 0);
	}, []);

	const hideOnShortcut = useCallback(
		(e: KeyboardEvent) => {
			if (!isVisible) return;
			if (e.key === "Escape") hide();
			if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				hide();
			}
		},
		[hide, isVisible],
	);

	const openOnShortcut = useCallback(
		(e: KeyboardEvent) => {
			if (isVisible) return;
			if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				show();
			}
		},
		[show, isVisible],
	);

	useEffect(() => {
		window.addEventListener("keydown", openOnShortcut);
		window.addEventListener("keydown", hideOnShortcut);
	});

	return (
		<SearchContext.Provider value={{ result, generateResult, isVisible, show, hide }}>
			{children}
		</SearchContext.Provider>
	);
};

export const useSearch = () => {
	const context = useContext(SearchContext);
	if (context === undefined) {
		throw new Error("useSearch must be used within a SearchProvider");
	}
	return context;
};
