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

				const room = rooms?.find((room) => room.roomId === computer.roomId)?.displayName ?? "???";

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

	useEffect(() => {
		const handleGlobalKeyDown = (event: KeyboardEvent) => {
			if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
				event.preventDefault();
				setIsVisible((prev) => !prev);
				return;
			}

			if (event.key !== "Escape") return;

			setIsVisible((prev) => {
				if (prev) return false;
				return prev;
			});
		};

		window.addEventListener("keydown", handleGlobalKeyDown);
		return () => {
			window.removeEventListener("keydown", handleGlobalKeyDown);
		};
	}, []);

	useEffect(() => {
		if (isVisible) {
			const scrollTop = document.scrollingElement?.scrollTop;
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = `${Math.abs(window.innerWidth - document.documentElement.clientWidth)}px`;
			if (document.scrollingElement && scrollTop) document.scrollingElement.scrollTop = scrollTop;
			return;
		}

		setResult([]);
		document.body.style.overflow = "auto";
		document.body.style.paddingRight = "";
	}, [isVisible]);

	const show = useCallback(() => setIsVisible(true), []);
	const hide = useCallback(() => setIsVisible(false), []);

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
