import CloseSVG from "../assets/svg/close.svg?react";
import { useUpdate } from "../contexts/UpdateContext";

const UpdateChecker = () => {
	const update = useUpdate();

	if (!update.updateAvailable) return null;

	return (
		<div className="page-spacing fixed right-0 bottom-0 left-0 z-50 w-full bg-container py-5">
			<CloseSVG
				width={20}
				className="absolute top-3 right-3 shrink-0 cursor-pointer fill-black"
				onClick={() => update.abort()}
			/>
			<h3>Neue Version verfügbar!</h3>
			{update.isUnix ? (
				<>
					<p>Klicke Sie auf Update, um ClassInsights automatisch auf den neusten Stand zu aktualisieren.</p>
					<button
						type="button"
						onClick={() => update.callUpdate()}
						className="mt-3 rounded-md bg-primary px-5 py-1 text-container"
					>
						Update
					</button>
				</>
			) : (
				<p>Bitte folgen Sie der Aktualisierungsanleitung.</p>
			)}
		</div>
	);
};

export default UpdateChecker;
