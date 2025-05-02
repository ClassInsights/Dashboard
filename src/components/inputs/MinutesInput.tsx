import { useEffect, useState } from "react";

type MinutesInputProps = {
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
};

const MinutesInputProps = ({ value: initialValue, onChange, disabled }: MinutesInputProps) => {
	const [value, setValue] = useState(initialValue.toString());

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === "") {
			setValue("");
			onChange(0);
			return;
		}

		if (e.target.value.length > 3) return;

		const parsedValue = Number.parseInt(e.target.value);
		if (Number.isNaN(parsedValue) || initialValue < 0) return;

		onChange(parsedValue);
	};

	useEffect(() => {
		if (initialValue === 0) {
			setValue("");
		} else {
			setValue(initialValue.toString());
		}
	}, [initialValue]);

	return (
		<div className="flex items-center gap-2 rounded-md bg-container px-4 py-1">
			<input
				type="text"
				value={value}
				onChange={handleChange}
				min={0}
				className="w-8 border-none bg-transparent outline-none"
				disabled={disabled}
			/>
			<p>Minuten</p>
		</div>
	);
};

export default MinutesInputProps;
