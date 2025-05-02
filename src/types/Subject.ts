export type Subject = {
	subjectId: number;
	displayName: string;
};

export function isSubject(subject: unknown): subject is Subject {
	return (
		typeof subject === "object" &&
		subject !== null &&
		"subjectId" in subject &&
		typeof subject.subjectId === "number" &&
		"displayName" in subject &&
		typeof subject.displayName === "string"
	);
}
