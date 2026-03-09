import { StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";

export default function Page({
	children,
	style,
}: {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
}) {
	const { width } = useWindowDimensions();

	return (
		<View
			style={[
				{
					paddingLeft: width > 800 ? 120 : 16,
					justifyContent: "space-around",
					paddingHorizontal: 16,
					paddingTop: width > 800 ? 148 : 16,
					maxWidth: 1200,
					width: "100%",
					alignSelf: "center",
				},
				style,
			]}
		>
			{children}
		</View>
	);
}
