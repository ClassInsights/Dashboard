import { useAuth } from "@/contexts/AuthContext";
import { isLogMessage, type LogMessage } from "@/types/LogMessage";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

const useLogs = (computerId: number, day: Date) => {
  let recentLogsRef = useRef<LogMessage[] | null>(null);
  let lastRefreshRef = useRef<Date | null>(null);

  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  const isToday = day.formatToDay() === new Date().formatToDay();

  return useQuery({
    queryKey: ["logs", computerId, day.formatToDay()],
    queryFn: async () => {
      const startTime = lastRefreshRef.current
        ? lastRefreshRef.current.toISOString()
        : new Date(day.setHours(0, 0, 0, 0)).toISOString();

      const endTime = isToday
        ? new Date().toISOString()
        : new Date(day.setHours(23, 59, 59, 999)).toISOString();

      const now = Date.now();

      const response = await fetch(
        `${apiUrl}/computers/${computerId}/logs?from=${startTime}&to=${endTime}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok)
        throw new Error(
          `Failed to fetch logs for computer ${computerId}, Status: ${response.status}`,
        );

      lastRefreshRef.current = new Date();

      const data = await response.json();
      if (Array.isArray(data) && data.every(isLogMessage)) {
        // create map to make sure there are no duplicates
        const existingLogsMap = new Map(
          (recentLogsRef.current ?? []).map((log) => [log.computerLogId, log]),
        );

        for (const log of data) {
          existingLogsMap.set(log.computerLogId, log);
        }

        const allLogs = Array.from(existingLogsMap.values()).sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        const diff = Date.now() - now;
        if (diff < 500) await new Promise((resolve) => setTimeout(resolve, 500 - diff));

        recentLogsRef.current = allLogs;
        return allLogs;
      }

      throw new Error("Invalid log data format");
    },
    enabled: !!accessToken && !!apiUrl,
    staleTime: isToday ? 1000 * 5 : Infinity,
    refetchInterval: isToday ? 1000 * 10 : false,
    refetchIntervalInBackground: isToday,
  });
};

export default useLogs;
