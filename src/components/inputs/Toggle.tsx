import { useCallback, useEffect, useState } from "react";

type ToggleProps = {
	checked?: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
};

const Toggle = ({ checked = false, onChange, disabled = false }: ToggleProps) => {
	const [isChecked, setIsChecked] = useState(false);

	const handleClick = useCallback(() => {
		onChange(!isChecked);
		setIsChecked((prev) => !prev);
	}, [onChange, isChecked]);

	useEffect(() => {
		setIsChecked(checked);
	}, [checked]);

	return (
		<div
			className={`flex h-5 w-10 items-center rounded-full ${isChecked ? "justify-end bg-primary " : "justify-start bg-error "}${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
			onClick={disabled ? undefined : handleClick}
			onKeyDown={disabled ? undefined : handleClick}
		>
			<div className="mx-0.5 h-4 w-4 rounded-full bg-background" />
		</div>
	);
};

export default Toggle;
