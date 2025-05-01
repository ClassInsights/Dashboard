import { useState } from "react";
import TextInput from "./inputs/TextInput";
import { useToast } from "../contexts/ToastContext";

const patternToRegex = (pattern: string) => {
	if (!pattern) return "";
	const regex = pattern
		.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
		.replace(/\\\*/g, ".*")
		.replace(/\\\?/g, ".");

	return `^${regex}$`;
};

const RegexConverter = () => {
	const [regex, setRegex] = useState("");

	const toast = useToast();

	const copyInput = () => {
		const result = document.getElementById("converter-result");
		if (!result || !(result instanceof HTMLInputElement)) return;

		const value = result.value;
		if (!value) return;

		navigator.clipboard.writeText(value);
		toast.showMessage("Regex in die Zwischenablage kopiert");
	};

	return (
		<div className="flex gap-6">
			<TextInput id="converter" label="Pattern" onChange={(value) => setRegex(patternToRegex(value))} />
			<div className="relative w-full">
				<label htmlFor="converter-result" className="absolute top-[-1.1rem] text-xs">
					Regex Ausgabe
				</label>
				<input
					id="converter-result"
					type="text"
					value={regex}
					onChange={() => {}}
					className="w-full rounded-md border-[1px] bg-background px-4 py-2 outline-none"
					onFocus={(e) => e.target.blur()}
					onClick={copyInput}
				/>
			</div>
		</div>
	);
};

export default RegexConverter;
