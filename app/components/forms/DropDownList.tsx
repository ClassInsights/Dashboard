import { useState, useCallback } from "react";
import Divider from "../settings/Divider";

type ListElement = {
  displayName?: string;
  value: string;
};

type DropDownListProps = {
  options: ListElement[];
  selected?: string;
  title?: string;
  disabled?: boolean;
  onChange: (element: ListElement) => void;
};

const DropDownList: React.FC<DropDownListProps> = ({
  options,
  selected,
  title,
  disabled,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full select-none">
      {title && (
        <small className="absolute bottom-10 select-none">{title}</small>
      )}
      <div
        onMouseEnter={() => setIsOpen(!disabled)}
        onMouseLeave={() => setIsOpen(false)}
        className={`transition-opacity
        ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <p
          className={`bg-secondary px-4 py-2 dark:bg-dark-secondary ${
            isOpen ? "rounded-t-md" : "rounded-md"
          }`}
        >
          {options.find((option) => option.value === selected)?.displayName ??
            "Wähle aus"}
        </p>
        {isOpen && (
          <div className="absolute z-30 w-full shadow-md">
            {options.map((option, index) => (
              <p
                key={option.value}
                className={`cursor-pointer border-t border-tertiary bg-secondary px-4 py-2 transition-colors hover:bg-tertiary dark:border-dark-tertiary dark:bg-dark-secondary dark:hover:bg-dark-tertiary
                ${index === options.length - 1 ? "rounded-b-md" : ""}`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option.displayName ?? option.value}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropDownList;
