import { createContext, useCallback, useContext, useState } from "react";
import ToastMessage from "../components/ToastMessage";

export type ToastType = {
	message: string;
	type: MessageType;
	isVisible: boolean;
};

export type MessageType = "error" | "success";

type ToastContextType = {
	/** Show a toast message
	 * @param message The message to display
	 * @param type The type of the message (error or success)
	 * @param duration The duration of the message in milliseconds (default: 4000)
	 */
	showMessage: (message: string, type?: MessageType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [toast, setToast] = useState<ToastType>({ message: "", isVisible: false, type: "success" });
	const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);

	/** Show a toast message */
	const showMessage = useCallback(
		(message: string, type: MessageType = "success", duration?: number) => {
			if (toast.isVisible) {
				setToast((prev) => ({ ...prev, isVisible: false }));
				clearTimeout(timeoutId);
				setTimeout(() => {
					setToast({ message, type, isVisible: true });
					const newTimeoutId = setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), duration ?? 4000);
					setTimeoutId(newTimeoutId);
				}, 500);
				return;
			}

			setToast({ message, type, isVisible: true });
			if (timeoutId) clearTimeout(timeoutId);
			const newTimeoutId = setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), duration ?? 4000);
			setTimeoutId(newTimeoutId);
		},
		[toast.isVisible, timeoutId],
	);

	return (
		<ToastContext.Provider value={{ showMessage }}>
			{children}
			<ToastMessage isVisible={toast.isVisible} message={toast.message} type={toast.type} />
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) throw new Error("useToast must be used within a ToastProvider");
	return context;
};
