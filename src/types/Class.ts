export type Class = {
	classId: number;
	displayName: string;
	azureGroupId: string | null;
};

export function isClass(obj: unknown): obj is Class {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"classId" in obj &&
		typeof obj.classId === "number" &&
		"displayName" in obj &&
		typeof obj.displayName === "string" &&
		"azureGroupId" in obj &&
		(typeof obj.azureGroupId === "string" || obj.azureGroupId === null)
	);
}
