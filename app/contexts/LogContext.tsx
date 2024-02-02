"use client";

import { createContext, useCallback, useContext, useState } from "react";
import LogEntry from "../types/logEntry";
import { useAuth } from "./AuthContext";
import { useRatelimit } from "./RatelimitContext";
import { FetchResponse, ResponseType } from "../types/response";
import { useResponse } from "./ResponseContext";

type LogContextType = {
  logs: LogEntry[];
  fetchLogs: () => Promise<FetchResponse>;
  refreshLogs: () => Promise<void>;
  isLoading: boolean;
  alreadyInitialized: boolean;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs] = useState<LogEntry[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alreadyInitialized, setAlreadyInitialized] = useState<boolean>(false);

  const auth = useAuth();
  const ratelimit = useRatelimit();
  const response = useResponse();

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setAlreadyInitialized(true);
    if (ratelimit.isRateLimited("logs")) {
      setIsLoading(false);
      return {
        type: ResponseType.ClientRatelimited,
        message: "logs",
      };
    }

    var result: FetchResponse;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs`, {
        headers: {
          authorization: `Bearer ${auth.token}`,
        },
      });

      if (logs) ratelimit.addRateLimit("logs");

      result = response.buildResponse(
        res.status,
        "Logeinträge wurden erfolgreich aktualisiert",
      );

      if (result.type !== ResponseType.Success) {
        setIsLoading(false);
        return result;
      }

      const json = await res.json();
      const entries: LogEntry[] = json.map((entry: any) => {
        return {
          logId: entry.logId,
          message: entry.message,
          username: entry.username,
          date: new Date(entry.date),
        };
      });

      const isEqual =
        entries.length === logs?.length &&
        entries.every(
          (entry, index) =>
            entry.logId === logs[index].logId &&
            entry.message === logs[index].message &&
            entry.username === logs[index].username &&
            entry.date.getTime() === logs[index].date.getTime(),
        );

      if (logs && isEqual) {
        setIsLoading(false);
        return result;
      }

      setLogs(entries);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      return {
        type: ResponseType.Unknown,
      } as FetchResponse;
    }
  }, [auth.token, logs, ratelimit, response]);

  const refreshLogs = useCallback(async () => {
    var hasFinished = false;
    const timeout = setTimeout(() => !hasFinished && setIsLoading(true), 500);
    const result = await fetchLogs();
    hasFinished = true;
    clearTimeout(timeout);
    response.handleResponse(result);
  }, [fetchLogs, response]);

  return (
    <LogContext.Provider
      value={{
        logs: logs ?? [],
        fetchLogs,
        refreshLogs,
        isLoading,
        alreadyInitialized,
      }}
    >
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLog must be used within a LogProvider");
  }
  return context;
};
