"use client";

import Header from "@/app/components/general/Header";
import { useLog } from "@/app/contexts/LogContext";
import Image from "next/image";

export default function LogPage() {
  const logData = useLog();
  return (
    <>
      <Header
        title="Logbuch"
        subtitle="Hier werden alle administrativen Tätigkeiten aufgezeichnet"
        previousPath="/"
      />
      <div className="verflow-hidden flex select-none flex-col rounded-xl bg-secondary dark:bg-dark-secondary md:hidden">
        {logData.logs.map((log, index) => (
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
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
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
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
