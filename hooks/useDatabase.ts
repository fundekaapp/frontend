export function useDatabase() {
	return {
		getFlashcardDecks: async () => {
			async function fetchFlashcardDeck() {
				const response = await fetch("/api/flashcard-decks");
				const data = await response.json();
				return data;
			}
			const content = await fetchFlashcardDeck();
			return content;
		},
		getActivities: async (courseId: string | string[]) => {
			async function fetchActivities() {
				const response = await fetch(`/api/activities`);
				const data = await response.json();
				return data;
			}
			const content = await fetchActivities();
			return content;
		},
	};
}
