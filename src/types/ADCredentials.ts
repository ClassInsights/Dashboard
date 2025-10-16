export type ADCredentials = {
  domain: string;
  port: number;
  username: string;
  password?: string | null;
  autoSync: boolean;
};

export const isADCredentials = (data: any): data is ADCredentials => {
  return (
    typeof data === "object" &&
    data !== null &&
    "domain" in data &&
    typeof data.domain === "string" &&
    "port" in data &&
    typeof data.port === "number" &&
    "username" in data &&
    typeof data.username === "string" &&
    (!("password" in data) || typeof data.password === "string" || data.password === null) &&
    "autoSync" in data &&
    typeof data.autoSync === "boolean"
  );
};
