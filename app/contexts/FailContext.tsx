"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type FailContextType = {
  fail: (reason?: string, details?: string) => void;
  failAuth: () => void;
  hasFailed: boolean;
};

const FailContext = createContext<FailContextType | undefined>(undefined);

export const FailProvider = ({ children }: { children: React.ReactNode }) => {
  const [authFailed, setAuthFailed] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [details, setDetails] = useState<string | undefined>(undefined);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const fail = useCallback((reason?: string, details?: string) => {
    setFailed(true);
    setReason(reason);
    setDetails(details);
  }, []);

  const failAuth = useCallback(() => setAuthFailed(true), []);

  const hasFailed = useMemo(() => authFailed || failed, [authFailed, failed]);

  if (authFailed)
    return (
      <div className="mx-auto flex min-h-screen w-full select-none items-center justify-center md:w-2/4 xl:w-2/5 2xl:w-2/6">
        <div className="text-center text-onBackground dark:text-dark-onBackground">
          <h1 className="mb-3">Authentifizieren fehlgeschlagen.</h1>
          <p>
            Nur{" "}
            <b className="text-primary dark:text-dark-primary">
              Administratoren haben Zugriff
            </b>{" "}
            auf dieses Dashboard. Wenn du denkst, dass du Zugriff haben
            solltest, versuche es später erneut!
          </p>
        </div>
      </div>
    );
  else if (failed)
    return (
      <div className="mx-auto flex min-h-screen w-full select-none items-center justify-center md:w-2/4 xl:w-2/5 2xl:w-2/6">
        <div className="text-center text-onBackground dark:text-dark-onBackground">
          <h1 className="mb-3">Ein unerwarteter Fehler ist aufgetreten!</h1>
          <p>
            Bitte versuche er später erneut. Wenn das Problem nach wie vor
            vorhanden ist, wende dich an einen Systemadministrator.
          </p>
          {reason && (
            <p className="mt-2 text-primary dark:text-dark-primary">
              Grund: {reason}
            </p>
          )}
          {details && !showDetails && (
            <p
              onClick={() => setShowDetails(true)}
              className="mt-2 cursor-pointer text-sm"
            >
              Details anzeigen
            </p>
          )}
          {details && showDetails && <p className="mt-2 text-sm">{details}</p>}
        </div>
      </div>
    );

  return (
    <FailContext.Provider value={{ fail, failAuth, hasFailed }}>
      {children}
    </FailContext.Provider>
  );
};

export const useFail = () => {
  const context = useContext(FailContext);
  if (context === undefined) {
    throw new Error("useFail must be used within a FailProvider");
  }
  return context;
};
