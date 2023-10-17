"use client";

import { useState, useCallback } from "react";

type TextInputProps = {
  value?: string;
  placeholder?: string;
  style?: "primary" | "secondary" | "tertiary";
  regexPattern?: string;
  onSubmit: (value: string) => void;
};

const TextInput: React.FC<TextInputProps> = ({
  value,
  placeholder,
  style,
  regexPattern,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = useState(value ?? "");

  const submitValue = useCallback(
    (value: string) =>
      regexPattern
        ? new RegExp(regexPattern).test(value)
          ? onSubmit(value)
          : setInputValue(value)
        : onSubmit(value),
    [regexPattern, value, onSubmit],
  );

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      placeholder={placeholder}
      className={`rounded-lg px-4 py-2 placeholder-onBackground outline-none placeholder:opacity-20 dark:placeholder-dark-onBackground
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
      ${style === "tertiary" ? "bg-tertiary dark:bg-dark-tertiary" : ""}"}`}
      onBlur={() => submitValue(inputValue)}
    />
  );
};

export default TextInput;
