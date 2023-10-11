"use client";

import { useCallback, useEffect, useState } from "react";
import { useAlert } from "../contexts/AlertContext";

const Alert = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const alert = useAlert();

  var timeout: NodeJS.Timeout;

  const startCloseAnimation = useCallback(() => {
    const closeTimeout = setTimeout(() => {
      setIsVisible(false);
      alert.hide();
      clearTimeout(closeTimeout);
    }, 200);
  }, []);

  useEffect(() => {
    if (alert.isVisible) {
      setIsVisible(true);
      timeout = setTimeout(
        () => {
          startCloseAnimation();
        },
        alert.actions.length > 0 ? 6000 : 2500,
      );
    } else if (isVisible) startCloseAnimation();
    return () => clearTimeout(timeout);
  }, [alert]);

  if (!isVisible) return null;

  return (
    <div
      className={`alert-animation absolute left-0 right-0 z-10 mx-auto max-w-max translate-y-1/4 select-none rounded-xl bg-secondary px-5 py-2 shadow-sm dark:bg-dark-secondary
    ${!alert.isVisible ? "alert-close-animation" : ""}`}
    >
      <p>{alert.message}</p>
      {alert.actions && (
        <div className="mt-2 flex w-full items-center justify-center gap-8">
          {alert.actions.map((action, index) => (
            <button
              key={index}
              className="rounded-md bg-tertiary px-3 py-0.5 dark:bg-dark-tertiary"
              onClick={() => {
                setIsVisible(false);
                action.onClick();
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
