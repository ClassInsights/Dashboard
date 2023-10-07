"use client";

import { useEffect, useState } from "react";
import { useAlert } from "../contexts/AlertContext";

const Alert = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const alert = useAlert();

  useEffect(() => {
    if (!alert.isVisible) return;
    const timeout = setTimeout(
      () => alert.hide(),
      alert.actions.length > 0 ? 6000 : 2500,
    );
    return () => clearTimeout(timeout);
  }, [alert]);

  useEffect(() => {
    var timeout: NodeJS.Timeout;
    if (alert.isVisible) setIsVisible(true);
    else timeout = setTimeout(() => setIsVisible(false), 100);
    return () => clearTimeout(timeout);
  }, [alert.isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`alert-animation absolute left-0 right-0 mx-auto w-max translate-y-1/4 select-none rounded-xl bg-secondary px-5 py-2 shadow-sm dark:bg-dark-secondary
    ${!alert.isVisible ? "alert-close-animation" : ""}`}
    >
      <p>{alert.message}</p>
      {alert.actions && (
        <div className="mt-1 flex w-full items-center justify-center gap-8">
          {alert.actions.map((action, index) => (
            <button
              key={index}
              className="rounded-md bg-tertiary px-3 py-0.5 dark:bg-dark-tertiary"
              onClick={() => {
                alert.hide();
                action.onClick();
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
