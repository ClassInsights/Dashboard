export type ADCredentials = {
  domain: string;
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
    "username" in data &&
    typeof data.username === "string" &&
    ("password" in data ? typeof data.password === "string" || data.password === null : true) &&
    "autoSync" in data &&
    typeof data.autoSync === "boolean"
  );
};
