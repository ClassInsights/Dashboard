export type LogMessage = {
  computerLogId: number;
  computerId: number;
  timestamp: string;
  level: string;
  category: string;
  message: string;
  details?: string;
};

export const isLogMessage = (data: unknown): data is LogMessage => {
  return (
    data !== null &&
    typeof data === "object" &&
    "computerLogId" in data &&
    typeof data.computerLogId === "number" &&
    "computerId" in data &&
    typeof data.computerId === "number" &&
    "timestamp" in data &&
    typeof data.timestamp === "string" &&
    "level" in data &&
    typeof data.level === "string" &&
    "category" in data &&
    typeof data.category === "string" &&
    "message" in data &&
    typeof data.message === "string" &&
    (!("details" in data) || typeof data.details === "string")
  );
};
