import { useThemeColor } from "@/hooks/use-theme-color";
import { ColorValue, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol, IconSymbolName } from "./ui/icon-symbol";

type ListItemProps = {
	icon: IconSymbolName;
	color: ColorValue;
	onColor: ColorValue;
	title: string;
	valueRight: string;
	type: "top" | "bottom" | "middle";
};
export default function ListItem({
	color,
	icon,
	onColor,
	title,
	valueRight,
	type,
}: ListItemProps) {
	const backgroundColor = useThemeColor({}, "surfaceContainer");
	return (
		<View
			style={[
				styles.container,
				{ backgroundColor },
				type === "top" && styles.topItem,
				type === "bottom" && styles.bottomItem,
			]}
		>
			<View style={styles.titleAndIconContainer}>
				<View style={[styles.iconContainer, { backgroundColor: color }]}>
					<IconSymbol name={icon} color={onColor} />
				</View>
				<ThemedText type='title' style={{ alignSelf: "center" }}>
					{title}
				</ThemedText>
			</View>
			<ThemedText style={{ color, alignSelf: "center" }}>
				{valueRight}
			</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 390,
		height: 56,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 8,
		borderRadius: 5,
		marginVertical: 2,
	},
	topItem: {
		borderTopEndRadius: 10,
		borderTopStartRadius: 10,
	},
	bottomItem: {
		borderBottomEndRadius: 10,
		borderBottomStartRadius: 10,
	},
	iconContainer: {
		width: 40,
		height: 40,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
		marginRight: 8,
	},
	titleAndIconContainer: {
		marginLeft: 8,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	rightValue: {},
});
