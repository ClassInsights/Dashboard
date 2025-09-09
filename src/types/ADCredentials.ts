export type ADCredentials = {
  ldapServer: string;
  ldapPort: number;
  ldapUser: string;
  ldapPass?: string | null;
  ldapAutoSync: boolean;
};

export const isADCredentials = (data: any): data is ADCredentials => {
  return (
    typeof data === "object" &&
    data !== null &&
    "ldapServer" in data &&
    typeof data.ldapServer === "string" &&
    "ldapPort" in data &&
    typeof data.ldapPort === "number" &&
    "ldapUser" in data &&
    typeof data.ldapUser === "string" &&
    (!("ldapPass" in data) || typeof data.ldapPass === "string" || data.ldapPass === null) &&
    "ldapAutoSync" in data &&
    typeof data.ldapAutoSync === "boolean"
  );
};
