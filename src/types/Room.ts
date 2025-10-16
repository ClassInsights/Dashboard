export type Room = {
  roomId: number;
  displayName: string;
  organizationUnit: string | null;
  enabled: boolean;
  deviceCount: number;
};

export function isRoom(obj: unknown): obj is Room {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "roomId" in obj &&
    typeof obj.roomId === "number" &&
    "displayName" in obj &&
    typeof obj.displayName === "string" &&
    "organizationUnit" in obj &&
    (typeof obj.organizationUnit === "string" || obj.organizationUnit === null) &&
    "enabled" in obj &&
    typeof obj.enabled === "boolean" &&
    "deviceCount" in obj &&
    typeof obj.deviceCount === "number"
  );
}
