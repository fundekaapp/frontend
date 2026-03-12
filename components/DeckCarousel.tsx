// components/deck-carousel.tsx
import React, { useCallback, useEffect, useRef } from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	Easing,
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import FlashcardDeckCard, {
	CARD_GAP,
	CARD_HEIGHT,
	CARD_WIDTHS,
	FlashcardDeckCardProps,
	computeSnapOffsets,
} from "./flashcard-deck-card";

// Smooth scroll — no overshoot, clean cubic deceleration
const SCROLL_TIMING = {
	duration: 380,
	easing: Easing.out(Easing.cubic),
};

// Left peek: how much space to reserve on the left for the one past card
// = small card width + gap, so it can peek out when focal > 0
const LEFT_PEEK = 68; // CARD_WIDTHS.small + CARD_GAP

const DRAG_THRESHOLD = 6; // px before a touch is treated as a drag
const VELOCITY_THRESHOLD = 600; // px/s for a flick to advance extra cards

// Cards visible beyond the focal card (ahead only)
// Desktop: large + medium + small = focal + 2
// Mobile:  large + small = focal + 1
const VISIBLE_WINDOW_DESKTOP = 3;
const VISIBLE_WINDOW_MOBILE = 1;

interface DeckCarouselProps {
	decks: FlashcardDeckCardProps[];
}

export default function DeckCarousel({ decks }: DeckCarouselProps) {
	const { width: screenWidth } = useWindowDimensions();
	const isTablet = screenWidth >= 768;
	const containerRef = useRef<View>(null);

	const snapOffsets = React.useMemo(
		() => computeSnapOffsets(decks.length),
		[decks.length],
	);

	const scrollX = useSharedValue(0);
	const scrollXStart = useSharedValue(0);
	const focalIndex = useSharedValue(0);
	const isDragging = useSharedValue(false);

	const maxScroll = snapOffsets[snapOffsets.length - 1] ?? 0;
	const visibleWindow = isTablet
		? VISIBLE_WINDOW_DESKTOP
		: VISIBLE_WINDOW_MOBILE;

	const findNearestIndex = useCallback(
		(x: number): number => {
			"worklet";
			let best = 0;
			let bestDist = Infinity;
			for (let i = 0; i < snapOffsets.length; i++) {
				const d = Math.abs(x - snapOffsets[i]);
				if (d < bestDist) {
					bestDist = d;
					best = i;
				}
			}
			return best;
		},
		[snapOffsets],
	);

	const snapTo = useCallback(
		(index: number) => {
			"worklet";
			const clamped = Math.max(0, Math.min(index, snapOffsets.length - 1));
			focalIndex.value = clamped;
			scrollX.value = withTiming(snapOffsets[clamped], SCROLL_TIMING);
		},
		[snapOffsets, scrollX, focalIndex],
	);

	const pan = Gesture.Pan()
		.onBegin(() => {
			scrollXStart.value = scrollX.value;
			isDragging.value = false;
		})
		.onUpdate((e) => {
			if (Math.abs(e.translationX) > DRAG_THRESHOLD) {
				isDragging.value = true;
			}
			// Scale translation: full screen swipe (~300px) = 1 card slot (68px)
			// This makes one deliberate swipe advance exactly one card.
			const SWIPE_RESISTANCE = 300;
			const slotWidth = CARD_WIDTHS.small + CARD_GAP;
			const scaled = (e.translationX / SWIPE_RESISTANCE) * slotWidth;
			const next = scrollXStart.value - scaled;
			if (next < 0) {
				scrollX.value = next * 0.15;
			} else if (next > maxScroll) {
				scrollX.value = maxScroll + (next - maxScroll) * 0.15;
			} else {
				scrollX.value = next;
			}
		})
		.onEnd((e) => {
			const velocityX = e.velocityX;
			const currentIndex = findNearestIndex(scrollX.value);
			let targetIndex: number;

			if (velocityX < -VELOCITY_THRESHOLD) {
				targetIndex = currentIndex + 1;
			} else if (velocityX > VELOCITY_THRESHOLD) {
				targetIndex = currentIndex - 1;
			} else {
				targetIndex = currentIndex;
			}

			snapTo(targetIndex);
		});

	// Web: wheel / middle-mouse scrolling
	useEffect(() => {
		if (Platform.OS !== "web") return;
		const node = containerRef.current as unknown as HTMLElement;
		if (!node) return;

		let wheelTimeout: ReturnType<typeof setTimeout>;

		// Accumulate wheel delta — each card slot is ~68px (small+gap)
		// We want roughly 3-4 scroll notches per card so divide delta heavily
		let accumulated = 0;

		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			const delta =
				Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			accumulated += delta * 0.3; // 0.3 = much less sensitive than before (was 0.8)

			const nudged = Math.max(
				0,
				Math.min(scrollX.value + delta * 0.3, maxScroll),
			);
			scrollX.value = nudged;

			clearTimeout(wheelTimeout);
			wheelTimeout = setTimeout(() => {
				accumulated = 0;
				const nearest = findNearestIndex(scrollX.value);
				focalIndex.value = nearest;
				scrollX.value = withTiming(snapOffsets[nearest], SCROLL_TIMING);
			}, 180); // longer debounce = waits for scroll to settle before snapping
		};

		node.addEventListener("wheel", onWheel, { passive: false });
		return () => {
			node.removeEventListener("wheel", onWheel);
			clearTimeout(wheelTimeout);
		};
	}, [maxScroll, snapOffsets, scrollX, focalIndex, findNearestIndex]);

	const rowStyle = useAnimatedStyle(() => {
		"worklet";
		// Peek only appears at the END of the list — fades in over the last
		// 68px of scroll travel — hinting the user they can scroll back.
		// At any other scroll position peek=0, so no left offset.
		const peek = interpolate(
			scrollX.value,
			[maxScroll - 68, maxScroll],
			[0, LEFT_PEEK],
			"clamp",
		);
		return { transform: [{ translateX: peek - scrollX.value }] };
	});

	const rowWidth =
		CARD_WIDTHS.large +
		CARD_GAP +
		CARD_WIDTHS.medium +
		CARD_GAP +
		Math.max(0, decks.length - 2) * (CARD_WIDTHS.small + CARD_GAP) +
		(CARD_WIDTHS.large - CARD_WIDTHS.small);

	return (
		// @ts-ignore — web exposes DOM node on ref
		<View
			ref={containerRef}
			style={[styles.container, { height: CARD_HEIGHT }]}
		>
			<GestureDetector gesture={pan}>
				<View style={styles.gestureArea}>
					<Animated.View style={[styles.row, { width: rowWidth }, rowStyle]}>
						{decks.map((deck, i) => (
							<FlashcardDeckCard
								key={deck.id}
								{...deck}
								index={i}
								scrollX={scrollX}
								offsets={snapOffsets}
								isDragging={isDragging}
								focalIndex={focalIndex}
								visibleWindow={visibleWindow}
							/>
						))}
					</Animated.View>
				</View>
			</GestureDetector>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		overflow: "hidden",
	},
	gestureArea: {
		flex: 1,
		overflow: "hidden",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		height: "100%",
	},
});
