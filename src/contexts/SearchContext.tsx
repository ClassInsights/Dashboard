import { createContext, useCallback, useContext, useState } from "react";
import SearchBar from "../components/Searchbar";

type SearchContextType = {
	isVisible: boolean;
	show: () => void;
	hide: () => void;
};

const SearchContext = createContext<undefined | SearchContextType>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
	const [isVisible, setIsVisible] = useState(false);

	const show = useCallback(() => {
		setIsVisible(true);
	}, []);

	const hide = useCallback(() => {
		setIsVisible(false);
	}, []);

	return (
		<SearchContext.Provider value={{ isVisible, show, hide }}>
			<SearchBar />
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
