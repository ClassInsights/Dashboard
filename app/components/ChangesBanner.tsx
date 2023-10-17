"use client";

import { useState } from "react";
import { useConfig } from "../contexts/ConfigContext";
import { useAlert } from "../contexts/AlertContext";

const ChangesBanner = () => {
  const [loading, setLoading] = useState(false);

  const config = useConfig();
  const alert = useAlert();

  if (!config.hasUnsavedChanges) return;
  return (
    <div className="fixed bottom-0 right-0 z-30 flex w-full select-none flex-col items-center justify-between gap-4 bg-primary px-3 py-4 sm:flex-row sm:px-10">
      <p className="text-center text-background dark:text-dark-background">
        Es gibt ungespeicherte Änderungen - klicke auf "Speichern" zum Sichern.
      </p>
      <button
        className={`rounded-lg border border-background px-4 py-2 font-bold text-background dark:border-dark-background dark:text-dark-background
        ${loading ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={async () => {
          if (loading) return;
          setLoading(true);
          const success = await config.saveConfig();
          success
            ? alert.show("Erfolgreich gespeichert!")
            : alert.show("Ein Fehler ist aufgetreten!");
          setLoading(false);
        }}
      >
        Speichern
      </button>
    </div>
  );
};

export default ChangesBanner;
