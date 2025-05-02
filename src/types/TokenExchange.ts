export type TokenExchange = {
	school_id: number;
	name: string;
	website: string;
	local_api_url: string;
	local_dashboard_url: string;
	azure_teacher_groups: string[];
};

export function isTokenExchange(obj: unknown): obj is TokenExchange {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"school_id" in obj &&
		typeof obj.school_id === "number" &&
		"name" in obj &&
		typeof obj.name === "string" &&
		"website" in obj &&
		typeof obj.website === "string" &&
		"local_api_url" in obj &&
		typeof obj.local_api_url === "string" &&
		"local_dashboard_url" in obj &&
		typeof obj.local_dashboard_url === "string" &&
		"azure_teacher_groups" in obj &&
		Array.isArray(obj.azure_teacher_groups) &&
		obj.azure_teacher_groups.every((group: unknown) => typeof group === "string")
	);
}
