import { useState } from "react";

type TextInputProps = {
	id: string;
	label?: string;
	initialValue?: string | null;
	onChange: (value: string) => void;
	onBlur?: (value: string) => void;
	error?: boolean;
	maxLength?: number;
	disabled?: boolean;
	clickAction?: () => void;
};

const TextInput = ({
	id,
	label,
	initialValue,
	onChange,
	onBlur,
	error = false,
	maxLength,
	disabled = false,
}: TextInputProps) => {
	const [value, setValue] = useState(initialValue ?? "");
	return (
		<div className="relative w-full">
			{label && (
				<label htmlFor={id} className="absolute top-[-1.1rem] text-xs">
					{label}
				</label>
			)}
			<input
				id={id}
				type="text"
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
				onBlur={(e) => {
					if (onBlur) onBlur(e.currentTarget.value);
				}}
				className={`w-full rounded-md border-[1px] bg-background px-4 py-2 outline-none ${error ? "border-error" : "border-black"}${disabled ? " cursor-not-allowed" : ""}`}
				autoComplete="off"
				maxLength={maxLength}
				disabled={disabled}
			/>
		</div>
	);
};

export default TextInput;
