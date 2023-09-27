"use client";

import { ThemeMode, useTheme } from "@/app/contexts/ThemeContext";
import Image from "next/image";
import { useCallback, useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  const theme = useTheme();
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => (event.key === "Escape" ? onClose() : null),
    [onClose],
  );

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, handleKeyPress]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center shadow-lg md:items-center">
      <div
        className="absolute h-full w-full bg-onBackground opacity-70 dark:bg-dark-background"
        onClick={onClose}
      />
      <div className="relative h-[90%] w-full overflow-hidden rounded-t-2xl bg-secondary dark:bg-dark-secondary md:h-3/4 md:w-3/4 md:rounded-2xl lg:w-4/6 xl:w-7/12 2xl:w-1/2">
        <div className="absolute z-40 w-full border-b-1 border-tertiary px-5 dark:border-dark-tertiary">
          <div className="flex items-center justify-between py-2.5">
            <span />
            <p className="select-none text-onBackground dark:text-dark-onBackground">
              Gruppen verknüpfen
            </p>
            <div onClick={onClose} className="cursor-pointer">
              <Image
                src="/close.svg"
                alt="Close Settings"
                height={25}
                width={25}
                className={`cursor-pointer
              ${
                theme.themeMode == ThemeMode.Dark
                  ? "onBackground-dark"
                  : "onBackground-light"
              }`}
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="absolute top-0 h-full w-full overflow-scroll px-5 pb-5 pt-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
