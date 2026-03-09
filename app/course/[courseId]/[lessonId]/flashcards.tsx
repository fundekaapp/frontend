import { ThemedText } from "@/components/themed-text";
import { database } from "@/hooks/useDatabase";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

export default function FlashcardsScreen() {
	const [flashcards, setFlashcards] = useState([]);
	const [index, setIndex] = useState(0);
	const [answer, showAnswer] = useState(false);
	useEffect(() => {
		// define async function inside useEffect
		async function fetchData() {
			try {
				const data = await database.getFlashcards();
				setFlashcards(data);
				console.log(data);
			} catch (err) {
				console.error("Failed to fetch lesson:", err);
			}
		}

		fetchData(); // call it
	}, []);
	return (
		<View>
			{flashcards.length > 0 && (
				<View>
					<ThemedText>{flashcards[index].front}</ThemedText>
					{answer && <ThemedText>{flashcards[index].back}</ThemedText>}
				</View>
			)}
			<Pressable onPress={() => showAnswer(true)}>
				<ThemedText>Show Answer</ThemedText>
			</Pressable>
			<Pressable onPress={() => setIndex(index + 1)}>
				<ThemedText>Next Card</ThemedText>
			</Pressable>
		</View>
	);
}
