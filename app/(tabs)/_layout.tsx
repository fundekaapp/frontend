import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import HeaderButton from "@/components/header-button";
import { TabBar } from "@/components/TabBar";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image, StyleSheet, View } from "react-native";

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const color = useThemeColor({}, "background");

	return (
		<Tabs
			tabBar={(props) => <TabBar {...props} />}
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerStyle: { backgroundColor: color },
				headerShown: true,
				headerShadowVisible: false,
				tabBarButton: HapticTab,
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: "Home",
					headerTitle: "",
					animation: "shift",
					headerLeft: () => (
						<View style={styles.headerFlex}>
							<HeaderButton
								image={require("@/assets/images/avatar.png")}
								color={"#ffffff"}
								// icon='bolt.fill'
								onPress={() => console.log("settings page")}
							/>
							<Image
								source={require("@/assets/images/header-logo.png")}
								style={{ height: 72, width: 128 }}
							/>
						</View>
					),
					headerRight: () => (
						<View style={styles.headerFlex}>
							<HeaderButton
								icon='bolt.fill'
								color='#ffffff'
								onPress={() => console.log("streakpage")}
							/>
							<HeaderButton
								icon='calendar'
								color='#ffffff'
								onPress={() => console.log("streakpage")}
							/>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name='library'
				options={{
					title: "Library",
					animation: "shift",
				}}
			/>
			<Tabs.Screen
				name='stats'
				options={{
					title: "Stats",
					animation: "shift",
					headerTitle: "Study Stats",
				}}
			/>
			<Tabs.Screen
				name='pomodoro'
				options={{
					title: "Pomodoro",
					animation: "shift",
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	headerFlex: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
});
