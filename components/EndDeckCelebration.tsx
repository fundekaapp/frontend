import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import Celebration1 from "./animations/celebration1";
import Button from "./Button";
import ListItem from "./list-item";
import Page from "./page";
import { ThemedText } from "./themed-text";

type EndDeckCelebrationProps = {
	accuracy: number;
	cards: number;
	speed: number;
	redo: () => void;
};

export default function EndDeckCelebration({
	accuracy,
	cards,
	redo,
	speed,
}: EndDeckCelebrationProps) {
	const primary = useThemeColor({}, "primary");
	const secondary = useThemeColor({}, "secondary");
	const tertiary = useThemeColor({}, "tertiary");
	const onPrimary = useThemeColor({}, "onPrimary");
	const onSecondary = useThemeColor({}, "onSecondary");
	const onTertiary = useThemeColor({}, "onTertiary");
	const router = useRouter();

	return (
		<Page style={{ justifyContent: "center", alignItems: "center" }}>
			<ThemedText
				style={{ textAlign: "center", alignSelf: "center" }}
				type='display'
			>
				Deck Complete
			</ThemedText>
			<Celebration1 />
			<View>
				<ListItem
					color={primary}
					icon='scope'
					onColor={onPrimary}
					title='Accuracy'
					valueRight={`${accuracy}%`}
					type='top'
				/>
				<ListItem
					color={secondary}
					icon='square.stack.fill'
					onColor={onSecondary}
					title='Cards'
					valueRight={`${cards}`}
					type='middle'
				/>
				<ListItem
					color={tertiary}
					icon='stopwatch.fill'
					onColor={onTertiary}
					title='Speed'
					valueRight={`${speed}`}
					type='bottom'
				/>
			</View>
			<ThemedText style={{ textAlign: "center", alignSelf: "center" }}>
				Well done you have mastered the topic
			</ThemedText>
			<Button onPress={() => router.back()} title='Continue' type='wide-pill' />
			<Pressable onPress={() => redo()}>
				<ThemedText>Redo Deck</ThemedText>
			</Pressable>
		</Page>
	);
}
