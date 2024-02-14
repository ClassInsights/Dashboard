"use client";

import { useEffect, useState, useRef } from "react";
import { useAlert } from "../../contexts/AlertContext";

const Alert = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  var timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const alert = useAlert();

  useEffect(() => {
    if (!alert.isVisible) {
      timeout.current = setTimeout(() => setIsVisible(false), 150);
      return;
    }

    clearTimeout(timeout.current);
    timeout.current = undefined;
    setIsVisible(alert.isVisible);
  }, [alert, timeout.current]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed left-0 right-0 z-50 mx-auto mt-2 max-w-max rounded-xl bg-primary px-5 py-2 shadow-md dark:bg-dark-primary ${
        alert.isVisible ? "alert-animation" : "alert-close-animation"
      }`}
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
