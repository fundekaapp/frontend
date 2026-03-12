import { useColorScheme } from "@/hooks/use-color-scheme";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export const unstable_settings = {
	anchor: "(tabs)",
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [fontsLoaded] = useFonts({
		Audiowide: require("../assets/fonts/Audiowide-Regular.ttf"),
	});

	if (!fontsLoaded) return null;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					<Stack.Screen
						name='modal'
						options={{ presentation: "modal", title: "Modal" }}
					/>

					<Stack.Screen
						name='course/[courseId]'
						options={{ presentation: "modal", title: "Modal" }}
					/>
				</Stack>
				<StatusBar style='auto' />
			</ThemeProvider>
		</GestureHandlerRootView>
	);
}
