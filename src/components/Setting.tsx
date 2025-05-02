import MinutesInputProps from "./inputs/MinutesInput";
import Toggle from "./inputs/Toggle";
import Spacing from "./Spacing";

type SettingProps = {
	title: string;
	desciption: string;
	toggleValue?: boolean;
	toggleAction?: (value: boolean) => void;
	inputValue?: number;
	inputAction?: (value: number) => void;
	currentHint?: React.ReactNode;
};

const Setting = ({
	title,
	desciption,
	toggleValue,
	toggleAction,
	inputValue,
	inputAction,
	currentHint,
}: SettingProps) => {
	return (
		<div>
			<div className="flex items-center gap-5">
				<h2>{title}</h2>
				{toggleValue !== undefined && toggleAction !== undefined && (
					<Toggle checked={toggleValue} onChange={toggleAction} />
				)}
			</div>
			<Spacing size="sm" />
			<div className={toggleValue === false ? "opacity-50" : ""}>
				<div className="flex flex-col items-start justify-between gap-4 md:flex-row">
					<p className="md:w-3/4">{desciption}</p>
					{inputValue !== undefined && inputAction && (
						<MinutesInputProps value={inputValue} onChange={inputAction} disabled={toggleValue === false} />
					)}
				</div>
				{currentHint && (
					<>
						<Spacing size="md" />
						<div className="md:w-3/4">
							<h3>Aktuelle Einstellung</h3>
							{currentHint}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Setting;
