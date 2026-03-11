import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { Text, View } from "react-native";

export default function Celebration1() {
	return (
		<View style={{ justifyContent: "center" }}>
			<WithSkiaWeb
				opts={{
					locateFile: (file) => `/canvaskit/${file}`,
				}}
				getComponent={() => import("@/components/animations/mascot")}
				fallback={<Text>Loading...</Text>}
			/>
		</View>
	);
}
