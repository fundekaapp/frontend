// components/flashcard-deck-card.tsx
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	Extrapolation,
	SharedValue,
	interpolate,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./themed-text";

export type DeckSize = "small" | "medium" | "large";

export interface FlashcardDeckCardProps {
	id: string;
	title: string;
	color: string;
	icon: string;
	completion: number;
	course: string;
}

interface AnimatedCardProps extends FlashcardDeckCardProps {
	index: number;
	scrollX: SharedValue<number>;
	offsets: number[];
	isDragging: SharedValue<boolean>;
	focalIndex: SharedValue<number>;
	visibleWindow: number; // how many cards ahead of focal are visible
}

export const CARD_WIDTHS = {
	large: 280,
	medium: 200,
	small: 60,
} as const;

export const CARD_GAP = 8;
export const CARD_HEIGHT = 215;

/**
 * Compute the scroll offset needed to make card `f` the focal card.
 * Cards behind focal collapse to small width (60px).
 */
export function computeSnapOffsets(count: number): number[] {
	const offsets: number[] = [];
	for (let f = 0; f < count; f++) {
		let offset = 0;
		for (let i = 0; i < f; i++) {
			offset += CARD_WIDTHS.small + CARD_GAP;
		}
		offsets.push(offset);
	}
	return offsets;
}

/**
 * Returns a float "focal distance" for this card:
 *  0   = this card is focal (large)
 *  1   = one ahead (medium)
 *  2   = two ahead (small)
 * -1   = one behind (small/past)
 */
function getFocalDistance(
	index: number,
	scrollX: number,
	offsets: number[],
): number {
	"worklet";

	const count = offsets.length;
	const clampedScroll = Math.max(0, Math.min(scrollX, offsets[count - 1]));

	let f = count - 1;
	for (let i = 0; i < count - 1; i++) {
		if (clampedScroll >= offsets[i] && clampedScroll < offsets[i + 1]) {
			f = i;
			break;
		}
	}

	const nextOffset =
		f < count - 1 ? offsets[f + 1] : offsets[f] + CARD_WIDTHS.small + CARD_GAP;

	const progress =
		f < count - 1
			? (clampedScroll - offsets[f]) / (nextOffset - offsets[f])
			: 0;

	const focalFloat = f + progress;
	return index - focalFloat;
}

export default function FlashcardDeckCard({
	title,
	color,
	icon,
	completion,
	course,
	index,
	scrollX,
	offsets,
	isDragging,
	focalIndex,
	visibleWindow,
}: AnimatedCardProps) {
	const router = useRouter();

	// Card container: drives width and overall visibility
	const animatedContainer = useAnimatedStyle(() => {
		"worklet";
		const dist = getFocalDistance(index, scrollX.value, offsets);

		// Width morphs:
		// Desktop (visibleWindow=3): large(0) → medium(1) → medium(2) → small(3)
		// Tablet  (visibleWindow=2): large(0) → medium(1) → small(2)
		// Mobile  (visibleWindow=1): large(0) → small(1+)
		const w1 = visibleWindow >= 2 ? CARD_WIDTHS.medium : CARD_WIDTHS.small;
		const w2 = visibleWindow >= 3 ? CARD_WIDTHS.medium : CARD_WIDTHS.small;

		const width = interpolate(
			dist,
			[-1, 0, 1, 2, 3],
			[CARD_WIDTHS.small, CARD_WIDTHS.large, w1, w2, CARD_WIDTHS.small],
			Extrapolation.CLAMP,
		);

		// Cards beyond the visible window fade to 0 opacity
		// visibleWindow=2 means focal(0), ahead-1(1), ahead-2(2) are visible
		// Cards at dist > visibleWindow or dist < -1 are invisible
		const containerOpacity = interpolate(
			dist,
			[-1.5, -1, 0, visibleWindow, visibleWindow + 0.5],
			[0, 1, 1, 1, 0],
			Extrapolation.CLAMP,
		);

		return { width, opacity: containerOpacity };
	});

	// Rich content (title, progress) — fades in only at focal
	const animatedContent = useAnimatedStyle(() => {
		"worklet";
		const dist = getFocalDistance(index, scrollX.value, offsets);

		const opacity = interpolate(
			dist,
			[-0.2, 0, 0.5, 1],
			[0, 1, 1, 0],
			Extrapolation.CLAMP,
		);

		return { opacity };
	});

	// Icon — visible when card is small (past or future non-focal)
	const animatedIcon = useAnimatedStyle(() => {
		"worklet";
		const dist = getFocalDistance(index, scrollX.value, offsets);

		// Future small cards (dist ~1-2)
		const futureOpacity = interpolate(
			dist,
			[0.6, 1, visibleWindow, visibleWindow + 0.5],
			[0, 1, 1, 0],
			Extrapolation.CLAMP,
		);

		// Past small card (dist = -1) — fully visible, fades as it approaches focal
		const pastOpacity = interpolate(
			dist,
			[-1.5, -1, -0.3],
			[0, 1, 0],
			Extrapolation.CLAMP,
		);

		return { opacity: Math.max(futureOpacity, pastOpacity) };
	});

	return (
		<Pressable
			onPress={() => {
				if (isDragging.value) return;
				if (focalIndex.value === index) {
					// Already focal — navigate into the deck
					router.push("/course/1/1/flashcards");
				} else {
					// Not focal — promote this card to focal first
					focalIndex.value = index;
					scrollX.value = withTiming(offsets[index], {
						duration: 380,
						easing: Easing.out(Easing.cubic),
					});
				}
			}}
		>
			<Animated.View
				style={[styles.base, { backgroundColor: color }, animatedContainer]}
			>
				{/* Rich content — only visible at focal */}
				<Animated.View style={[styles.contentLayer, animatedContent]}>
					<ThemedText style={styles.course}>{course}</ThemedText>
					<ThemedText style={styles.title}>{title}</ThemedText>
					<ThemedText style={styles.iconLarge}>{icon}</ThemedText>
					<View style={styles.progressTrack}>
						<View
							style={[styles.progressFill, { width: `${completion * 100}%` }]}
						/>
					</View>
					<ThemedText style={styles.completionText}>
						Completion: {Math.round(completion * 100)}%
					</ThemedText>
				</Animated.View>

				{/* Icon only — visible when card is small */}
				<Animated.View
					style={[
						styles.iconLayer,
						StyleSheet.absoluteFillObject,
						animatedIcon,
					]}
				>
					<ThemedText style={styles.iconSmall}>{icon}</ThemedText>
				</Animated.View>
			</Animated.View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		height: CARD_HEIGHT,
		borderRadius: 28,
		marginHorizontal: CARD_GAP / 2,
		overflow: "hidden",
		justifyContent: "flex-end",
	},
	contentLayer: {
		padding: 16,
		flex: 1,
		justifyContent: "flex-end",
	},
	iconLayer: {
		alignItems: "center",
		justifyContent: "center",
	},
	course: {
		opacity: 0.75,
		fontSize: 11,
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginBottom: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 12,
		lineHeight: 22,
	},
	iconLarge: {
		fontSize: 64,
		position: "absolute",
		top: 12,
		right: 12,
	},
	iconSmall: {
		fontSize: 26,
	},
	progressTrack: {
		height: 6,
		backgroundColor: "rgba(255,255,255,0.3)",
		borderRadius: 4,
		overflow: "hidden",
	},
	progressFill: {
		height: 6,
		backgroundColor: "white",
		borderRadius: 4,
	},
	completionText: {
		fontSize: 11,
		opacity: 0.8,
		marginTop: 6,
		fontWeight: "600",
	},
});
