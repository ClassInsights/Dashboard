import useLogs from "@/hooks/use-logs";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers2,
  ReceiptText,
} from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type LogProps = {
  computerId: number;
  currentDate: Date;
  logsPerPage: number;
  setLogsPerPage: React.Dispatch<React.SetStateAction<number>>;
};

const Log = ({ computerId, currentDate, logsPerPage, setLogsPerPage }: LogProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: logs, isLoading, isError, refetch } = useLogs(computerId, currentDate);

  const pages = logs ? Math.ceil(logs.length / logsPerPage) : undefined;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > (pages ?? -1)) return;
    setCurrentPage(page);
  };

  const nextPage = () => handlePageChange(currentPage + 1);
  const previousPage = () => handlePageChange(currentPage - 1);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < (pages ?? -1);

  const displayedLogs = logs?.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  if (isLoading)
    return (
      <div className="pointer-events-none my-4 cursor-none overflow-hidden rounded-md border">
        {[...Array(10)].map((_, index) => (
          <button
            key={index}
            className="flex w-full flex-1 items-start justify-between gap-4 border-b px-4 py-4 text-left text-sm font-medium outline-none"
          >
            <div className="flex flex-col gap-2 lg:flex-row">
              <div className="flex">
                <div className="w-24 shrink-0">
                  <span className="[&amp;&gt;svg]:size-3 w-fit animate-pulse rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent">
                    ...........
                  </span>
                </div>
                <span className="animate-pulse rounded-md bg-accent pt-[0.0625rem] text-accent">
                  00:00:00
                </span>
              </div>
              <span className="animate-pulse rounded-md bg-accent pt-[0.0625rem] text-accent">
                ..............................................................
              </span>
            </div>
            <div className="h-[24px] w-[24px] animate-pulse rounded-md bg-accent"></div>
          </button>
        ))}
      </div>
    );

  if (isError) {
    return (
      <div className="my-4 flex flex-col items-center justify-center overflow-hidden rounded-md border p-4 text-center md:flex-row md:text-left">
        <span className="pr-2">Ein unterwarter Fehler ist beim Laden der Logs aufgetreten.</span>
        <Button variant="link" onClick={() => refetch()} className="p-0">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="my-4 flex items-center justify-center overflow-hidden rounded-md border p-4 text-center">
        Es wurden keine Log Einträge für den {currentDate.formatToDay()} gefunden.
      </div>
    );
  }

  return (
    <>
      <div className="my-4 overflow-hidden rounded-md border">
        <Accordion type="single" collapsible>
          {displayedLogs?.map((log) => {
            const logLevel =
              log.level === "Error" || log.level === "Critical"
                ? "destructive"
                : log.level === "Warning"
                  ? "warning"
                  : "outline";

            return (
              <AccordionItem
                key={log.computerLogId}
                value={log.computerLogId.toString()}
                className="px-4"
              >
                <AccordionTrigger>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="flex">
                      <div className="w-24 shrink-0">
                        <Badge variant={logLevel}>{log.level}</Badge>
                      </div>
                      <span className="pt-[0.0625rem]">
                        {new Date(log.timestamp).toLocaleTimeString("de-DE", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                    <span className="pt-[0.0625rem]">{log.message}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3 overflow-x-auto text-balance lg:ml-24">
                  <div>
                    <div className="flex items-center gap-2">
                      <Layers2 size={14} />
                      Kategorie
                    </div>
                    <p>{log.category}</p>
                  </div>
                  {log.details && (
                    <div>
                      <div className="flex items-center gap-2">
                        <ReceiptText size={14} />
                        Details
                      </div>
                      <p>{log.details}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <div className="flex flex-col items-center gap-4 px-2 lg:flex-row lg:justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {logs.length} Log Einträge gefunden
        </div>
        <div className="flex flex-col items-center justify-end gap-4 space-x-6 lg:flex-row lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Einträge pro Seite</p>
            <Select
              value={logsPerPage.toString()}
              onValueChange={(value) => {
                setLogsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={logsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-end gap-3 px-4">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Seite {currentPage} von {pages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="flex size-8"
                onClick={() => setCurrentPage(1)}
                disabled={!hasPreviousPage}
              >
                <span className="sr-only">Zur ersten Seite navigieren</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={previousPage}
                disabled={!hasPreviousPage}
              >
                <span className="sr-only">Zur vorherigen Seite navigieren</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={nextPage}
                disabled={!hasNextPage}
              >
                <span className="sr-only">Zur nächsten Seite navigieren</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="flex size-8"
                onClick={() => setCurrentPage(pages ?? 1)}
                disabled={!hasNextPage}
              >
                <span className="sr-only">Zur letzten Seite navigieren</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Log;
