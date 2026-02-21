import FlashcardDeckCard, {
	FlashcardDeckCardProps,
} from "@/components/flashcard-deck-card";
import Page from "@/components/page";
import { ThemedText } from "@/components/themed-text";
import { useDatabase } from "@/hooks/useDatabase";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

export default function HomeScreen() {
	const { getFlashcardDecks } = useDatabase();
	const [flashcardDecks, setFlashcardDecks] = useState([]);
	const user = "Munyaradzi";

	useEffect(() => {
		async function fetchData() {
			const decks = await getFlashcardDecks([]);
			setFlashcardDecks(decks);
		}
		fetchData();
	}, []);

	return (
		<Page>
			<ThemedText type='display'>Welcome Back</ThemedText>
			<ThemedText type='display'>{user}</ThemedText>
			<ScrollView
				horizontal
				style={{
					overflow: "hidden",
					width: "100%",
					height: 215,
				}}
			>
				{flashcardDecks.map((deck: FlashcardDeckCardProps, y) => (
					<FlashcardDeckCard
						key={deck.id}
						title={deck.title}
						color={deck.color}
						icon={deck.icon}
						completion={deck.completion}
						course={deck.course}
						size={y % 2 === 0 ? "large" : "small"} // visual size controlled by width animation
					/>
				))}
			</ScrollView>
			<ThemedText type='link'>Show all</ThemedText>
		</Page>
	);
}
