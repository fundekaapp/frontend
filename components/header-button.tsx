import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";

type HeaderButtonProps = {
	onPress: () => void;
	icon?: string; // icon name for IconSymbol
	color?: string;
	children?: ReactNode; // override content (text/image/etc)
};

export default function HeaderButton({
	onPress,
	icon,
	color,
	children,
}: HeaderButtonProps) {
	const router = useRouter();

	return (
		<Pressable
			onPress={() => onPress()}
			style={({ pressed }) => [styles.button, { opacity: pressed ? 0.5 : 1 }]}
		>
			<View style={styles.content}>
				{children ? (
					children
				) : icon ? (
					<IconSymbol color={color} name={icon} size={24} />
				) : null}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		marginRight: 16,
	},
	content: {
		justifyContent: "center",
		alignItems: "center",
	},
});
