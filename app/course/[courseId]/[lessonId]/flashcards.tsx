import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import EndDeckCelebration from "@/components/EndDeckCelebration";
import Page from "@/components/page";
import { ThemedText } from "@/components/themed-text";
import { database } from "@/hooks/useDatabase";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function FlashcardsScreen() {
	const [flashcards, setFlashcards] = useState([]);
	const color = "#9584ff";
	const [index, setIndex] = useState(0);
	const [answer, showAnswer] = useState(false);

	function selectedAgain() {
		setTimeout(() => {
			setIndex(index + 1);
			showAnswer(false);
		}, 200);
	}

	function selectedHard() {
		setIndex(index + 1);
		showAnswer(false);
	}

	function selectedGood() {
		setIndex(index + 1);
		showAnswer(false);
	}

	function selectedEasy() {
		setIndex(index + 1);
		showAnswer(false);
	}

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
	return flashcards.length > 0 && index < flashcards.length ? (
		<Page style={{ justifyContent: "space-between" }}>
			<View
				style={{
					height: "90%",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<View style={[styles.flashcard, { backgroundColor: color }]}>
					<ThemedText style={styles.flashcardTitle} type='display'>
						{flashcards[index].front}
					</ThemedText>
					{answer && <ThemedText>{flashcards[index].back}</ThemedText>}
				</View>

				<View style={styles.buttonSection}>
					{!answer ? (
						<Button
							onPress={() => setTimeout(() => showAnswer(true), 200)}
							type='wide-pill'
							title='Show Answer'
							size='medium'
						/>
					) : (
						<ButtonGroup>
							<Button
								onPress={() => selectedAgain()}
								title='Again'
								size='medium'
								type='stadium-right'
							/>
							<Button
								onPress={() => selectedHard()}
								title='Hard'
								size='medium'
								type='square'
							/>
							<Button
								onPress={() => selectedGood()}
								title='Good'
								size='medium'
								type='square'
							/>
							<Button
								onPress={() => selectedEasy()}
								title='Easy'
								size='medium'
								type='stadium-left'
							/>
						</ButtonGroup>
					)}
				</View>
			</View>
		</Page>
	) : (
		// Celebration
		<View>
			<EndDeckCelebration
				accuracy={99}
				cards={34}
				redo={() => setIndex(0)}
				speed={2.22}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonSection: {
		alignSelf: "center",
		position: "relative",
	},
	flashcard: {
		height: "80%",
		borderRadius: 10,
		padding: 10,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	flashcardTitle: {
		textAlign: "center",
		marginBottom: 25,
	},
});
