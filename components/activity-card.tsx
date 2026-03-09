import CircularProgress from "@/components/circle-loader";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type ActivityCardProps = {
	icon: string;
	title: string;
	type: "lesson" | "quiz";
	completion: number;
	color: string;
};

export default function ActivityCard({
	icon,
	title,
	type,
	completion,
	color,
}: ActivityCardProps) {
	const surfaceContainer = useThemeColor({}, "surfaceContainer");
	const router = useRouter();
	return (
		<Pressable
			onPress={() => router.push("/course/1/1")}
			style={[styles.container, { backgroundColor: surfaceContainer }]}
		>
			<View style={[styles.iconContainer, { backgroundColor: color }]}>
				<ThemedText style={{ fontSize: 32 }}>{icon}</ThemedText>
			</View>
			<View style={{ flex: 1, marginLeft: 12 }}>
				<ThemedText
					style={{ width: "90%" }}
					type='subtitle'
					numberOfLines={1}
					ellipsizeMode='tail'
				>
					{title}
				</ThemedText>
				<ThemedText>{type === "lesson" ? "Lesson" : "Quiz"}</ThemedText>
			</View>
			<View style={{ width: 32, height: 32, marginLeft: 8 }}>
				<CircularProgress
					width={32}
					height={32}
					stroke={2}
					progress={completion}
					color={color}
				/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		maxWidth: 390,
		width: "100%",
		height: 72,
		borderRadius: 22,
		padding: 8,
		paddingRight: 16,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: 4,
	},
	iconContainer: {
		width: 56,
		height: 56,
		borderRadius: 14,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	progressText: {
		fontSize: 10,
		alignSelf: "center",
		fontWeight: "600",
	},
});
