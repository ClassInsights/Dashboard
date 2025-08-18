import { useRef } from "react";

type MinutesInputProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

const MinutesInput = ({ value, onChange, disabled }: MinutesInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeWithLimit = (newValue: string) => {
    if (newValue.length > 3) return;

    const numberValue = Number(newValue);
    if (isNaN(numberValue) || numberValue < 0 || numberValue >= 1000) return;

    if (inputRef.current) inputRef.current.value = newValue;
    onChange(numberValue);
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`flex h-9 min-w-0 items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 md:text-sm dark:bg-input/30 ${disabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(value) => onChangeWithLimit(value.target.value)}
        disabled={disabled}
        className="w-[4ch] outline-none"
      />
      <span>Minuten</span>
    </div>
  );
};

export default MinutesInput;
