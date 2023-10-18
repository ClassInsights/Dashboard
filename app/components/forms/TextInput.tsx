"use client";

import { useState, useCallback, useEffect } from "react";

type TextInputProps = {
  initialValue?: string;
  placeholder?: string;
  title?: string;
  style?: "primary" | "secondary" | "tertiary";
  regexPattern?: string;
  disabled?: boolean;
  reset?: boolean;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
};

const TextInput: React.FC<TextInputProps> = ({
  initialValue,
  placeholder,
  title,
  style,
  regexPattern,
  disabled,
  reset,
  onSubmit,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(initialValue ?? "");

  useEffect(() => {
    if (reset) setInputValue(initialValue ?? "");
  }, [reset, initialValue]);

  const submitValue = useCallback(
    (value: string) => {
      if (value === initialValue) return;
      if (!regexPattern) {
        if (onSubmit) onSubmit(value);
        return;
      }
      const regex = new RegExp(regexPattern);
      if (regex.test(value) && onSubmit) onSubmit(value);
      else setInputValue(initialValue ?? "");
    },
    [regexPattern, initialValue, onSubmit],
  );

  return (
    <div className="relative w-full">
      {title && (
        <small className="absolute bottom-10 select-none">{title}</small>
      )}
      <input
        disabled={disabled}
        type="text"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
          if (onChange) onChange(event.target.value);
        }}
        placeholder={placeholder}
        className={`w-full rounded-md px-4 py-2 placeholder-onBackground outline-none transition-opacity placeholder:opacity-20 dark:placeholder-dark-onBackground
      ${
        style === "primary"
          ? "bg-primary text-background dark:bg-dark-primary dark:text-dark-background"
          : ""
      }
      ${
        !style || style === "secondary"
          ? "bg-secondary dark:bg-dark-secondary"
          : ""
      }
      ${style === "tertiary" ? "bg-tertiary dark:bg-dark-tertiary" : ""}
    ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        onBlur={() => submitValue(inputValue)}
      />
    </div>
  );
};

export default TextInput;
