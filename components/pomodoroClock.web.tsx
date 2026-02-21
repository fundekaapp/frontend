import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { Text, View } from "react-native";

export default function PomodoroClock() {
	return (
		<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<WithSkiaWeb
				opts={{
					locateFile: (file) => `/canvaskit/${file}`,
				}}
				getComponent={() => import("@/components/wavyLoader")}
				fallback={<Text>Loading...</Text>}
			/>
		</View>
	);
}
