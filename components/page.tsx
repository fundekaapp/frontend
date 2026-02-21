import { View } from "react-native";

export default function Page({ children }: { children: React.ReactNode }) {
	return (
		<View
			style={{
				alignItems: "center",
				justifyContent: "center",
				paddingHorizontal: 16,
				marginHorizontal: "auto",
				maxWidth: 1200,
				width: "100%",
			}}
		>
			{children}
		</View>
	);
}
