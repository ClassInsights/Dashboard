export type LessonResponse = {
	lessonId: number;
	roomId: number;
	subjectId: number;
	classId: number;
	start: string;
	end: string;
};

export type Lesson = LessonResponse & {
	subject: string;
	class: string;
};

export function isLesson(obj: unknown): obj is LessonResponse {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"lessonId" in obj &&
		typeof obj.lessonId === "number" &&
		"roomId" in obj &&
		typeof obj.roomId === "number" &&
		"subjectId" in obj &&
		typeof obj.subjectId === "number" &&
		"classId" in obj &&
		typeof obj.classId === "number" &&
		"start" in obj &&
		typeof obj.start === "string" &&
		"end" in obj &&
		typeof obj.end === "string"
	);
}
