import { useData } from "../contexts/DataContext";
import CloseSVG from "../assets/svg/close.svg?react";
import Spacing from "./Spacing";
import type { Room } from "../types/Room";
import { useCallback } from "react";

type AddRoomModalProps = {
	rooms: Room[];
	onSelect: (roomId: number) => void;
};

const AddRoomModal = ({ rooms, onSelect }: AddRoomModalProps) => {
	const data = useData();

	const selectRoom = useCallback(
		(roomId: number) => {
			data.closeRoomModal();
			onSelect(roomId);
		},
		[data, onSelect],
	);

	if (!rooms) return null;

	if (!data.isRoomModalOpen) return null;

	return (
		<dialog className="fixed top-0 z-20 flex h-dvh w-screen items-end justify-center bg-transparent md:items-center">
			<div
				className="h-full w-full cursor-pointer bg-black opacity-30"
				onClick={data.closeRoomModal}
				onKeyDown={data.closeRoomModal}
			/>
			<div className="absolute bottom-0 h-[88%] w-full rounded-t-2xl bg-background p-4 lg:bottom-auto lg:h-auto lg:w-3/4 lg:rounded-2xl xl:w-1/2 2xl:w-2/5">
				{/* Title Bar */}
				<div className="flex items-center justify-between bg-background">
					<CloseSVG width={20} className="shrink-0 opacity-0" />
					<div className="flex items-center gap-2">
						<p className="font-medium">Raum hinzufügen</p>
					</div>
					<CloseSVG width={20} className="shrink-0 cursor-pointer fill-black" onClick={data.closeRoomModal} />
				</div>
				{/* Certificate Content */}
				<div className="scrollbar relative h-full max-h-[90svh] overflow-y-scroll px-3 pt-12 pb-16 lg:px-14 lg:pt-10 lg:pb-6">
					<h2>Neuen Raum hinzufügen</h2>
					<Spacing size="sm" />
					<p>Wählen Sie in der folgenden Liste den gewünschten Raum aus.</p>
					<Spacing size="md" />
					<div className="max-h-[80%] overflow-y-scroll lg:max-h-96">
						{rooms.map((room) => (
							<div
								key={room.roomId}
								className="cursor-pointer border-t px-4 py-3 transition-colors last:border-b hover:bg-container"
								onClick={() => selectRoom(room.roomId)}
								onKeyDown={() => selectRoom(room.roomId)}
							>
								{room.displayName}
							</div>
						))}
					</div>
				</div>
			</div>
		</dialog>
	);
};

export default AddRoomModal;
