export enum ResponseType {
  Success,
  ClientRatelimited,
  ServerRatelimited,
  Unknown,
  Unauthorized,
}

export type FetchResponse = {
  type: ResponseType;
  message: string | undefined;
};
