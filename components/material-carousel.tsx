// components/material-carousel.tsx
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const LARGE_WIDTH = 300;
const MEDIUM_WIDTH = 220;
const SMALL_WIDTH = 90;
const ITEM_SPACING = 16;

interface MaterialCarouselProps<T> {
	data: T[];
	renderItem: (item: T) => React.ReactNode;
}

interface CarouselItemProps<T> {
	item: T;
	index: number;
	scrollX: Animated.Animated.Node<number>;
	renderItem: (item: T) => React.ReactNode;
}

function CarouselItem<T>({ item, index, scrollX, renderItem }: CarouselItemProps<T>) {
	const animatedStyle = useAnimatedStyle(() => {
		const inputRange = [
			(index - 1) * (MEDIUM_WIDTH + ITEM_SPACING),
			index * (MEDIUM_WIDTH + ITEM_SPACING),
			(index + 1) * (MEDIUM_WIDTH + ITEM_SPACING),
		];

		const width = interpolate(
			scrollX.value,
			inputRange,
			[SMALL_WIDTH, LARGE_WIDTH, MEDIUM_WIDTH],
			Extrapolation.CLAMP,
		);

		const scale = interpolate(
			scrollX.value,
			inputRange,
			[0.9, 1, 0.95],
			Extrapolation.CLAMP,
		);

		return {
			width,
			marginRight: ITEM_SPACING,
			transform: [{ scale }],
		};
	});

	return (
		<Animated.View style={[styles.itemContainer, animatedStyle]}>
			{renderItem(item)}
		</Animated.View>
	);
}

export default function MaterialCarousel<T>({
	data,
	renderItem,
}: MaterialCarouselProps<T>) {
	const scrollX = useSharedValue(0);

	const onScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;
		},
	});

	return (
		<Animated.FlatList
			horizontal
			data={data}
			keyExtractor={(_, i) => i.toString()}
			showsHorizontalScrollIndicator={false}
			snapToInterval={MEDIUM_WIDTH + ITEM_SPACING}
			decelerationRate='fast'
			contentContainerStyle={{
				paddingHorizontal: 16,
			}}
			onScroll={onScroll}
			scrollEventThrottle={16}
			renderItem={({ item, index }) => (
				<CarouselItem
					item={item}
					index={index}
					scrollX={scrollX}
					renderItem={renderItem}
				/>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	itemContainer: {
		height: 180,
	},
});
