import { useCallback, useState } from "react";
import type { Room as RoomType } from "../types/Room";
import Toggle from "./inputs/Toggle";
import Spacing from "./Spacing";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useData } from "../contexts/DataContext";

const Room = ({ room }: { room: RoomType }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data } = useAuth();
	const { updateRoom } = useData();
	const toast = useToast();

	const saveRoom = useCallback(
		async (active: boolean) => {
			if (!data) return;
			setIsSubmitting(true);
			const result = await fetch(`${data.school.apiUrl}/rooms/${room.roomId}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${data.accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...room, enabled: active }),
			});

			if (!result.ok) throw new Error("Failed to update room");

			updateRoom(room.roomId, { ...room, enabled: active });
		},
		[data, room, updateRoom],
	);

	return (
		<div className="room">
			<h2>{room.displayName}</h2>
			<p>Dieser Raum enthält {room.deviceCount === 0 ? "keine" : room.deviceCount} Computer.</p>
			<Spacing size="md" />
			<div className="flex items-center justify-between">
				<h3>Automationen</h3>
				<Toggle
					disabled={isSubmitting}
					checked={room.enabled}
					onChange={(checked) => {
						saveRoom(checked)
							.then(() => toast.showMessage("Raum erfolgreich gespeichert"))
							.catch(() => toast.showMessage("Fehler beim Speichern des Raums", "error"))
							.finally(() => setIsSubmitting(false));
					}}
				/>
			</div>
			<p>Deaktiviere jegliche ClassInsights Automationen.</p>
		</div>
	);
};

export default Room;
