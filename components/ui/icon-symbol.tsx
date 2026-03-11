// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
	SymbolViewProps["name"],
	ComponentProps<typeof MaterialIcons>["name"]
>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
	// ── Navigation ─────────────────────────────────────────────────────────
	"house.fill": "home",
	"book.fill": "book",
	"chart.bar": "bar-chart",
	"clock.fill": "access-time",

	// ── Stats ──────────────────────────────────────────────────────────────
	scope: "my-location", // Accuracy — crosshair precision
	"square.stack.fill": "layers", // Cards — stacked layers
	"stopwatch.fill": "timer", // Speed — stopwatch

	// ── Playback buttons ───────────────────────────────────────────────────
	"play.fill": "play-arrow", // Play
	"arrow.counterclockwise": "replay", // Reset / Replay
	"forward.end.fill": "skip-next", // Next / Skip
	"pause.fill": "pause",

	// ── End-of-deck celebration ────────────────────────────────────────────
	"party.popper.fill": "celebration", // Confetti moment
	"star.fill": "star", // Achievement
	"trophy.fill": "emoji-events", // Trophy
	"checkmark.seal.fill": "verified", // All done / mastered

	// ── Legacy ─────────────────────────────────────────────────────────────
	gear: "settings",
	target: "circle",
	rectangle: "rectangle",
	clock: "watch",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
	name,
	size = 24,
	color,
	style,
}: {
	name: IconSymbolName;
	size?: number;
	color: string | OpaqueColorValue;
	style?: StyleProp<TextStyle>;
	weight?: SymbolWeight;
}) {
	return (
		<MaterialIcons
			color={color}
			size={size}
			name={MAPPING[name]}
			style={style}
		/>
	);
}
