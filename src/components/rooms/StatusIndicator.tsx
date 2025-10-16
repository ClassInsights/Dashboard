import type { UseMutationResult } from "@tanstack/react-query";

type StatusType = UseMutationResult["status"];

const StatusIndicator = ({ status }: { status: StatusType }) => {
  switch (status) {
    case "pending":
      return (
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary" />
          Verbindung wird hergestellt...
        </div>
      );
    case "error":
      return (
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-destructive" />
          Verbindungsaufbau fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben. Dies kann aufgrund
          ungültiger Anmeldedaten oder unzureichende Leserechte des Benutzers im Active Directory
          passieren.
        </div>
      );
    case "success":
      return (
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
          Verbindung erfolgreich hergestellt!
        </div>
      );
    default:
      return null;
  }
};

export default StatusIndicator;
