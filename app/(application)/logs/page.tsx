"use client";

import Header from "@/app/components/general/Header";
import { useAuth } from "@/app/contexts/AuthContext";
import { useLog } from "@/app/contexts/LogContext";
import Image from "next/image";
import { useEffect, useMemo } from "react";

export default function LogPage() {
  const authData = useAuth();
  const logData = useLog();

  useEffect(() => {
    if (authData.token) logData.fetchLogs();
  }, [authData.token]);

  const hasLogs = useMemo(
    () => logData.logs && logData.logs.length !== 0,
    [logData],
  );

  return (
    <>
      <Header
        title="Logbuch"
        subtitle="Hier werden alle administrativen Tätigkeiten aufgezeichnet"
        previousPath="/"
        reloadAction={logData.refreshLogs}
      />
      {logData.isLoading && (
        <div className="flex h-32 w-full items-center justify-center">
          <Image
            src="/progress.svg"
            height={20}
            width={20}
            alt="progess indicator"
            draggable={false}
            className="onBackground-light dark:onBackground-dark h-10 w-10 animate-spin"
          />
        </div>
      )}
      {!logData.isLoading && !hasLogs && (
        <p className="text-primary dark:text-dark-primary">
          Es sind noch keine Logeinträge vorhanden.
        </p>
      )}
      {!logData.isLoading && hasLogs && (
        <>
          <div className="flex select-none flex-col overflow-hidden rounded-xl bg-secondary dark:bg-dark-secondary md:hidden">
            {logData.logs
              .sort((a, b) => +(a.date < b.date))
              .map((log, index) => (
                <div
                  key={log.logId}
                  className={`flex flex-col px-3 py-2 ${
                    index % 2 !== 0 ? "bg-tertiary dark:bg-dark-tertiary" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="/message.svg"
                      height={15}
                      width={15}
                      alt="Message Icon"
                      draggable={false}
                      className="onBackground-light dark:onBackground-dark h-4 w-4"
                    />
                    <p>{log.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/user.svg"
                      height={15}
                      width={15}
                      alt="User Icon"
                      draggable={false}
                      className="onBackground-light dark:onBackground-dark h-4 w-4"
                    />
                    <p>{log.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/calendar.svg"
                      height={15}
                      width={15}
                      alt="Date Icon"
                      draggable={false}
                      className="onBackground-light dark:onBackground-dark h-4 w-4"
                    />
                    <p>
                      {log.date.toLocaleDateString("de-AT", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="hidden overflow-hidden rounded-xl bg-secondary pt-2 dark:bg-dark-secondary md:block">
            <table className="w-full table-auto select-none">
              <thead className="w-full text-sm">
                <tr>
                  <td className="pl-5">Aktion</td>
                  <td>Benutzer</td>
                  <td>Datum</td>
                </tr>
              </thead>
              <tbody>
                {logData.logs.map((log) => (
                  <tr
                    key={log.logId}
                    className="even:bg-tertiary even:dark:bg-dark-tertiary"
                  >
                    <td className="py-2 pl-5">{log.message}</td>
                    <td className="py-2">{log.username}</td>
                    <td className="py-2 pr-5">
                      {log.date.toLocaleDateString("de-AT", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
