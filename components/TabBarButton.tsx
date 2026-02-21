import { LabelPosition } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import React, { ReactNode, useEffect } from "react";
import {
	Pressable,
	StyleSheet,
	useColorScheme,
	useWindowDimensions,
} from "react-native";
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { icon } from "../constants/icon";

interface TabBarButtonProps {
	onPress: Function;
	onLongPress?: Function;
	isFocused: boolean;
	routeName: string;
	color: string;
	label:
		| string
		| ((props: {
				focused: boolean;
				color: string;
				position: LabelPosition;
				children: string;
		  }) => ReactNode);
}

export default function TabBarButton({
	onPress,
	onLongPress,
	isFocused,
	routeName,
	color,
	label,
}: TabBarButtonProps) {
	const theme = useColorScheme();
	const { width } = useWindowDimensions(); // Get screen width
	const isMediumOrLarger = width >= 768; // Breakpoint for column mode

	const scale = useSharedValue(0);

	useEffect(() => {
		scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
	}, [scale, isFocused]);

	const animatedTextStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scale.value, [0, 1], [1, 0]);
		return { opacity };
	});

	const animatedIconStyle = useAnimatedStyle(() => {
		const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
		const top = interpolate(scale.value, [0, 1], [0, 9]);
		return {
			transform: [{ scale: scaleValue }],
			top,
		};
	});

	return (
		<Pressable
			style={[
				styles.tabbarItem,
				isMediumOrLarger && styles.tabbarItemLarge, // Apply wider style for larger screens
			]}
			onPress={onPress}
			onLongPress={onLongPress}
		>
			<Animated.View style={[animatedIconStyle]}>
				{icon[routeName]({
					color,
				})}
			</Animated.View>

			<Animated.Text
				style={[
					{
						color: isFocused
							? "#9C85FF"
							: theme === "light"
								? "rgba(0,0,0,0.5)"
								: "rgba(255, 255, 255, 0.5)",
						fontSize: 12,
					},
					animatedTextStyle,
				]}
			>
				{label}
			</Animated.Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	tabbarItem: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
		paddingVertical: 10, // Keep it balanced
		paddingHorizontal: 15, // Default width
	},
	tabbarItemLarge: {
		width: 90, // Increase width for square shape on larger screens
		height: 90, // Keep it proportional
		borderRadius: 15, // Slightly rounded
	},
});
