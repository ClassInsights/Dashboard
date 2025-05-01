type MinutesInputProps = {
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
};

const MinutesInputProps = ({ value, onChange, disabled }: MinutesInputProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === "") {
			onChange(0);
			return;
		}

		if (e.target.value.length > 3) return;

		const parsedValue = Number.parseInt(e.target.value);
		if (Number.isNaN(parsedValue) || value < 0) return;

		onChange(parsedValue);
	};

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
