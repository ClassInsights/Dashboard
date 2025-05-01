export type Settings = {
	// refers to the time in minutes between two classes that determines if a shutdown command is sent to a computer
	checkGap: boolean;
	lessonGapMinutes: number;

	// this sets the waiting time before sending a shutdown message to all computers in the room if no more classes are scheduled there today.
	noLessonsTime: number;

	// this setting determines whether computers without logged-in users should be automatically shut down
	checkUser: boolean;

	// this sets the time in minutes after which an inactive user is automatically logged out
	checkAfk: boolean;
	afkTimeout: number;

	// this is the waiting time after one lesson before checking if a shutdown message should be sent
	delayShutdown: boolean;
	shutdownDelay: number;
};

export function isSettings(obj: unknown): obj is Settings {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"checkGap" in obj &&
		typeof obj.checkGap === "boolean" &&
		"lessonGapMinutes" in obj &&
		typeof obj.lessonGapMinutes === "number" &&
		"noLessonsTime" in obj &&
		typeof obj.noLessonsTime === "number" &&
		"checkUser" in obj &&
		typeof obj.checkUser === "boolean" &&
		"checkAfk" in obj &&
		typeof obj.checkAfk === "boolean" &&
		"afkTimeout" in obj &&
		typeof obj.afkTimeout === "number" &&
		"delayShutdown" in obj &&
		typeof obj.delayShutdown === "boolean" &&
		"shutdownDelay" in obj &&
		typeof obj.shutdownDelay === "number"
	);
}
