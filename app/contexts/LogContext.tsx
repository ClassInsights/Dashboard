"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import LogEntry from "../types/logEntry";
import { useFail } from "./FailContext";
import { useAuth } from "./AuthContext";
import FetchError from "../enums/fetchError";
import { useRatelimit } from "./RatelimitContext";

type LogContextType = {
  logs: LogEntry[];
  fetchLogs: (skipRatelimit?: boolean) => Promise<FetchError | undefined>;
  isLoading: boolean;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const auth = useAuth();
  const ratelimit = useRatelimit();
  const failer = useFail();

  const fetchLogs = useCallback(
    async (skipRatelimit = false) => {
      if (failer.hasFailed || !auth.token) return FetchError.Unauthorized;
      if (!skipRatelimit && ratelimit.isRateLimited("fetchLogs"))
        return FetchError.Ratelimited;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/logs`,
          {
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
          },
        );

        if (!skipRatelimit) ratelimit.addRateLimit("fetchLogs");

        if (response.status === 401) {
          failer.fail(
            "Fehler beim Laden der Logeinträge",
            "Request finished with Code 401 (Unauthorized)",
          );
          return FetchError.Unauthorized;
        } else if (response.status === 429) return FetchError.Ratelimited;
        else if (response.status !== 200) return FetchError.Unknown;

        const json = await response.json();
        const entries: LogEntry[] = json.map((entry: any) => {
          return {
            logId: entry.logId,
            message: entry.message,
            username: entry.username,
            date: new Date(entry.date),
          };
        });

        if (
          entries.every((log, index, _) => logs.at(index)?.logId === log.logId)
        )
          return;

        setLogs(entries);
      } catch (error: any) {
        failer.fail("Fehler beim Laden der Logs", error.toString());
        return FetchError.Unknown;
      }
    },
    [auth.token, failer, logs, ratelimit],
  );

  useEffect(() => {
    if (!auth.token || auth.token === "") return;
    fetchLogs().then(() => setIsLoading(false));
    // don't add fetchLogs to the dependency array, otherwise the application loops
  }, [auth]);

  return (
    <LogContext.Provider value={{ logs, fetchLogs, isLoading }}>
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
