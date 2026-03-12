import { useThemeColor } from "@/hooks/use-theme-color";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import {
	LayoutChangeEvent,
	StyleSheet,
	useWindowDimensions,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import TabBarButton from "./TabBarButton";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
	const { width } = useWindowDimensions();
	const isMediumOrLarger = width >= 600;

	// Colors
	const primaryContainer = useThemeColor({}, "primaryContainer");
	const primary = useThemeColor({}, "primary");
	const onPrimary = useThemeColor({}, "onPrimary");
	const onSurface = useThemeColor({}, "onSurface");

	const [dimensions, setDimensions] = useState<{
		height: number;
		width: number;
	}>({ height: 20, width: 100 });
	const buttonWidth = isMediumOrLarger
		? dimensions.height / state.routes.length
		: dimensions.width / state.routes.length;

	const onTabbarLayout = (e: LayoutChangeEvent) => {
		setDimensions({
			height: e.nativeEvent.layout.height,
			width: e.nativeEvent.layout.width,
		});
	};

	const tabPositionX = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: isMediumOrLarger
				? [{ translateY: tabPositionX.value }]
				: [{ translateX: tabPositionX.value }],
		};
	});

	return (
		<View
			onLayout={onTabbarLayout}
			style={[
				styles.tabbar,
				isMediumOrLarger ? styles.sidebar : styles.bottomBar,
				{ backgroundColor: primaryContainer },
			]}
		>
			<Animated.View
				style={[
					animatedStyle,
					{
						position: "absolute",
						backgroundColor: primary,
						borderRadius: 50,
						marginHorizontal: 8,
						height: isMediumOrLarger
							? buttonWidth - 16
							: dimensions.height - 15,
						width: isMediumOrLarger ? dimensions.width - 15 : buttonWidth - 16,
					},
				]}
			></Animated.View>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label = options.tabBarLabel ?? options.title ?? route.name;
				const isFocused = state.index === index;

				const onPress = () => {
					tabPositionX.value = withSpring(buttonWidth * index, {
						duration: 500,
					});
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name, route.params);
					}
				};

				return (
					<TabBarButton
						key={route.name}
						onPress={onPress}
						isFocused={isFocused}
						routeName={route.name}
						color={isFocused ? onPrimary : onSurface}
						label={label}
					/>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	tabbar: {
		position: "absolute",
		shadowRadius: 20,
		shadowOpacity: 1,
	},
	bottomBar: {
		bottom: 30,
		width: "90%",
		height: 64,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 25,
		paddingVertical: 15,
		borderRadius: 50,
		paddingBottom: 8,
	},
	sidebar: {
		left: 24,
		top: "20%",
		height: "60%",
		width: 80,
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 15,
		borderRadius: 50,
	},
});
