"use client";

import { useEffect, useState } from "react";
import { useConfig } from "../../contexts/ConfigContext";
import { useAlert } from "../../contexts/AlertContext";

const ChangesBanner = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const config = useConfig();
  const alert = useAlert();

  useEffect(() => {
    if (!config.hasUnsavedChanges) {
      setIsClosing(true);
      setTimeout(() => setIsVisible(false), 200);
      return;
    }
    setIsVisible(true);
    setIsClosing(false);
  }, [config]);

  if (!isVisible) return;
  return (
    <div
      className={`banner-open-animation fixed bottom-0 right-0 z-30 flex w-full select-none flex-col items-center justify-between gap-4 bg-primary px-3 py-4 sm:flex-row sm:px-10
    ${isClosing ? "banner-close-animation" : ""}`}
    >
      <p className="text-center text-background dark:text-dark-background">
        Es gibt ungespeicherte Änderungen - klicke auf{" "}
        <span className="font-bold text-background dark:text-dark-background">
          Speichern
        </span>{" "}
        zum Sichern.
      </p>
      <button
        disabled={loading}
        className={`rounded-lg border border-background px-4 py-2 font-bold text-background dark:border-dark-background dark:text-dark-background
        ${loading ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={async () => {
          if (loading) return;
          setLoading(true);
          const success = await config.saveConfig();
          success
            ? alert.show("Konfiguration erfolgreich gespeichert")
            : alert.show("Ein unerwarteter Fehler ist aufgetreten");
          setLoading(false);
        }}
      >
        Speichern
      </button>
    </div>
  );
};

export default ChangesBanner;
