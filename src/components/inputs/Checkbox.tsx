import { useEffect, useState } from "react";
import CheckSVG from "../../assets/svg/check.svg?react";
import RemoveSVG from "../../assets/svg/remove.svg?react";

export type CheckboxState = "deselected" | "selected" | "remove";

type CheckboxProps = {
	state?: CheckboxState;
	onChange: (state: CheckboxState) => void;
};

const Checkbox = ({ state = "deselected", onChange }: CheckboxProps) => {
	const [currentState, setCurrentState] = useState<CheckboxState>(state);

	const handleClick = () => {
		setCurrentState((prevState) => {
			const newState = prevState === "deselected" ? "selected" : prevState === "remove" ? "deselected" : "deselected";
			onChange(newState);
			return newState;
		});
	};

	useEffect(() => {
		setCurrentState(state);
	}, [state]);

	return (
		<div
			className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm border-[1px] p-1"
			onClick={handleClick}
			onKeyDown={handleClick}
		>
			{currentState === "selected" && <CheckSVG width={12} className="shrink-0 fill-black" />}
			{currentState === "remove" && <RemoveSVG width={12} className="shrink-0 fill-black" />}
		</div>
	);
};

export default Checkbox;
