// components/flashcard-deck-card.tsx
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { ThemedText } from "./themed-text";

export type DeckSize = "small" | "medium" | "large";

export interface FlashcardDeckCardProps {
	title: string;
	color: string;
	icon: string;
	completion: number;
	course: string;
	size: DeckSize;
}

export default function FlashcardDeckCard({
	title,
	color,
	icon,
	completion,
	course,
	size,
}: FlashcardDeckCardProps) {
	return (
		<Animated.View
			style={[
				styles.base,
				size === "small" && styles.small,
				size === "medium" && styles.medium,
				size === "large" && styles.large,
				{ backgroundColor: color },
			]}
		>
			{size !== "small" && (
				<>
					<ThemedText style={styles.course}>{course}</ThemedText>
					<ThemedText style={styles.title}>{title}</ThemedText>
					<Text style={{ fontSize: 72 }}>{icon}</Text>

					<View style={styles.progressTrack}>
						<View
							style={[styles.progressFill, { width: `${completion * 100}%` }]}
						/>
					</View>
				</>
			)}

			{size === "small" && <ThemedText style={styles.icon}>{icon}</ThemedText>}
		</Animated.View>
	);
}

const HEIGHT = 215;

const styles = StyleSheet.create({
	base: {
		height: HEIGHT,
		borderRadius: 28,
		padding: 16,
		justifyContent: "center",
		marginHorizontal: 4,
	},
	large: {
		width: 325,
	},
	medium: {
		width: 200,
	},
	small: {
		width: 60,
		alignItems: "center",
		justifyContent: "center",
	},
	course: {
		opacity: 0.7,
		fontSize: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		marginVertical: 8,
	},
	progressTrack: {
		height: 6,
		backgroundColor: "rgba(255,255,255,0.3)",
		borderRadius: 4,
	},
	progressFill: {
		height: 6,
		backgroundColor: "white",
		borderRadius: 4,
	},
	icon: {
		fontSize: 28,
	},
});
