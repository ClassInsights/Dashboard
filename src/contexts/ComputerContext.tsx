import { createContext, useCallback, useContext, useState } from "react";
import type { Computer } from "../types/Computer";

type ComputerContextType = {
	isVisible: boolean;
	open: (computer: Computer) => void;
	close: () => void;
	data?: Computer;
};

const ComputerContext = createContext<ComputerContextType | undefined>(undefined);
export const ComputerProvider = ({ children }: { children: React.ReactNode }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [data, setData] = useState<Computer | undefined>(undefined);

	const hideOnEscape = useCallback((e: KeyboardEvent) => {
		if (e.key === "Escape") {
			close();
		}
	}, []);

	const open = (computer: Computer) => {
		setData(computer);
		setIsVisible(true);
		const scrollTop = document.scrollingElement?.scrollTop;
		document.body.style.overflow = "hidden";
		document.body.style.paddingRight = `${Math.abs(window.innerWidth - document.documentElement.clientWidth)}px`;
		if (document.scrollingElement && scrollTop) document.scrollingElement.scrollTop = scrollTop;
		document.body.addEventListener("keydown", hideOnEscape);
	};

	const close = useCallback(() => {
		setIsVisible(false);
		setData(undefined);
		document.body.style.overflow = "auto";
		document.body.style.paddingRight = "";
		document.body.removeEventListener("keydown", hideOnEscape);
	}, [hideOnEscape]);

	return <ComputerContext.Provider value={{ isVisible, open, close, data }}>{children}</ComputerContext.Provider>;
};

export const useComputer = () => {
	const context = useContext(ComputerContext);
	if (context === undefined) {
		throw new Error("useComputer must be used within a ComputerProvider");
	}
	return context;
};
