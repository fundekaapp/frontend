import { StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";

export default function Page({
	children,
	style,
}: {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
}) {
	const { width, height } = useWindowDimensions();

	return (
		<View
			style={[
				{
					paddingLeft: width > 800 ? 120 : 16,
					display: "flex",
					justifyContent: "space-around",
					paddingHorizontal: 16,
					paddingTop: width > 800 ? 148 : 16,
					maxWidth: 1200,
					position: "relative",
					width: "100%",
					alignSelf: "center",
					minHeight: height,
				},
				style,
			]}
		>
			{children}
		</View>
	);
}
