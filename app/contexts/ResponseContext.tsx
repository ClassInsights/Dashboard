"use client";

import { createContext, useCallback, useContext } from "react";
import { useFail } from "./FailContext";
import { useAlert } from "./AlertContext";
import { useRatelimit } from "./RatelimitContext";
import { FetchResponse, ResponseType } from "../types/response";

interface ResponseContextProps {
  handleResponse: (response: FetchResponse) => void;
  buildResponse: (statusCode: number, successMessage: string) => FetchResponse;
}

const ResponseContext = createContext<ResponseContextProps | undefined>(
  undefined,
);

export const ResponseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const alert = useAlert();
  const failer = useFail();
  const ratelimit = useRatelimit();

  const handleResponse = useCallback(
    (response: FetchResponse) => {
      switch (response.type) {
        case ResponseType.ClientRatelimited:
          const limit = ratelimit.getRatelimit(response.message ?? "-1");
          if (!limit) {
            alert.show("Etwas ist schiefgelaufen");
            return;
          }
          const secondsLeft = Math.ceil(
            (limit.startedAt.getTime() + limit.duration - Date.now()) / 1000,
          );
          alert.show(
            `Warte noch ${secondsLeft <= 0 ? 1 : secondsLeft} ${
              secondsLeft === 1 ? "Sekunde" : "Sekunden"
            } zum Aktualisieren`,
          );
          break;
        case ResponseType.ServerRatelimited:
          failer.fail(
            "Du hast zu viele Anfragen gesendet! Versuche es in ein paar Minuten erneut.",
          );
          break;
        case ResponseType.Unauthorized:
          failer.failAuth();
          break;
        case ResponseType.Unknown:
          alert.show("Etwas ist schiefgelaufen");
          break;
        case ResponseType.Success:
          alert.show(response.message ?? "Erfolgreich");
          break;
      }
    },
    [alert, failer, ratelimit],
  );

  const buildResponse = useCallback(
    (statusCode: number, successMessage: string): FetchResponse => {
      switch (statusCode) {
        case 200:
          return {
            type: ResponseType.Success,
            message: successMessage,
          };
        case 401:
          return {
            type: ResponseType.Unauthorized,
          } as FetchResponse;
        case 429:
          return {
            type: ResponseType.ServerRatelimited,
          } as FetchResponse;
        default:
          return {
            type: ResponseType.Unknown,
          } as FetchResponse;
      }
    },
    [],
  );

  return (
    <ResponseContext.Provider value={{ handleResponse, buildResponse }}>
      {children}
    </ResponseContext.Provider>
  );
};

export const useResponse = () => {
  const context = useContext(ResponseContext);
  if (context === undefined) {
    throw new Error("useResponse must be used within a ResponseProvider");
  }
  return context;
};
