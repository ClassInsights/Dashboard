import type { MessageType } from "../contexts/ToastContext";

type ToastMessageProps = {
	isVisible: boolean;
	message: string;
	type: MessageType;
};

/** A toast message that is displayed at the top of the screen
 * @param isVisible Whether the toast message is visible
 * @param message The message to display
 * @param type The type of the message (error or success)
 * @returns The toast message component
 */
const ToastMessage = ({ isVisible, message, type = "success" }: ToastMessageProps) => (
	<div
		className={`-translate-x-1/2 fixed top-6 left-1/2 z-50 max-w-2xl transform transition-all duration-500 ${
			isVisible ? "translate-y-0" : "-translate-y-[400%]"
		}`}
	>
		<p
			className={`rounded-full px-5 py-2 text-center text-background shadow-lg ${type === "success" ? "bg-primary" : "bg-error"}`}
		>
			{message}
		</p>
	</div>
);

export default ToastMessage;
