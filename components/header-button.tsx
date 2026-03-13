import { useRouter } from "expo-router";
import { ReactNode } from "react";
import {
	ColorValue,
	Image,
	ImageSource,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import { IconSymbol, IconSymbolName } from "./ui/icon-symbol";

type HeaderButtonProps = {
	onPress: () => void;
	icon?: IconSymbolName; // icon name for IconSymbol
	color?: ColorValue;
	image?: ImageSource;
	children?: ReactNode; // override content (text/image/etc)
};

export default function HeaderButton({
	onPress,
	icon,
	color,
	children,
	image,
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
				) : image ? (
					<Image style={{ width: 24, height: 24 }} source={image} />
				) : null}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		marginHorizontal: 16,
	},
	content: {
		justifyContent: "center",
		alignItems: "center",
	},
});
