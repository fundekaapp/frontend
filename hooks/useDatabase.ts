export const database = {
	async getCourses() {
		const response = await fetch("/api/courses");
		if (!response.ok) throw new Error("Failed to fetch courses");
		return response.json();
	},

	async getFlashcardDecks() {
		const response = await fetch("/api/flashcard-decks");
		if (!response.ok) throw new Error("Failed to fetch flashcard decks");
		return response.json();
	},
	async getFlashcards() {
		const response = await fetch("/api/flashcards");
		if (!response.ok) throw new Error("Failed to fetch flashcards");
		return response.json();
	},
	async getActivities(courseId: string) {
		const response = await fetch(`/api/activities?courseId=${courseId}`);
		if (!response.ok) throw new Error("Failed to fetch activities");
		return response.json();
	},
	async getLessons(courseId: string) {
		const response = await fetch(`/api/lessons?courseId=${courseId}`);
		if (!response.ok) throw new Error("Failed to fetch lessons");
		return response.json();
	},
	async getLesson(lessonId: string) {
		const response = await fetch(`/api/lessons?lessonId=${lessonId}`);
		if (!response.ok) throw new Error("Failed to fetch lessons");
		return response.json();
	},
};
