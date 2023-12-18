import { useState, useCallback } from "react";
import Image from "next/image";

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
        <div
          className={`flex w-full items-center justify-between bg-secondary px-4 py-2 dark:bg-dark-secondary
          ${isOpen ? "rounded-t-md" : "rounded-md"}`}
        >
          <p>
            {options.find((option) => option.value === selected)?.displayName ??
              "Bitte wähle aus"}
          </p>
          <Image
            src={"./arrow_right.svg"}
            alt="arrow indicator for dropdown"
            width={15}
            height={15}
            className={`h-4 w-4 transition-transform 
            ${isOpen ? "-rotate-90" : "rotate-90"}`}
            draggable={false}
          />
        </div>
        {isOpen && options.length === 0 && (
          <div className="absolute z-30 flex h-8 w-full items-center rounded-b-md border-t border-tertiary bg-secondary shadow-md dark:border-dark-tertiary dark:bg-dark-secondary">
            <p className="px-4">Keine Elemente gefunden</p>
          </div>
        )}
        {isOpen && options.length > 0 && (
          <div
            className={`absolute z-30 w-full overflow-y-scroll rounded-b-md bg-secondary shadow-md dark:bg-dark-secondary
          ${
            options.length <= 1 ? "h-8" : options.length === 2 ? "h-16" : "h-24"
          }`}
          >
            {options.map((option) => (
              <p
                key={option.value}
                className="flex h-8 cursor-pointer items-center border-t border-tertiary bg-secondary px-4 transition-colors hover:bg-tertiary dark:border-dark-tertiary dark:bg-dark-secondary dark:hover:bg-dark-tertiary"
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
