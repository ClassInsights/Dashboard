import { createContext, useContext, useState } from "react";
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

	const open = (computer: Computer) => {
		setData(computer);
		setIsVisible(true);
	};

	const close = () => setIsVisible(false);

	return <ComputerContext.Provider value={{ isVisible, open, close, data }}>{children}</ComputerContext.Provider>;
};

export const useComputer = () => {
	const context = useContext(ComputerContext);
	if (context === undefined) {
		throw new Error("useComputer must be used within a ComputerProvider");
	}
	return context;
};
