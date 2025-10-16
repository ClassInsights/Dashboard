import type { JWTPayload } from "jose";

export type AccessTokenResponse = {
  access_token: string;
};

export interface CustomJWTPayload extends JWTPayload {
  name: string;
  email: string;
  school_name: string;
  role: Role[];
}

export const roles = ["Owner", "Admin", "Teacher", "Student"] as const;
export type Role = (typeof roles)[number];

export function isAccessTokenResponse(obj: unknown): obj is AccessTokenResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "access_token" in obj &&
    typeof obj.access_token === "string"
  );
}

export function isCustomJWTPayload(obj: unknown): obj is CustomJWTPayload {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    typeof obj.name === "string" &&
    "email" in obj &&
    typeof obj.email === "string" &&
    "school_name" in obj &&
    typeof obj.school_name === "string" &&
    "role" in obj &&
    Array.isArray(obj.role) &&
    obj.role.every((role) => roles.includes(role))
  );
}
