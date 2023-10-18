"use client";

import { useState, useCallback } from "react";

type TextInputProps = {
  initialValue?: string;
  placeholder?: string;
  title?: string;
  style?: "primary" | "secondary" | "tertiary";
  regexPattern?: string;
  onSubmit: (value: string) => void;
};

const TextInput: React.FC<TextInputProps> = ({
  initialValue,
  placeholder,
  title,
  style,
  regexPattern,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = useState(initialValue ?? "");

  const submitValue = useCallback(
    (value: string) => {
      if (value === initialValue) return;
      else if (regexPattern) {
        const regex = new RegExp(regexPattern);
        regex.test(value) ? onSubmit(value) : setInputValue(initialValue ?? "");
      } else onSubmit(value);
    },
    [regexPattern, initialValue, onSubmit],
  );

  return (
    <div className="relative flex w-full flex-col">
      {title && (
        <small className="absolute bottom-10 select-none">{title}</small>
      )}
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
    </div>
  );
};

export default TextInput;
