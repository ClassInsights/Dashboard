import { Fragment, useCallback, useMemo, useState } from "react";
import { RoomSaveStatus, useData } from "../contexts/DataContext";
import DeleteSVG from "../assets/svg/delete.svg?react";
import TextInput from "./inputs/TextInput";
import SaveSVG from "../assets/svg/save.svg?react";
import RefreshSVG from "../assets/svg/refresh.svg?react";
import PlusSVG from "../assets/svg/plus.svg?react";
import type { Room } from "../types/Room";
import AddRoomModal from "./AddRoomModal";
import RegexConverter from "./RegexConverter";
import Spacing from "./Spacing";
import RegexTester from "./RegexTester";
import { useToast } from "../contexts/ToastContext";

const RoomTable = () => {
	const [updatedRooms, setUpdatedRooms] = useState<Room[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);

	const data = useData();
	const toast = useToast();

	const updateRoom = (room: Room, regex: string) => {
		const originalRoom = data.rooms?.find((r) => r.roomId === room.roomId);
		if (!originalRoom) return;

		const updatedRoom = { ...room, regex };

		if (regex === originalRoom.regex) {
			setUpdatedRooms((prev) => prev.filter((r) => r.roomId !== room.roomId));
			return;
		}

		setUpdatedRooms((prev) => {
			if (prev.some((r) => r.roomId === room.roomId))
				return prev.map((r) => (r.roomId === room.roomId ? updatedRoom : r));

			prev[prev.indexOf(room)] = updatedRoom;
			return prev;
		});
	};

	const addRoom = (roomId: number) =>
		setUpdatedRooms((prev) => [...prev, { ...data.rooms?.find((room) => room.roomId === roomId), regex: "" } as Room]);

	const deleteRoom = async (roomId: number) => {
		if (isProcessing) return;
		const room = data.rooms?.find((room) => room.roomId === roomId);
		if (!room) return;
		if (!room.regex) {
			setUpdatedRooms((prev) => prev.filter((room) => room.roomId !== roomId));
			toast.showMessage("Raum erfolgreich gelöscht");
			return;
		}

		setIsProcessing(true);

		const result = await data.saveRooms([{ ...room, regex: null }]);
		if (result === RoomSaveStatus.SUCCESS) toast.showMessage("Raum erfolgreich gelöscht");
		else toast.showMessage("Fehler beim Löschen des Raums", "error");

		setUpdatedRooms((prev) => prev.filter((room) => room.roomId !== roomId));
		setIsProcessing(false);
	};

	const saveRooms = useCallback(async () => {
		setIsProcessing(true);
		const response = await data.saveRooms(updatedRooms.filter((room) => room.regex));

		if (response === RoomSaveStatus.SUCCESS) toast.showMessage("Räume erfolgreich gespeichert");
		else if (response === RoomSaveStatus.PARTIAL) toast.showMessage("Manche Räume konnten nicht gespeichert werden");
		else toast.showMessage("Fehler beim Speichern der Räume", "error");

		setIsProcessing(false);
		setUpdatedRooms([]);
	}, [data, updatedRooms, toast.showMessage]);

	const rooms = useMemo(() => {
		if (!data.rooms) return [];
		const unchangedRooms = data.rooms
			.filter((room) => !updatedRooms.some((r) => r.roomId === room.roomId))
			.filter((room) => room.regex !== null);

		return [...unchangedRooms, ...updatedRooms];
	}, [data.rooms, updatedRooms]);

	const leftoverRooms = useMemo(() => {
		if (!data.rooms) return [];
		return data.rooms
			.filter((room) => !rooms.some((r) => r.roomId === room.roomId))
			.sort((a, b) => a.displayName.localeCompare(b.displayName));
	}, [data.rooms, rooms]);

	const hasChanges = useMemo(() => {
		const changedRooms = updatedRooms.filter((room) => {
			const originalRoom = data.rooms?.find((r) => r.roomId === room.roomId);
			if (!originalRoom) return false;
			return room.regex !== (originalRoom.regex ?? "");
		});
		return changedRooms.length > 0;
	}, [updatedRooms, data.rooms]);

	const testRegex = useCallback(
		(regex: string, room: string) => {
			try {
				const regexPattern = new RegExp(regex);
				const computers = data.computers?.filter((computer) => regexPattern.test(computer.name)) ?? [];
				if (computers.length === 0) toast.showMessage(`Keine Computer in ${room} gefunden`, "error");
			} catch {}
		},
		[data.computers, toast.showMessage],
	);

	return (
		<>
			<AddRoomModal rooms={leftoverRooms} onSelect={(roomId) => addRoom(roomId)} />
			<div className="flex w-full justify-end">
				<RefreshSVG
					className="shrink-0 cursor-pointer fill-primary"
					onClick={() => {
						setUpdatedRooms([]);
						data.refreshRooms();
					}}
				/>
			</div>
			<div className="flex flex-col gap-20 lg:flex-row">
				<div className="w-full">
					<div className="room-table grid items-center gap-x-5 gap-y-3 overflow-x-scroll">
						<p>Raum</p>
						<p>Regex</p>
						<div className="col-span-3 col-start-1 border-container border-t-2" />
						{rooms.map((room) => (
							<Fragment key={room.roomId}>
								<p>{room.displayName}</p>
								<TextInput
									initialValue={room.regex}
									id={`regex-${room.roomId}`}
									onChange={(value) => updateRoom(room, value)}
									onBlur={(value) => testRegex(value, room.displayName)}
								/>
								<button type="button" onClick={() => deleteRoom(room.roomId)}>
									<DeleteSVG width="20" className="shrink-0 fill-error" />
								</button>
							</Fragment>
						))}
						{leftoverRooms.length > 0 && (
							<button
								type="button"
								className="col-span-3 col-start-1 mt-2 flex w-max items-center gap-2"
								onClick={data.openRoomModal}
							>
								Raum hinzufügen
								<PlusSVG className="shrink-0 fill-primary" />
							</button>
						)}
					</div>
					<button
						type="button"
						className={`mt-8 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-background transition-opacity ${hasChanges ? "cursor-pointer" : "cursor-not-allowed opacity-30"}`}
						onClick={() => {
							if (!hasChanges || isProcessing) return;
							setIsProcessing(true);
							saveRooms();
						}}
					>
						Räume speichern
						<SaveSVG width={15} className="shrink-0 fill-background" />
					</button>
				</div>
				<div className="w-full">
					<h3>Regex Umwandler</h3>
					<p className="pb-8">Hier können Sie ein Pattern (mit * und ?) in einen Regex umwandeln.</p>
					<RegexConverter />
					<Spacing size="md" />
					<h3 className="mt-5">Regex Tester</h3>
					<p className="pb-8">Testen Sie Ihren Regex indem die gefundenen Computer ausgegeben werden.</p>
					<RegexTester />
				</div>
			</div>
		</>
	);
};

export default RoomTable;
