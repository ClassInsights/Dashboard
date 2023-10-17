"use client";

import { useState } from "react";

type TextInputProps = {
  value?: string;
  placeholder?: string;
  regexPattern?: string;
  maxLength?: number;
  onSubmit: (value: string) => void;
};

const TextInput: React.FC<TextInputProps> = ({
  value,
  placeholder,
  regexPattern,
  maxLength,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = useState(value ?? "");

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      placeholder={placeholder}
      className="outline-none"
      onBlur={() => onSubmit(inputValue)}
    />
  );
};

export default TextInput;
