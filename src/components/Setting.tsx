import MinutesInput from "./MinutesInput";
import Spacing from "./Spacing";
import { Switch } from "./ui/switch";

type SettingProps = {
  title: string;
  description: string;
  toggleValue?: boolean;
  toggleAction?: (value: boolean) => void;
  inputValue?: number;
  inputAction?: (value: number) => void;
  currentHint?: React.ReactNode;
  disabled?: boolean;
};

const Setting = ({
  title,
  description,
  toggleValue,
  toggleAction,
  inputValue,
  inputAction,
  currentHint,
  disabled = false,
}: SettingProps) => {
  return (
    <div>
      <div className="flex items-center gap-5">
        <h2>{title}</h2>
        {toggleValue !== undefined && toggleAction !== undefined && (
          <Switch checked={toggleValue} onCheckedChange={toggleAction} disabled={disabled} />
        )}
      </div>
      <Spacing size="sm" />
      <div className={toggleValue === false ? "opacity-50" : ""}>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
          <p className="md:w-3/4">{description}</p>
          {inputValue !== undefined && inputAction && (
            <MinutesInput value={inputValue} onChange={inputAction} disabled={disabled} />
          )}
        </div>
        {currentHint && (
          <>
            <div className="md:w-3/4">
              <Spacing size="md" />
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
