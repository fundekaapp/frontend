import React, { Children, cloneElement, isValidElement } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { ButtonGroupContext } from "../context/ButtonGroupContext";
import { ButtonProps } from "./Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Orientation = "horizontal" | "vertical";

type ButtonGroupProps = {
	children: React.ReactNode;
	orientation?: Orientation;
	gap?: number;
	/** Visual container: renders the pill-shaped group border shown in the mockup */
	showContainer?: boolean;
	containerColor?: string;
	containerBorderColor?: string;
	style?: ViewStyle;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ButtonGroup({
	children,
	orientation = "horizontal",
	gap = 8,
	showContainer = false,
	containerColor = "transparent",
	containerBorderColor = "#a89cef",
	style,
}: ButtonGroupProps) {
	// Single shared value owned here — passed to all children via context
	const pressedIndex = useSharedValue<number>(-1);

	// Inject `index` into each direct Button child
	const enhancedChildren = Children.map(children, (child, i) => {
		if (!isValidElement<ButtonProps>(child)) return child;
		return cloneElement(child, { index: i } as Partial<ButtonProps>);
	});

	const isHorizontal = orientation === "horizontal";

	const containerStyle: ViewStyle = {
		...(showContainer ? styles.container : {}),
		...(showContainer
			? {
					backgroundColor: containerColor,
					borderColor: containerBorderColor,
					borderRadius: 999,
					paddingHorizontal: isHorizontal ? 10 : 8,
					paddingVertical: isHorizontal ? 8 : 10,
				}
			: {}),
	};

	const rowStyle: ViewStyle = {
		flexDirection: isHorizontal ? "row" : "column",
		alignItems: "center",
		gap,
	};

	return (
		<ButtonGroupContext.Provider value={{ pressedIndex }}>
			<View style={[containerStyle, style]}>
				<View style={rowStyle}>{enhancedChildren}</View>
			</View>
		</ButtonGroupContext.Provider>
	);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	container: {
		borderWidth: 1.5,
		alignSelf: "flex-start",
	},
});
