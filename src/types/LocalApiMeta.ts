export type LocalApiMeta = {
  version: string;
  platform: string;
};

export const isLocalApiMeta = (data: unknown): data is LocalApiMeta =>
  data !== null &&
  typeof data === "object" &&
  "version" in data &&
  typeof data.version === "string" &&
  "platform" in data &&
  typeof data.platform === "string";
