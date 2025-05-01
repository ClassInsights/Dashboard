import { useMemo, useState } from "react";
import { useData } from "../contexts/DataContext";
import TextInput from "./inputs/TextInput";

const RegexTester = () => {
	const [regex, setRegex] = useState("");
	const [showComputers, setShowComputers] = useState(false);

	const data = useData();

	const matches = useMemo(() => {
		try {
			const regexPattern = new RegExp(regex);
			return data.computers?.filter((computer) => regexPattern.test(computer.name)) ?? [];
		} catch {
			return [];
		}
	}, [regex, data.computers]);

	const handleToggle = () => setShowComputers((prev) => !prev);

	return (
		<>
			<TextInput id="tester" label="Regex" onChange={(value) => setRegex(value)} />
			<p className="mt-2 font-medium">
				{regex === "" ? null : matches.length === 0 ? (
					"Keine Computer gefunden"
				) : (
					<span>
						{matches.length} Computer gefunden (
						<span className="cursor-pointer select-none text-primary" onClick={handleToggle} onKeyDown={handleToggle}>
							{showComputers ? "verbergen" : "anzeigen"}
						</span>
						)
					</span>
				)}
			</p>
			{showComputers && matches.length > 0 && <p>{matches.map((computer) => computer.name).join(", ")}</p>}
		</>
	);
};

export default RegexTester;
