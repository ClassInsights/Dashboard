import { useEffect, useState } from "react";
import CloseSVG from "../../assets/svg/close.svg?react";

type FilterProps = {
	label: string;
	active?: boolean;
	onUpdate: (value: boolean) => void;
};

const FilterField = ({ label, active = false, onUpdate }: FilterProps) => {
	const [isActive, setIsActive] = useState(active);

	const handleClick = () => {
		onUpdate(!isActive);
		setIsActive((prev) => !prev);
	};

	useEffect(() => {
		setIsActive(active);
	}, [active]);

	return (
		<div
			className="flex cursor-pointer items-center gap-2 rounded-lg bg-container px-3 py-1"
			onClick={handleClick}
			onKeyDown={handleClick}
		>
			<p>{label}</p>
			{isActive && <CloseSVG width={14} className="shrink-0 fill-black" />}
		</div>
	);
};

export default FilterField;
