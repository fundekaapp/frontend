import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "./themed-text";

type CourseCardProps = {
	id: number;
	title: string;
	icon: string;
	color: string;
};

export default function CourseCard({
	title,
	icon,
	color,
	id,
}: CourseCardProps) {
	const router = useRouter();
	return (
		<Pressable
			onPress={() =>
				router.push({
					pathname: "/course/[courseId]",
					params: { courseId: id },
				})
			}
			style={styles.container}
		>
			<View style={styles.container}>
				<View style={[styles.iconContainer, { backgroundColor: color }]}>
					<Text style={styles.icon}>{icon}</Text>
				</View>
				<ThemedText type='title' style={styles.title}>
					{title}
				</ThemedText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		alignItems: "center",
		marginHorizontal: 4,
	},
	iconContainer: {
		width: 128,
		height: 128,
		borderRadius: 24,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 4,
	},
	title: {
		alignSelf: "center",
		textAlign: "center",
		width: 128,
	},
	icon: {
		fontSize: 64,
	},
});
