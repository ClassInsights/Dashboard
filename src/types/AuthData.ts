import { Role } from "./AccessToken";

export type AuthData = {
	name: string;
	email: string;
	roles: Role[];
	accessToken: string;
	school: {
		id: number;
		name: string;
		apiUrl: string;
		dashboardUrl: string;
		website: string;
	};
	expires: number;
};

export function isAuthData(obj: unknown): obj is AuthData {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"name" in obj &&
		typeof obj.name === "string" &&
		"email" in obj &&
		typeof obj.email === "string" &&
		"roles" in obj &&
		typeof obj.roles === "object" &&
		Array.isArray(obj.roles) &&
		obj.roles.every((role) => Object.values(Role).includes(role)) &&
		"accessToken" in obj &&
		typeof obj.accessToken === "string" &&
		"school" in obj &&
		typeof obj.school === "object" &&
		obj.school !== null &&
		"id" in obj.school &&
		typeof obj.school.id === "number" &&
		"name" in obj.school &&
		typeof obj.school.name === "string" &&
		"apiUrl" in obj.school &&
		typeof obj.school.apiUrl === "string" &&
		"dashboardUrl" in obj.school &&
		typeof obj.school.dashboardUrl === "string" &&
		"website" in obj.school &&
		typeof obj.school.website === "string" &&
		"expires" in obj &&
		typeof obj.expires === "number"
	);
}
