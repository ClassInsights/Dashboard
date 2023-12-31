"use client";

import { useEffect, useState, useRef } from "react";
import { useAlert } from "../../contexts/AlertContext";

const Alert = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const alert = useAlert();

  var timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeout.current);
    if (!alert.isVisible) {
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
        clearTimeout(timeout.current);
      }, 100);
      return;
    }
    setIsVisible(true);
    setIsClosing(false);
    timeout.current = setTimeout(
      () => alert.hide(),
      alert.actions.length === 0 ? 3000 : 8000,
    );
    return () => clearTimeout(timeout.current);
  }, [alert, timeout]);

  if (!isVisible) return null;

  return (
    <div
      className={`alert-animation fixed left-0 right-0 z-50 mx-auto max-w-max translate-y-1/4 rounded-xl bg-primary px-5 py-2 shadow-md dark:bg-dark-primary
    ${isClosing ? "alert-close-animation" : ""}`}
    >
      <p className="text-background dark:text-dark-background">
        {alert.message}
      </p>
      {alert.actions.length > 0 && (
        <div className="mt-2 flex w-full items-center justify-center gap-8">
          {alert.actions.map((action, index) => (
            <button
              key={index}
              className="rounded-md border border-background px-3 py-0.5 text-background dark:border-dark-background dark:text-dark-background"
              onClick={() => {
                if (action.onClick) action.onClick();
                alert.hide();
              }}
            >
              {action.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alert;
