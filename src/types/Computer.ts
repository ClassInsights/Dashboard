export type Computer = {
	computerId: number;
	roomId?: number;
	name: string;
	macAddress: string;
	ipAddress: string;
	lastUser: string;
	lastSeen: string;
	version: string;
	online: boolean;
};

export function isComputer(data: unknown): data is Computer {
	return (
		typeof data === "object" &&
		data !== null &&
		"computerId" in data &&
		typeof data.computerId === "number" &&
		"roomId" in data &&
		(data.roomId === undefined || data.roomId !== null || typeof data.roomId === "number") &&
		"name" in data &&
		typeof data.name === "string" &&
		"macAddress" in data &&
		typeof data.macAddress === "string" &&
		"ipAddress" in data &&
		typeof data.ipAddress === "string" &&
		"lastUser" in data &&
		typeof data.lastUser === "string" &&
		"lastSeen" in data &&
		typeof data.lastSeen === "string" &&
		"version" in data &&
		typeof data.version === "string" &&
		"online" in data &&
		typeof data.online === "boolean"
	);
}
