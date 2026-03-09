import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { database } from "@/hooks/useDatabase";
import { useEffect, useState } from "react";
import { Clipboard, Linking, View } from "react-native";
import { Markdown } from "react-native-remark";

const markdowns = `
# Hello World! 👋

This is a **Markdown** example with [a link](https://reactnative.dev).

- List item 1
- List item 2
> testing quote
 
`;

export default function LessonPage() {
	const [markdown, setMarkdown] = useState();
	const textColor = useThemeColor({}, "text");
	const backgroundColor = useThemeColor({}, "background");
	const onPrimary = useThemeColor({}, "onPrimary");

	useEffect(() => {
		// define async function inside useEffect
		async function fetchData() {
			try {
				const data = await database.getLesson("2MI");
				setMarkdown(data.content);
			} catch (err) {
				console.error("Failed to fetch lesson:", err);
			}
		}

		fetchData(); // call it
	}, []); // empty array = run once on mount

	return (
		<ParallaxScrollView
			headerBackgroundColor={{
				dark: backgroundColor,
				light: backgroundColor,
			}}
			headerImage={
				<View
					style={{
						backgroundColor: "#C8BFFF",
						height: 240,
						borderRadius: 24,
					}}
				>
					<ThemedText style={{ color: onPrimary }} type='display'>
						Newtons laws of motion
					</ThemedText>
				</View>
			}
		>
			<Markdown
				markdown={markdown}
				customRenderers={{
					// Override default renderers for mdast nodes.
					// Checkout https://github.com/imwithye/react-native-remark/blob/main/src/renderers/index.tsx
					// for the default renderers.
					InlineCodeRenderer: ({ node }) => (
						<ThemedText style={{ color: "blue" }}>{node.value}</ThemedText>
					),
					ThematicBreakRenderer: () => (
						<View style={{ height: 5, backgroundColor: "red" }} />
					),
				}}
				customStyles={{
					// Override default styles
					// Checkout https://github.com/imwithye/react-native-remark/blob/main/src/themes/default.tsx
					// for the default styles.
					inlineCode: {
						color: textColor,
					},
					text: {
						color: textColor,
					},
				}}
				onCodeCopy={(code) => Clipboard.setString(code)}
				onLinkPress={(url) => Linking.openURL(url)}
			/>
		</ParallaxScrollView>
	);
}
