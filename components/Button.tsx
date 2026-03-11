import { useContext } from "react";
import { ColorValue, StyleSheet, Text, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { ButtonGroupContext } from "../context/ButtonGroupContext";
import { IconSymbol, IconSymbolName } from "./ui/icon-symbol";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonType =
	| "circle"
	| "square"
	| "pill"
	| "pill-narrow" // portrait pill — width < height, fully rounded
	| "wide-pill"
	| "stadium"
	| "stadium-left" // flat on left,  rounded on right  (leads a group row)
	| "stadium-right"; // rounded on left, flat on right  (ends a group row)

export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = {
	title?: string;
	backgroundColor?: ColorValue;
	textColor?: ColorValue;
	type?: ButtonType;
	size?: ButtonSize;
	onPress?: () => void;
	disabled?: boolean;
	icon?: IconSymbolName;
	/** Injected by ButtonGroup — do not set manually */
	index?: number;
};

// ─── Spring configs (M3 Expressive) ───────────────────────────────────────────

const PRESS_SPRING = { damping: 14, stiffness: 400, mass: 0.6 };
const RELEASE_SPRING = { damping: 18, stiffness: 300, mass: 0.6 };

const SELF_SCALE = 1.09;
const NEIGHBOR_TRANSLATE = 5; // px nudge away from the pressed button
const NEIGHBOR_SCALE_X = 0.93; // horizontal compression on neighbors

// ─── Component ────────────────────────────────────────────────────────────────

export default function Button({
	title,
	backgroundColor = "#a89cef",
	textColor = "#1a1a2e",
	type = "pill",
	size = "medium",
	onPress,
	disabled = false,
	index,
	icon,
}: ButtonProps) {
	const group = useContext(ButtonGroupContext);
	const isInGroup = group !== null && index !== undefined;

	// Standalone press tracker (only used outside a group)
	const standalonePressed = useSharedValue(0);

	// ── Gesture ────────────────────────────────────────────────────────────────
	const gesture = Gesture.Tap()
		.enabled(!disabled)
		.onBegin(() => {
			if (isInGroup) {
				group!.pressedIndex.value = index!;
			} else {
				standalonePressed.value = withSpring(1, PRESS_SPRING);
			}
		})
		.onFinalize(() => {
			if (isInGroup) {
				group!.pressedIndex.value = withSpring(
					-1,
					RELEASE_SPRING,
				) as unknown as number;
			} else {
				standalonePressed.value = withSpring(0, RELEASE_SPRING);
			}
			if (onPress) runOnJS(onPress)();
		});

	// ── Animated style ─────────────────────────────────────────────────────────
	const animatedStyle = useAnimatedStyle(() => {
		if (isInGroup) {
			const pi = group!.pressedIndex.value;

			// Nobody pressed — every button springs back to identity
			if (pi < 0) {
				return {
					transform: [
						{ scale: withSpring(1, RELEASE_SPRING) },
						{ scaleX: withSpring(1, RELEASE_SPRING) },
						{ translateX: withSpring(0, RELEASE_SPRING) },
					],
					zIndex: 0,
				};
			}

			const dist = Math.abs((index as number) - pi);

			// This button is being pressed
			if (dist === 0) {
				return {
					transform: [
						{ scale: withSpring(SELF_SCALE, PRESS_SPRING) },
						{ scaleX: withSpring(1, PRESS_SPRING) },
						{ translateX: withSpring(0, PRESS_SPRING) },
					],
					zIndex: 10,
				};
			}

			// Immediate neighbor — nudge away + compress
			if (dist === 1) {
				const direction = (index as number) < pi ? -1 : 1;
				return {
					transform: [
						{ scale: withSpring(1, PRESS_SPRING) },
						{ scaleX: withSpring(NEIGHBOR_SCALE_X, PRESS_SPRING) },
						{
							translateX: withSpring(
								direction * NEIGHBOR_TRANSLATE,
								PRESS_SPRING,
							),
						},
					],
					zIndex: 0,
				};
			}

			// dist >= 2 — spring to identity (not a raw value — avoids snap)
			return {
				transform: [
					{ scale: withSpring(1, RELEASE_SPRING) },
					{ scaleX: withSpring(1, RELEASE_SPRING) },
					{ translateX: withSpring(0, RELEASE_SPRING) },
				],
				zIndex: 0,
			};
		}

		// Standalone
		const s = 1 - standalonePressed.value * 0.06;
		return { transform: [{ scale: withSpring(s, PRESS_SPRING) }], zIndex: 0 };
	});

	// ── Shape & layout ─────────────────────────────────────────────────────────
	const shapeStyle = getShapeStyle(type, size);
	const sizeStyle = styles[`size_${size}` as keyof typeof styles] as ViewStyle;

	const baseStyle: ViewStyle = {
		...styles.base,
		...sizeStyle,
		...shapeStyle,
		backgroundColor: backgroundColor as string,
		opacity: disabled ? 0.4 : 1,
	};

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View style={[baseStyle, animatedStyle]}>
				{title ? (
					<Text
						style={[
							styles.text,
							{ color: textColor as string },
							styles[`textSize_${size}` as keyof typeof styles] as object,
						]}
						numberOfLines={1}
					>
						{title}
					</Text>
				) : null}
				{icon ? <IconSymbol color={textColor} name={icon} size={24} /> : null}
			</Animated.View>
		</GestureDetector>
	);
}

// ─── Shape geometry ───────────────────────────────────────────────────────────

function getShapeStyle(type: ButtonType, size: ButtonSize): ViewStyle {
	const R = { small: 18, medium: 28, large: 40 }; // full round
	const S = { small: 8, medium: 12, large: 18 }; // square corner
	const r = R[size];
	const s = S[size];

	const radii: Record<ButtonType, object> = {
		circle: { borderRadius: r },
		square: { borderRadius: s },
		pill: { borderRadius: r },
		"pill-narrow": { borderRadius: r },
		"wide-pill": { borderRadius: r },
		stadium: { borderRadius: r },
		"stadium-left": {
			borderTopLeftRadius: s,
			borderBottomLeftRadius: s,
			borderTopRightRadius: r,
			borderBottomRightRadius: r,
		},
		"stadium-right": {
			borderTopLeftRadius: r,
			borderBottomLeftRadius: r,
			borderTopRightRadius: s,
			borderBottomRightRadius: s,
		},
	};

	const widths: Record<ButtonSize, Record<ButtonType, number>> = {
		small: {
			circle: 36,
			square: 52,
			pill: 52,
			"pill-narrow": 28, // narrower than height (36) → portrait pill
			"wide-pill": 390,
			stadium: 68,
			"stadium-left": 68,
			"stadium-right": 68,
		},
		medium: {
			circle: 56,
			square: 80,
			pill: 80,
			"pill-narrow": 44, // narrower than height (56) → portrait pill
			"wide-pill": 172,
			stadium: 100,
			"stadium-left": 100,
			"stadium-right": 100,
		},
		large: {
			circle: 80,
			square: 120,
			pill: 120,
			"pill-narrow": 60, // narrower than height (80) → portrait pill
			"wide-pill": 252,
			stadium: 148,
			"stadium-left": 148,
			"stadium-right": 148,
		},
	};

	const heights: Record<ButtonSize, number> = {
		small: 36,
		medium: 56,
		large: 80,
	};

	return {
		...(radii[type] as object),
		width: widths[size][type],
		height: heights[size],
	};
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	base: {
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		maxWidth: 390,
	},

	size_small: { paddingHorizontal: 10, paddingVertical: 6 },
	size_medium: { paddingHorizontal: 16, paddingVertical: 10 },
	size_large: { paddingHorizontal: 24, paddingVertical: 16 },

	textSize_small: { fontSize: 11, fontWeight: "600" },
	textSize_medium: { fontSize: 14, fontWeight: "600" },
	textSize_large: { fontSize: 18, fontWeight: "700" },

	text: { letterSpacing: 0.3 },
});
