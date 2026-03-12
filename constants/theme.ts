/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
	light: {
		onPrimary: "#fff",
		onTertiary: "#fff",
		secondary: "#006A6A",
		tertiary: "#904B3C",
		onSecondary: "#fff",
		onSurface: "#46464F",
		surfaceBright: "#FBF8FF",
		primary: "#5f5791",
		primaryContainer: "#e5deff",
		surfaceContainer: "#EFEDF4",
		text: "#11181C",
		background: "#FDF8FF",
		tint: tintColorLight,
		icon: "#687076",
		tabIconDefault: "#687076",
		tabIconSelected: tintColorLight,
	},
	dark: {
		secondary: "#80D4D5",
		surfaceBright: "#39393F",
		tertiary: "#FFB4A4",
		onSecondary: "#003737",
		onTertiary: "#561F13",
		onSurface: "#C6C5D0",
		onPrimary: "#30285F",
		primary: "#c8bfff",
		primaryContainer: "#473f77",
		surfaceContainer: "#1F1F25",
		text: "#ECEDEE",
		background: "#141318",
		tint: tintColorDark,
		icon: "#9BA1A6",
		tabIconDefault: "#9BA1A6",
		tabIconSelected: tintColorDark,
	},
};

export const Fonts = Platform.select({
	ios: {
		/** iOS `UIFontDescriptorSystemDesignDefault` */
		sans: "system-ui",
		/** iOS `UIFontDescriptorSystemDesignSerif` */
		serif: "ui-serif",
		/** iOS `UIFontDescriptorSystemDesignRounded` */
		rounded: "ui-rounded",
		/** iOS `UIFontDescriptorSystemDesignMonospaced` */
		mono: "ui-monospace",
	},
	default: {
		sans: "normal",
		serif: "serif",
		rounded: "normal",
		mono: "monospace",
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded:
			"'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});
